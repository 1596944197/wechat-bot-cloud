import { exec } from "child_process";
import dayjs from "dayjs";
import d from "dotenv";
import fetch from "node-fetch";
import qrcodeTerminal from "qrcode-terminal";
import { log, Message, WechatyBuilder } from "wechaty";
import type { AnyArr, ParamsType, ResponseType } from "./types";

d.config();
let command = "";
let loginUser;

if (process.platform === "win32") {
  command = `
  set WECHATY_LOG=verbose
  set WECHATY_PUPPET=wechaty-puppet-wechat
  `;
} else {
  command = `
  export WECHATY_LOG=verbose
  export WECHATY_PUPPET=wechaty-puppet-wechat
  `;
}

exec(command);

function onScan(qrcode, status) {
  qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console
  const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`;
  console.log(url);
}

function onLogin(user) {
  log.info("StarterBot", "%s login", user);
  loginUser = user;
}

function onLogout(user) {
  log.info("StarterBot", "%s logout", user);
  loginUser = null;
}

const replaceAt = (str: string) => {
  return str.toLowerCase().replace(/@.*\s/, "");
};

function renderInitMessage(): ParamsType["messages"] {
  return [
    {
      role: "system",
      content: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: ${dayjs().format(
        "YYYY-MM-DD"
      )}')}`,
    },
  ];
}

const params: ParamsType = {
  model: "gpt-3.5-turbo",
  messages: renderInitMessage(),
  temperature: 0.6,
  stream: true,
};

async function onMessage(msg: Message) {
  const text = msg.text();
  const room = msg.room();
  const type = msg.type();

  const mentionIdList: AnyArr = msg.payload!["mentionIdList"];
  if (
    room &&
    msg &&
    type === bot.Message.Type.Text &&
    mentionIdList.length === 1 &&
    mentionIdList.includes(loginUser.payload.id)
  ) {
    const filterText = replaceAt(text);
    if (filterText === "reset") {
      params.messages = renderInitMessage();
      room.say("已重置");
      return;
    }
    params.messages.push({
      role: "user",
      content: filterText,
    });
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        cookie: process.env.COOKIE ?? "",
        origin: "chrome-extension://iaakpnchhognanibcahlpcplchdfmgma",
      },
      body: JSON.stringify(params),
    })
      .then((res) => res.text())
      .then((m: string) => {
        const jsonData: ResponseType = m
          .split("\n")
          .filter((line) => line !== "" && line !== "data: [DONE]")
          .map((line) => line.replace("data: ", ""))
          .map((line) => JSON.parse(line));

        const AiText = jsonData
          .filter(({ choices: [{ finish_reason }] }) => !finish_reason)
          .map(({ choices: [{ delta }] }) => delta.content)
          .join("");
        params.messages.push({
          role: "assistant",
          content: AiText,
        });
        room.say(AiText);
      })
      .catch((e) => room.say("抱歉，出错了"));
  }
}

const bot = WechatyBuilder.build({
  name: "梅七七",
});

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);
bot.on("message", onMessage);

bot.start().then().catch(console.warn);
