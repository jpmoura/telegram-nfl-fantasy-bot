const config = require('../../config')
const Twit = require('twit')
const { promisify } = require('util')

const T = new Twit({
    consumer_key: config.twitter.consumer.key,
    consumer_secret: config.twitter.consumer.secret,
    app_only_auth: true
})

/**
 * Get the last 10 tweets from a specific user
 * @param {String} username Twitter's username
 */
async function getTweetsFrom(username) {
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

/**
 * Get the Twitter accounts to check
 * @returns {Array<Strung>} Array fo Twitter accounts to check
 */
function getTwitterAccounts() {
    return config.twitter.accounts.split(',').map(account => account.trim());
}

/**
 * Get tweets from specific accounts
 * @returns {Array<Object>} Array of tweets from the specific accounts
 */
const getTweets = async () => {
    let tweets = new Array();
    let accounts = getTwitterAccounts();
    
    await Promise.all(accounts.map(async (account) => {
        tweets.push(await getTweetsFrom(account));
    }));

    return tweets.flat();
}

module.exports = {
    getTweets
}
