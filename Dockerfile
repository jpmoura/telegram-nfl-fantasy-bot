FROM node:14-alpine
WORKDIR /usr/src/telegram-nfl-fantasy-bot
COPY .env ./
COPY dist/ ./
COPY package*.json ./
RUN [ "yarn", "install", "--production=true" ]
CMD [ "node", "index.js" ]
