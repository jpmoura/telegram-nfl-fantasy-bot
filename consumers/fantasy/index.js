const axios = require('axios')
const config =  require('../../config')
const $ = require('cheerio')

const fantasyLeagueURL = `${config.fantasy.league.url}${config.fantasy.league.id}`

const getFantasyLeagueTransaction = async () => {
    let transactions = []

    let response = await axios(fantasyLeagueURL);

    let videoRegex = /View\sVideos/gi
    let newsRegex = /View\sNews/gi
    let spaceRegex = /(.)\1{4,}/gi

    let rawTransactions = ($('.textWrap p', response.data))

    rawTransactions.each((index, item) => {
        let transaction = $(item).text()

        transaction = transaction.replace(videoRegex, '').replace(newsRegex, '').replace(spaceRegex, ' ')
        transactions.push(transaction)
    })

    return transactions;
}

module.exports = {
    getFantasyLeagueTransaction
}
