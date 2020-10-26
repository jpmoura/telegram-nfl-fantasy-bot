const SourceID = {
    twitter : "id",
    news: "headline",
}

/**
 * Send a article to a specific chat with its image and title
 * @param mailman Telegram Telegram object that will send the updated content
 * @param chatID String|Integer The chat ID that will receive the article
 * @param article Object The object that represent article
 */
const sendNewsArticle = (mailman, chatID, article) => {
    mailman.sendMessage(
        chatID,
        `${article.headline}\n\n${article.body}`,
        {parse_mode: "Markdown"})
        .catch(err => {
            console.log(`Error sending article`, err.message)
        })
}

/**
 * Send a tweet content to a specific chat
 * @param mailman Telegram Telegram object that will send the updated content
 * @param chatId Integer Chat that will receive the tweet
 * @param tweet Object Tweet object from the Twitter API
 */
const sendTweet = (mailman, chatId, tweet) => {
    let text

    if (tweet.truncated === true)
        text = tweet.text
    else
        text = tweet["full_text"]

    mailman.sendMessage(chatId, text, {parse_mode: "Markdown"})
        .catch(err => {
            console.log(`Error sending tweet`, err.message)
        })
}

/**
 * Send a fantasy transaction to a specific chat
 * @param mailman Telegram Telegram object that will send the updated content
 * @param chatId Integer Chat that will receive the tweet
 * @param transaction String Transaction description from fantasy league
 */
const sendFantasyTransaction = (mailman, chatId, transaction) => {
    mailman.sendMessage(chatId, `Fantasy transaction: ${transaction}`)
        .catch(err => {
            console.log(`Error sending transaction`, err.message)
        })
}

function defineComparisonKey(object, mediaType) {
    if(mediaType === "fantasy")
        return object
    else
        return object[SourceID[mediaType]]
}

/**
 *
 * @param currentContentArray {Array} Array with the old content
 * @param newContentArray {Array} Array with the new content
 * @param mediaType string Media type related to the content
 * @param chatsSet {Set} Array with all active chats ids
 * @param mailman Telegram Telegram object that will send the updated content
 * @return {Array}
 */
const sendUpdatedContent = (currentContentArray, newContentArray, mediaType, chatsSet, mailman) => {
    let updatedContent = []
    let oldContents = currentContentArray
    let sendFunction = null
    let source = null

    switch (mediaType) {
        case "twitter":
            sendFunction = sendTweet
            source = "tweets"
            break
        case "news":
            sendFunction = sendNewsArticle
            source = "articles"
            break
        case "fantasy":
            sendFunction = sendFantasyTransaction
            source = "fantasy league"
            break
    }

    if (oldContents.length === 0)
        updatedContent = newContentArray
    else
    {
        newContentArray.forEach(newContent => {
            let isOld = false

            oldContents.forEach(oldContent => {
                let oldContentKey = defineComparisonKey(oldContent, mediaType)
                let newContentKey = defineComparisonKey(newContent, mediaType)

                if (oldContentKey === newContentKey)
                    isOld = true
            })

            if (!isOld)
                updatedContent.push(newContent)
        })
    }

    if (updatedContent.length === 0)
        console.log(`Nothing new found on ${mediaType}`)
    else
    {
        console.log(`Sending ${updatedContent.length} new ${source} to ${chatsSet.size} clients`)
        updatedContent.forEach(content => {
            chatsSet.forEach(chatID => {
                sendFunction(mailman, chatID, content)
            })
        })
    }

    return updatedContent
}

module.exports = {
    sendNewsArticle,
    sendTweet,
    sendFantasyTransaction,
    sendUpdatedContent
}
