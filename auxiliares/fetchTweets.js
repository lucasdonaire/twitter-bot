const fs = require('fs')

const rwClient = require('../twitterClient')
const USERS = ['lucasdnr_','ogatojoia']
const IDS = ['889701223515000834','3316519198']

async function main(){
    let tweets1 = await fetchNTweets(IDS[0],300)
    let tweets2 = await fetchNTweets(IDS[1],1000)
    let tweets2_ = tweets2.map(tweet => tweet.text)
    let tweets1_ = tweets1.map(tweet => tweet.text)
    let tweets = [...tweets1_,...tweets2_]
    fs.writeFile("../env/tweets2.txt", JSON.stringify(tweets), function (err) { console.log(err) })
}
main()

async function fetchIdByUsername(username){
    const user = await rwClient.v2.usersByUsernames(username);
    return user.data[0].id    
}

async function fetchNTweets(id,N=100){
    let i=0
    let allTweets = []
    let tweets = await rwClient.v2.userTimeline(id)
    let nextToken = tweets.data.meta.next_token
    allTweets = allTweets.concat(tweets.data.data)
    while(nextToken){
        i++
        tweets = await rwClient.v2.userTimeline(id,{pagination_token:nextToken})
        nextToken = tweets.data.meta.next_token
        allTweets = allTweets.concat(tweets.data.data)
        if(i>N){
            break
        }
    }
    return allTweets
}