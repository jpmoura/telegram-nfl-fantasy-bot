# Fantasy Bot for Telegram
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jpmoura_nfl-news-for-telegram&metric=alert_status)](https://sonarcloud.io/dashboard?id=jpmoura_nfl-news-for-telegram)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=jpmoura_nfl-news-for-telegram&metric=bugs)](https://sonarcloud.io/dashboard?id=jpmoura_nfl-news-for-telegram)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jpmoura_nfl-news-for-telegram&metric=code_smells)](https://sonarcloud.io/dashboard?id=jpmoura_nfl-news-for-telegram)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jpmoura_nfl-news-for-telegram&metric=coverage)](https://sonarcloud.io/dashboard?id=jpmoura_nfl-news-for-telegram)

This is a Telegram bot that provides the latest news about the NFL powered by [RotoWire](https://www.rotowire.com/) and [Twitter](https://twitter.com) accounts and about one [NFL Fantasy](https://fantasy.nfl.com/) league at your choice. The bot will fetch info about the NFL and the fantasy league every minute  and then it will send to all clients that allowed the bot to do so.

My motto to create this bot came from my frustration to find a reliable service that notifies me about things related to the league. I wanted to know about any player of all teams as soon as possible because I'm a fantasy aficionado and information can be translated into fantasy points in this case.

## Requirements

The only requirement it is at least a Node version that bundles the ```promisify``` utility (*i.e.* Node 8)

## Using the bot

In order to use this bot you need to create a .ENV file with two specific keys:

* BOT_TOKEN: refers to the bot API token, which one you can get from [@BotFather](https://telegram.me/botfather);
* TWITTER_CONSUMER_KEY: refers to the key of your [Twitter](https://twitter.com/) client;
* TWITTER_CONSUMER_SECRET: refers to the secret token of your [Twitter](https://twitter.com/) client;
* TWITTER_ACCOUNTS: refers to the accounts from [Twitter](https://twitter.com/) you wanna get tweets from;
* FANTASY_LEAGUE_ID: refers to the ID of your fantasy league.

You will need to apply for a key in [Twitter](https://developer.twitter.com/en/apply-for-access.html). After set this .ENV file with these five keys, just run the command ```npm install && npm start```.

This bot was built on top of NodeJS v8.9.4.

## Know Issues

* All chats ids will be lost if the bot resets.

## Disclaimer

If you plan to serve this bot to different users and not just for yourself you gonna probably will need a Privacy Police

## TODO

* Automatized tests that covers at least 80%;
* Persist the chat ids;
* More elegant message about Fantasy League transactions;
* Allow to add more than one fantasy league to update about it.
* Aggregate posts from [NFL @ Instagram](https://www.instagram.com/nfl/);
* Add Web User Interface to set the tokens and leagues ids;
* Dockerfile aiming a simple way to deploy the bot.
* ~~Aggregate tweets from [@NFLResearch](https://twitter.com/NFLResearch) for real time statistics about the games~~
* ~~Build a more elegant message, possibly using MarkDown instead using images with caption.~~