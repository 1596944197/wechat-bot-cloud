FROM node:16.15.1

# 安装 ts-node 和 pnpm
RUN npm install -g ts-node@10.8.1 pnpm

# 将应用程序代码复制到容器中
WORKDIR /app
COPY . .

# 安装依赖项
RUN pnpm install

# 启动应用程序
CMD ["pnpm", "start"]