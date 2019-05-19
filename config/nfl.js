const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    news: {
        api: {
            token: process.env.NEWS_API_TOKEN
        }
    }
}
