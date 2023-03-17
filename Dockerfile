FROM node:lts-alpine AS app

# 将应用程序代码复制到容器中
WORKDIR /app
COPY . .

# 安装依赖项
RUN npm install --production --registry=https://registry.npm.taobao.org

# 设置环境变量
ENV NODE_ENV production

# 启动应用程序
CMD ["npx", "ts-node", "./index.ts"]