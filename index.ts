import { exec } from "child_process";
import d from "dotenv";
import fetch from "node-fetch";
import qrcodeTerminal from "qrcode-terminal";
import { log, Message, WechatyBuilder } from "wechaty";

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
}

function onLogin(user) {
  log.info("StarterBot", "%s login", user);
  loginUser = user;
}

function onLogout(user) {
  log.info("StarterBot", "%s logout", user);
  loginUser = null;
}

const replaceAt = (str) => {
  const reg = /@\w+/g;
  return str.replace(reg, "");
};

async function onMessage(msg: Message) {
  const text = msg.text();
  const room = msg.room();
  const type = msg.type();

  debugger;
  const mentionIdList: AnyArr = msg.payload!["mentionIdList"];
  if (
    room &&
    msg &&
    type === bot.Message.Type.Text &&
    mentionIdList.length === 1 &&
    mentionIdList.includes(loginUser.payload.id)
  ) {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: process.env.OPENAI_API_KEY,
        "Content-Type": "application/json",
        cookie: process.env.COOKIE ? process.env.COOKIE : "",
        origin: "chrome-extension://iaakpnchhognanibcahlpcplchdfmgma",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        stream: true,
        temperature: 0.6,
        messages: [
          {
            content: text,
            role: "user",
          },
        ],
      }),
    })
      .then((res) => res.text())
      .then((m) => room.say(m))
      .catch((e) => console.log(e));
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
