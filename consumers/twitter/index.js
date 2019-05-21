const config = require('../../config')
const Twit = require('twit')
const { promisify } = require('util')

const T = new Twit({
    consumer_key: config.twitter.consumer.key,
    consumer_secret: config.twitter.consumer.secret,
    app_only_auth: true
})


const getTweets = async (username = "NFLResearch") => {
    let promisifyGet = promisify(T.get.bind(T));

    return await promisifyGet("statuses/user_timeline",
        {
            screen_name: username,
            count: 10,
            exclude_replies: true,
            include_rts: false,
            tweet_mode: "extended",
            trim_user: true
        }).catch(err => {
            console.log("Error while getting new tweets", err)
            return err
    })
}

module.exports = {
    getTweets
}
