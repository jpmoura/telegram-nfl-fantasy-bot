const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    env: process.env.BOT_ENV,
    token: process.env.BOT_TOKEN
}
