# wechat-bot-cloud
部署在云，最简的微信机器人gpt 支持docket一键部署

### how to install 
```
pnpm i
npm install -g ts-node
```

### how to use
```
pnpm run start 
// or
ts-node index.ts
```

### how to use by docker
```
docker build -t chat-bot .
docker run -e OPENAI_API_KEY=<your openai key> -e OPENAI_API_BASE_URL=https://api.openai.com chat-bot
// or use my docker hub
docker run -e OPENAI_API_KEY=<your openai key> -e OPENAI_API_BASE_URL=https://api.openai.com 1596944197/chat-bot
```
