const axios = require('axios')
const $ = require('cheerio')
const rotowireLatestNewsUrl = "https://www.rotowire.com/football/news.php"

const getNews = async () => {
    let response = await axios(rotowireLatestNewsUrl);
    return formatRotowireNews($('.news-update', response.data))
}

function formatRotowireNews(rawRotowireNewsArray) {
    return rawRotowireNewsArray.map((_, item) => createFormattedRotowireNews(item));
}

function createFormattedRotowireNews(rawRotowireNews) {
    return {
        headline: getNewsHeadline(rawRotowireNews),
        body: getNewsBody(rawRotowireNews)
    }
}

function getNewsHeadline(rawRotowireNews) {
    return `${$(".news-update__player-link", rawRotowireNews).text()} - ${$(".news-update__headline", rawRotowireNews).text()}`
}

function getNewsBody(rawRotowireNews) {
    return `${$(".news-update__news", rawRotowireNews).text()}`
}

module.exports = {
    getNews
}
