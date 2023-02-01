const rwClient = require('./twitterClient')
const USERS = ['lucasdnr_','ogatojoia']
const IDS = ['889701223515000834','3316519198']
async function main(){
    
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
        let tweets = await rwClient.v2.userTimeline(id,{pagination_token:next})
        let nextToken = tweets.data.meta.next_token
        allTweets = allTweets.concat(tweets.data.data)
        if(i>N){
            break
        }
    }
    return allTweets
}