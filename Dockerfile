FROM node:12
WORKDIR /usr/src
RUN [ "git", "clone", "https://github.com/jpmoura/telegram-nfl-fantasy-bot.git"]
WORKDIR /usr/src/telegram-nfl-fantasy-bot
COPY .env ./
RUN [ "npm", "install"]
RUN [ "npm", "run", "tsc"]
CMD [ "npm", "start"]
