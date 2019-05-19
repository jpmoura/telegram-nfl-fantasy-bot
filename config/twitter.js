const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    consumer: {
        key: process.env.TWITTER_CONSUMER_KEY,
        secret: process.env.TWITTER_CONSUMER_SECRET
    }
}
