function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function randomTweet(){
    const tweetList = ['oiii', 'tchauu', 'joia!',' simmm',' nem sei pai', 'GATO JOIA!']
    let randomIdx = getRandomInt(0, tweetList.length-1)
    let strTweet = tweetList[randomIdx]
    return strTweet
}

module.exports = randomTweet