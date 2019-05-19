import config from '../../config'
import Twit from 'twit'

const T = new Twit({
    consumer_key: config.twitter.consumer.key,
    consumer_secret: config.twitter.consumer.secret,
    app_only_auth: true
})

const getTweets = () => {
    T.get("statuses/user_timeline",
        {
            screen_name: "NFLResearch",
            count: 10,
            exclude_replies: true,
            include_rts: false,
            tweet_mode: "extended",
            trim_user: true
        },
        (err, newTweets) =>
        {
            if (err)
                console.log(`Errors: ${err}`)
            else
                return newTweets
        })
}

module.exports = {
    getTweets
}
