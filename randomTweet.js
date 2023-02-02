const { openAIKey } = require('./env/env')
const { Configuration, OpenAIApi } = require('openai')
const fs = require('fs')


const tweetsSource = JSON.parse(fs.readFileSync('./env/tweets.txt', 'utf8'))
const configuration = new Configuration({ apiKey: openAIKey })
const openai = new OpenAIApi(configuration)


function getRandomElement(list){
    return list[getRandomInt(0, list.length-1)]
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrompt(){
    let qntTweets = getRandomInt(1,4)
    let arraySourceTweets = []
    for(let i=0; i<qntTweets; i++){
        arraySourceTweets.push(getRandomElement(tweetsSource))
    }
    let inspirations = getRandomElement(arraySourceTweets)
    let randomint = getRandomInt(1,10)
    let type = randomint == 1 ? 'tattoo' : randomint == 2 ? 'music' : 'default'
    let template = {
        'music': {
            1: 'recomende uma música baseada no tweet: ',
            2: 'recomende uma música baseada nos tweets: '
        },
        'tattoo': {
            1: 'pense numa tatuagem inspirada no tweet: ',
            2: 'pense numa tatuagem inspirada nos tweets: '
        },
        'default':{
            1: 'qual sua opinião detalhada sobre o tweet: ',
            2: 'gere uma frase de efeito inspirada pelas palavras chave dos seguintes tweets, sem copiar eles: '
        }
    }

    if(qntTweets == 1){
        return `${template[type]['1']}${arraySourceTweets[0]}.`
    }else{
        return `${template[type]['2']}${arraySourceTweets}.`
    }
}

async function randomTweet(){
    let inspiration = getRandomPrompt()
    console.log('==========================================')
    console.log(inspiration+'\n\nresultados:\n')
    try{
        let nextText = await openai.createCompletion({
            model: 'text-davinci-001',
            prompt: inspiration,
            max_tokens: 250,
            temperature: 0.5,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        console.log(nextText.data.choices)
        let escolhido = getRandomElement(nextText.data.choices)
        return escolhido.text
    }catch(e){
        console.log(e)
        console.log(e.message)
        console.log(Object.keys(e))
    }
}


module.exports = randomTweet