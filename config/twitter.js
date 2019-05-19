import dotenv from 'dotenv'
dotenv.config()

export default {
    consumer: {
        key: process.env.TWITTER_CONSUMER_KEY,
        secret: process.env.TWITTER_CONSUMER_SECRET
    }
}
