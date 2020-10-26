const axios = require('axios')
const $ = require('cheerio')
const rotowireLatestNewsUrl = "https://www.rotowire.com/football/news.php"

/**
 * Get the most recent news from Rotowire
 * @returns {Array<Object>} Array of formatted news object
 */
const getNews = async () => {
    let response = await axios(rotowireLatestNewsUrl);
    return formatRotowireNews($('.news-update', response.data))
}

/**
 * Format a raw news array
 * @param {Array<Object>} rawRotowireNewsArray Cheerio object array representing the recent news 
 */
function formatRotowireNews(rawRotowireNewsArray) {
    return rawRotowireNewsArray.map((_, item) => createFormattedRotowireNews(item)).toArray();
}

/**
 * Create a formatted news object
 * @param {Object} rawRotowireNews Cheerio object representing the whole news
 * @returns {Object} Formatted news object
 */
function createFormattedRotowireNews(rawRotowireNews) {
    return {
        headline: getNewsHeadline(rawRotowireNews),
        body: getNewsBody(rawRotowireNews)
    }
}

/**
 * Get the formatted Rotowire News headline
 * @param {Object} rawRotowireNews Cheerio object representing the whole news
 * @returns {String} The formatted news headline 
 */
function getNewsHeadline(rawRotowireNews) {
    return `${$(".news-update__player-link", rawRotowireNews).text()} - ${$(".news-update__headline", rawRotowireNews).text()}`
}

/**
 * Get the formatted Rotowire news body
 * @param {Object} rawRotowireNews Cheerio object representing the whole news
 * @returns {String} The formatted news body 
 */
function getNewsBody(rawRotowireNews) {
    return `${$(".news-update__news", rawRotowireNews).text()}`
}

module.exports = {
    getNews
}
