const config = require('../../config')
const NewsApi = require('newsapi')

const newsApi = new NewsApi(config.nfl.news.api.token)

const getNews = async () => {
    let response = await newsApi.v2.topHeadlines({sources: 'nfl-news'})
    return response.articles
}

module.exports = {
    getNews
}
