import config from '../../config'
import NewsApi from 'newsapi'

const newsApi = NewsApi(config.nfl.news.api.token)

const getNews = () => {
    newsApi.v2.topHeadlines({sources: 'nfl-news'})
        .then(response => {
            return response.articles
        })
}

module.exports = {
    getNews
}
