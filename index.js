const rwClient = require('./twitterClient')
const cron = require('cron')
const randomTweet = require('./randomTweet')


async function postTweet(text){
    try{
        await rwClient.v2.tweet(text)
    }catch(e){
        console.log(e)
    }
}


const job = new cron.CronJob("0 */1 * * * *", async () => {
    const tweet = await randomTweet()
    if(tweet !== ''){
        await postTweet(tweet.substring(0,279))
        console.log('postado.')
    }
})
job.start()
