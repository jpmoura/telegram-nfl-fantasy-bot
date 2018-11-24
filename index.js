require('dotenv').config()

const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

const Telegram = require('telegraf/telegram')
const mailman = new Telegram(process.env.BOT_TOKEN)

const NewsAPI = require('newsapi')
const newsApi = new NewsAPI(process.env.NEWS_API_TOKEN)

const schedule = require('node-schedule')

let latestNews = []
let chats = new Set()

/**
 * Update the database with the latest news
 * @param fireDate Date The GMT date that the function was executed
 */
function updateNews(fireDate) {
    newsApi.v2.topHeadlines({sources: 'nfl-news'})
        .then(response => {

            let newArticles = []

            if(latestNews.length === 0) newArticles = response.articles
            else {
                response.articles.forEach(newArticle => {
                    let isOld = false

                    latestNews.forEach(oldArticle => {
                        if(oldArticle.title === newArticle.title) isOld = true
                    })

                    if(!isOld) newArticles.push(newArticle)
                })
            }

            newArticles.forEach(article => {
                chats.forEach(chatId => {
                    sendNews(chatId, article)
                })
            })
            if(newArticles.length > 0) console.log(`Sent ${newArticles.length} new articles to ${chats.size} chats`)
            else console.log("No new articles found")

            latestNews = response.articles
        })
    console.log(`Update news at ${fireDate}`)
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
 * Reply the client with the latest news
 */
bot.command('latest', (ctx) => {
    if(latestNews.length === 0) ctx.reply("Sorry, I don't have the latest news yet 😥")
    else sendNews(ctx.message.chat.id, latestNews[0])
})

// Easter eggs
bot.hears('Da Bears', (ctx) => ctx.reply('GO BEARS! 🐻⬇️'))

// Start the bot
bot.startPolling()
console.log("Bot started...")