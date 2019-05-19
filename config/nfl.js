import dotenv from 'dotenv'
dotenv.config()

export default {
    news: {
        api: {
            token: process.env.NEWS_API_TOKEN
        }
    }
}
