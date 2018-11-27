# NFL NEWS for Telegram

This is a Telegram bot that provides the latest news about the NFL powered by [NewsAPI.org](https://newsapi.org) and
[NFLResearch @ Twitter](https://twitter.com/NFLResearch).
The bot will fetch news about the NFL every minute from their portal via [NewsAPI](https://newsapi.org) and send to all
clients that allowed the bot to do so.

My motto to create this bot came from my frustration to find a reliable service that notifies me about things related to
the league. I wanted to know about any player of all teams as soon as possible because I'm a fantasy aficionado and
information can be translated into fantasy points in this case.

# Using the bot

In order to use this bot you need to create a .ENV file with two specific keys:

* BOT_TOKEN: refers to the bot API token, which one you can get from [@BotFather](https://telegram.me/botfather);
* NEWS_API_TOKEN: refers to the [NewsAPI.org](https://newsapi.org) API token;
* TWITTER_CONSUMER_KEY: refers to the key of your [Twitter](https://twitter.com/) client;
* TWITTER_CONSUMER_SECRET: refers to the secret token of your [Twitter](https://twitter.com/) client.

You will need to apply for keys in [NewsAPI.org](https://newsapi.org/princing) and
[Twitter](https://developer.twitter.com/en/apply-for-access.html). After set this .ENV file with these six keys, just
run the command ```npm install && npm start```. This bot was built on top of NodeJS v8.9.4.

## Know Issues

* All chats ids will be lost if the bot resets.

## Disclaimer

If you plan to serve this bot to different users and not just for yourself you gonna probably will need a Privacy Police

## TODO

* Persist the chat ids;
* Aggregate posts from [NFL @ Instagram](https://www.instagram.com/nfl/).
* ~~Aggregate tweets from [@NFLResearch](https://twitter.com/NFLResearch) for real time statistics about the games~~
* ~~Build a more elegant message, possibly using MarkDown instead using images with caption.~~