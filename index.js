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
    await postTweet(tweet)
})
job.start()
