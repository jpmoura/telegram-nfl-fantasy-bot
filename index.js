require('dotenv').config()

const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

const Telegram = require('telegraf/telegram')
const mailman = new Telegram(process.env.BOT_TOKEN)

const NewsAPI = require('newsapi')
const newsApi = new NewsAPI(process.env.NEWS_API_TOKEN)

const Twit = require('twit')
const T = new Twit({
    consumer_key:    process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    app_only_auth:   true
})

const axios = require('axios')
const $ = require('cheerio')
const schedule = require('node-schedule')
const fantasyLeagueURL = `https://fantasy.nfl.com/league/${process.env.FANTASY_LEAGUE_ID}`

const SourceID = {
    twitter : "id",
    news: "title",
}

let News = []
let Tweets = []
let FantasyTransactions = []
let ActiveChats = new Set()

function updateArrayContent(newContents, media) {
    let updatedContent = []
    let oldContents = []
    let send = null
    let sourceMedia = null

    switch (media) {
        case "twitter":
            send = sendTweet
            sourceMedia = "Tweets"
            oldContents = Tweets
            break
        case "news":
            send = sendNews
            sourceMedia = "articles"
            oldContents = News
            break
    }

    if (oldContents.length === 0)
        updatedContent = newContents
    else
    {
        newContents.forEach(newContent => {
            let isOld = false

            oldContents.forEach(oldContent => {
                if (oldContent[SourceID[media]] === newContent[SourceID[media]])
                    isOld = true
            })

            if (!isOld)
                updatedContent.push(newContent)
        })
    }

    updatedContent.forEach(content => {
        ActiveChats.forEach(chatID => {
            send(chatID, content)
        })
    })

    if (updatedContent.length === 0)
        console.log(`Nothing new found on ${media}`)
    else
        console.log(`Sent ${updatedContent.length} new ${sourceMedia} to ${ActiveChats.size} clients`)

    return newContents
}

/**
 * Update the database with the latest news and Tweets
 * @param fireDate Date The GMT date that the function was executed
 */
function updateNews(fireDate) {
    // Articles from NFL News
    newsApi.v2.topHeadlines({sources: 'nfl-news'})
        .then(response => {
            News = updateArrayContent(response.articles, "news")
        })

    // Tweets from @NFLResearch
    T.get("statuses/user_timeline",
        {
            screen_name: "NFLResearch",
            count: 10,
            exclude_replies: true,
            include_rts: false,
            tweet_mode: "extended",
            trim_user: true
        },
        (err, data) =>
        {
            if (err)
                console.log(`Errors: ${err}`)
            else
                Tweets = updateArrayContent(data, "twitter")
        })

    // Get transactions from Fantasy League
    axios(fantasyLeagueURL)
        .then(response => {
            let videoRegex = /View\sVideos/gi
            let newsRegex = /View\sNews/gi
            let spaceRegex = /(.)\1{4,}/gi
            let updateTransactions = []
            let newTransactions = []

            let rawTransactions = ($('.textWrap p', response.data))
            rawTransactions.each((index, item) => {
                let transaction = $(item).text()

                transaction = transaction.replace(videoRegex, '')
                    .replace(newsRegex, '')
                    .replace(spaceRegex, ' ')

                newTransactions.push(transaction)
            })

            if (FantasyTransactions.length === 0)
                updateTransactions = newTransactions
            else
            {
                newTransactions.forEach(newTransaction => {
                    let isOld = false

                    FantasyTransactions.forEach(oldTransaction => {
                        if (oldTransaction === newTransaction)
                            isOld = true
                    })

                    if (!isOld)
                        updateTransactions.push(newTransaction)
                })
            }

            // send the new ones
            updateTransactions.forEach(transaction => {
                ActiveChats.forEach(chatId => {
                    sendFantasyTransaction(chatId, transaction)
                })
            })

            if (updateTransactions.length > 0)
                console.log(`Sent ${updateTransactions.length} fantasy transactions to ${ActiveChats.size} clients`)
            else
                console.log("Nothing new on fantasy league")

            FantasyTransactions = newTransactions
        })
        .catch(err => {
            console.log(`Error fetching fantasy transactions: ${err}`, err)
        })

    console.log(`Update contents at ${fireDate}`)
}

/**
 * Send a article to a specific chat with its image and title
 * @param chatID String|Integer The chat ID that will receive the article
 * @param article Object The object that represent article
 */
function sendNews(chatID, article) {
    mailman.sendMessage(
        chatID,
        `[${article.title}. Reported by ${article.author} at ${new Date(article.publishedAt).toString()}]
        (${article.urlToImage})\n\n[${article.description}](${article.url})`,
        {parse_mode: "Markdown"})
        .catch(err => {
            console.log(`Error sending article: ${err.message}`)
        })
}

/**
 * Send a tweet content to a specific chat
 * @param chatId Integer Chat that will receive the tweet
 * @param tweet Object Tweet object from the Twitter API
 */
function sendTweet(chatId, tweet) {
    let text

    if (tweet.truncated === true)
        text = tweet.text
    else
        text = tweet["full_text"]

    mailman.sendMessage(chatId, text, {parse_mode: "Markdown"})
        .catch(err => {
            console.log(`Error sending tweet: ${err.message}`)
        })
}

function sendFantasyTransaction(chatId, transaction) {
    mailman.sendMessage(chatId, `Fantasy transaction: ${transaction}`)
        .catch(err => {
            console.log(`Error sending transaction: ${err.message}`)
        })
}

// Update the news every minute
schedule.scheduleJob('* * * * *', fireDate => updateNews(fireDate));

// Global Commands
bot.start((ctx) => {
    ctx.replyWithMarkdown("Hey, if you want to receive news about the NFL just send me the command" +
        "`/firstdown` and I will start to send you the latest news about the league." +
        "I'm powered by [NewsAPI.org](https://newsapi.org)")
})

bot.help((ctx) =>
    ctx.replyWithMarkdown("*Hello there*. I can help you to keep up informed about the NFL." +
        "I understand the following commands:\n\n" +
        "`/firstdown` I will put you in my mailing list and will send you every update about the league\n" +
        "`/fumble` I will remove you from my mailing list and you will not receive my updates"))

/**
 * Insert a client in the mailing list
 */
bot.command("firstdown", (ctx) => {
    let chatId = ctx.message.chat.id
    ActiveChats.add(chatId)
    ctx.reply(`Gotcha ${ctx.message.chat.first_name}! From now on you will receive news about NFL as soon them are
    published 👌`)
    console.log(`New client ${chatId} added`)
})

/**
 * Remove a client from the mailing list
 */
bot.command("fumble", (ctx) => {
    let chatId = ctx.message.chat.id
    ActiveChats.delete(chatId)
    ctx.replyWithMarkdown("Ok then, you will not hear from me anymore 😭\n" +
        "If you change your mind, just send me `/firstdown` again 😉")
    console.log(`Chat ${chatId} removed from list`)
})

/**
 * Reply the client with the latest news and tweet
 */
bot.command('latest', (ctx) => {
    if (News.length === 0)
        ctx.reply("Sorry, I don't have the latest news yet 😥")
    else
    {
        sendNews(ctx.message.chat.id, News[0])
        sendTweet(ctx.message.chat.id, Tweets[0])
    }
})

// Easter eggs
bot.hears('Da Bears', (ctx) => ctx.reply('GO BEARS! 🐻⬇️'))

// Start the bot
bot.startPolling()
console.log("Bot started...")
