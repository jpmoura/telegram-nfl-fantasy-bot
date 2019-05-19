const util = require('../util')

function start(ctx) {
    ctx.replyWithMarkdown("Hey, if you want to receive news about the NFL just send me the command" +
        "`/firstdown` and I will start to send you the latest news about the league." +
        "I'm powered by [NewsAPI.org](https://newsapi.org)")
}

function help(ctx) {
    ctx.replyWithMarkdown("*Hello there*. I can help you to keep up informed about the NFL." +
        "I understand the following actions:\n\n" +
        "`/firstdown` I will put you in my mailing list and will send you every update about the league\n" +
        "`/fumble` I will remove you from my mailing list and you will not receive my updates")
}

function addUser(ctx, chatsArray) {
    let chatId = ctx.message.chat.id
    chatsArray.add(chatId)
    ctx.reply(`Gotcha ${ctx.message.chat.first_name}! From now on you will receive news about NFL as soon them are ` +
        `published 👌`)
    console.log(`New client ${chatId} added`)
}

function removeUser(ctx, chatsArray) {
    let chatId = ctx.message.chat.id
    chatsArray.delete(chatId)
    ctx.replyWithMarkdown("Ok then, you will not hear from me anymore 😭\n" +
        "If you change your mind, just send me `/firstdown` again 😉")
    console.log(`Chat ${chatId} removed from list`)
}

function sendLatest(ctx, mailman, newsArray, tweetsArray, fantasyArray) {
    if (newsArray.length === 0 || tweetsArray.length === 0 || fantasyArray.length === 0)
        ctx.reply("Sorry, I don't have news/tweets/fantasy transactions yet 😥")
    else
    {
        util.sendNewsArticle(mailman, ctx.message.chat.id, newsArray[0])
        util.sendTweet(mailman, ctx.message.chat.id, tweetsArray[0])
        util.sendFantasyTransaction(mailman, ctx.message.chat.id, fantasyArray[0])
    }
}

function daBears(ctx) {
    ctx.reply('GO BEARS! 🐻⬇️')
}

const global = bot => {
    bot.start((ctx) => start(ctx))
    bot.help((ctx) => help(ctx))
}

const commands = (bot, mailman, chatsArray, newsArray, tweetsArray, fantasyArray) => {
    // Insert a client in the mailing list
    bot.command("firstdown", (ctx) => addUser(ctx, chatsArray))

    // Remove a client from the mailing list
    bot.command("fumble", (ctx) => removeUser(ctx, chatsArray))

     // Reply the client with the latest news, tweet ans fantasy transaction
    bot.command('latest', (ctx) => sendLatest(ctx, mailman, newsArray, tweetsArray, fantasyArray))
}

const hearings = (bot) => {
    // Easter egg
    bot.hears('Da Bears', (ctx) => daBears(ctx))
}


module.exports = {
    global,
    commands,
    hearings
}
