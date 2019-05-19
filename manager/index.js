const actions = require('./actions')

const setup = (bot, mailman, chatsArray, newsArticlesArray, tweetsArray, fantasyArray) => {
    actions.global(bot)
    actions.commands(bot, mailman, chatsArray, newsArticlesArray, tweetsArray, fantasyArray)
    actions.hearings(bot)
}

module.exports = {
    setup
}
