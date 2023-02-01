const { TwitterApi } = require('twitter-api-v2')
const { apiKey, apiSecret, token, clientId, clientSecret, acessTokenAcc, secretTokenAcc } = require('./env/env')

const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken: acessTokenAcc,
    accessSecret: secretTokenAcc,
})

const rwClient = client.readWrite

module.exports = rwClient;