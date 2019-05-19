import dotenv from 'dotenv'
dotenv.config()

export default {
    env: process.env.BOT_ENV,
    token: process.env.BOT_TOKEN
}
