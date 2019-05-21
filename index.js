const config =  require('./config')
const util = require('./util')

const Telegraf = require('telegraf')
const bot = new Telegraf(config.bot.token)

const Telegram = require('telegraf/telegram')
const mailman = new Telegram(config.bot.token)

const schedule = require('node-schedule')

const NFLNews = require('./consumers/nfl')
const Twitter = require('./consumers/twitter')
const Fantasy = require('./consumers/fantasy')
const BotManager = require('./manager')

let News = []
let Tweets = []
let FantasyTransactions = []
let ActiveChats = new Set()

/**
 * Update the database with the latest news and Tweets
 * @param fireDate Date The GMT date that the function was executed
 */
async function updateAndSend(fireDate) {
    let updatedNflNews = await NFLNews.getNews()
    let updatedTweets = await Twitter.getTweets()
    let updatedFantasyTransactions = await Fantasy.getFantasyLeagueTransaction()

    util.sendUpdatedContent(News, updatedNflNews, "news", ActiveChats, mailman)
    util.sendUpdatedContent(Tweets, updatedTweets, "twitter", ActiveChats, mailman)
    util.sendUpdatedContent(FantasyTransactions, updatedFantasyTransactions, "fantasy", ActiveChats, mailman)

    News = updatedNflNews
    Tweets = updatedTweets
    FantasyTransactions = updatedFantasyTransactions

    console.log(`Update contents at ${fireDate}`)
}

// Update the news every minute
schedule.scheduleJob('* * * * *', fireDate => updateAndSend(fireDate));

// Setup all bot actions
BotManager.setup(bot, mailman, ActiveChats, News, Tweets, FantasyTransactions)

// Start the bot
bot.startPolling()

console.log("Bot started...")
