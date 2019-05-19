import axios from 'axios'
import config from '../../config'
import $ from 'cheerio'

const fantasyLeagueURL = `${config.fantasy.league.url}${config.fantasy.league.id}`

const getFantasyLeagueTransaction = () => {
    let transactions = []

    axios(fantasyLeagueURL).then(response => {
        let videoRegex = /View\sVideos/gi
        let newsRegex = /View\sNews/gi
        let spaceRegex = /(.)\1{4,}/gi

        let rawTransactions = ($('.textWrap p', response.data))
        rawTransactions.each((index, item) => {
            let transaction = $(item).text()

            transaction = transaction.replace(videoRegex, '').replace(newsRegex, '').replace(spaceRegex, ' ')
                transactions.push(transaction)
            })
        })

    return transactions;
}

module.exports = {
    getFantasyLeagueTransaction
}
