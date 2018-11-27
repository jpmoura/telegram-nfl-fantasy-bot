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

const schedule = require('node-schedule')

const SOURCES = {
    twitter : "id",
    instagram: "id",
    news: "title"
}

let latestNews = []
let tweets = []
let posts = []
let chats = new Set()

function updateArrayContent(newContents, media) {
    let updatedContent = []
    let oldContents = null
    let send = null
    let sourceMedia = null

    switch (media) {
        case "twitter":
            send = sendTweet
            sourceMedia = "tweets"
            oldContents = tweets
            break
        case "instagram":
            send = null
            sourceMedia = "posts"
            oldContents = posts
            break
        case "news":
            send = sendNews
            sourceMedia = "articles"
            oldContents = latestNews
            break
        default:
            send = null
            break
    }

    if(oldContents.length === 0) updatedContent = newContents
    else {
        newContents.forEach(newContent => {
            let isOld = false

            oldContents.forEach(oldContent => {
                if(oldContent[SOURCES[media]] === newContent[SOURCES[media]]){
                    isOld = true
                }
            })

            if(!isOld) updatedContent.push(newContent)
        })
    }

    updatedContent.forEach(content => {
        chats.forEach(chatID => {
            send(chatID, content)
        })
    })

    if(updatedContent.length === 0) console.log(`Nothing new found on ${media}`)
    else console.log(`Sent ${updatedContent.length} new ${sourceMedia} to ${chats.size} clients`)

    return newContents
}

/**
 * Update the database with the latest news and tweets
 * @param fireDate Date The GMT date that the function was executed
 */
function updateNews(fireDate) {
    // Articles from NFL News
    newsApi.v2.topHeadlines({sources: 'nfl-news'})
        .then(response => {
            latestNews = updateArrayContent(response.articles, "news")
        })

    // Tweets from @NFLResearch
    T.get("statuses/user_timeline",
        {screen_name: "NFLResearch", count: 10, exclude_replies: true, include_rts: false, tweet_mode: "extended", trim_user: true},
        (err, data, response) => {
            if(err) console.log(`Errors: ${err}`)
            else tweets = updateArrayContent(data, "twitter")

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
        `[${article.title}. Reported by ${article.author} at ${new Date(article.publishedAt).toString()}](${article.urlToImage})\n\n[${article.description}](${article.url})`,
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

    if(tweet.truncated === true) text = tweet.text
    else text = tweet["full_text"]

    mailman.sendMessage(chatId, text, {parse_mode: "Markdown"})
        .catch(err => {
            console.log(`Error sending tweet: ${err.message}`)
        })
}

// Update the news every minute
schedule.scheduleJob('* * * * *', fireDate => updateNews(fireDate));

// Global Commands
bot.start((ctx) => {
    ctx.replyWithMarkdown("Hey, if you want to receive news about the NFL just send me the command `/firstdown` and I will start to send you the latest news about the league. I'm powered by [NewsAPI.org](https://newsapi.org)")
})

bot.help((ctx) =>
    ctx.replyWithMarkdown("*Hello there*. I can help you to keep up informed about the NFL. I understand the following commands:\n\n" +
    "`/firstdown` I will put you in my mailing list and will send you every update about the league\n" +
    "`/fumble` I will remove you from my mailing list and you will not receive my updates"))

/**
 * Insert a client in the mailing list
 */
bot.command("firstdown", (ctx) => {
    let chatId = ctx.message.chat.id
    chats.add(chatId)
    ctx.reply(`Gotcha ${ctx.message.chat.first_name}! From now on you will receive news about NFL as soon them are published 👌`)
    console.log(`New client ${chatId} added`)
})

/**
 * Remove a client from the mailing list
 */
bot.command("fumble", (ctx) => {
    let chatId = ctx.message.chat.id
    chats.delete(chatId)
    ctx.replyWithMarkdown("Ok then, you will not hear from me anymore 😭\nIf you change your mind, just send me `/firstdown` again 😉")
    console.log(`Chat ${chatId} removed from list`)
})

/**
 * Reply the client with the latest news and tweet
 */
bot.command('latest', (ctx) => {
    if(latestNews.length === 0) ctx.reply("Sorry, I don't have the latest news yet 😥")
    else {
        sendNews(ctx.message.chat.id, latestNews[0])
        sendTweet(ctx.message.chat.id, tweets[0])
    }
})


// Easter eggs
bot.hears('Da Bears', (ctx) => ctx.reply('GO BEARS! 🐻⬇️'))

// Start the bot
bot.startPolling()
console.log("Bot started...")