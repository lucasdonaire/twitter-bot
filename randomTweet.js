const { openAIKey } = require('./env/env')
const { Configuration, OpenAIApi } = require('openai')
const fs = require('fs')


const tweetsSource = JSON.parse(fs.readFileSync('./env/tweets3.txt', 'utf8'))
console.log('tuitando baseado em :'+tweetsSource.length)
const configuration = new Configuration({ apiKey: openAIKey })
const openai = new OpenAIApi(configuration)

const pesos = [2, 1, 2, 1, 3, 3, 2]
const keys = ['music', 'tattoo', 'dialog', 'filmName', 'default', 'banger', 'nothing']
const template = {
    'music': {
        1: 'recomende uma música não muito conhecida baseada no tweet: ',
        2: 'recomende uma música baseada nos tweets: '
    },
    'film': {
        1: 'recomende um filme baseado no tweet: ',
        2: 'recomende um filme baseada nos tweets: '
    },
    'tattoo': {
        1: 'pense num desenho de tatuagem inspirada no tweet: ',
        2: 'pense num desenho de tatuagem inspirada nos tweets: '
    },
    'dialog':{
        1: 'crie um diálogo baseado no tweet: ',
        2: 'gere um dialogo baseado nos seguintes tweets: '
    },
    'art':{
        1: 'qual obra de arte, artista ou corrente artistica voce lembra quando le o seguinte tweet: ',
        2: 'qual obra de arte, artista ou corrente artistica voce lembra quando le os seguintes tweets: ',
    },
    'banger':{
        1: 'crie um tweet que é o seguinte tweet mais uma continuação feita por voce: ',
        2: 'crie um tweet que conecte o assunto desses dois tweets : '
    },
    'filmName':{
        1: 'crie um nome de filme baseado no tweet: ',
        2: 'gere um nome de filme baseado nos seguintes tweets: '
    },
    'default':{
        1: 'opine sobre os temas do tweet: ',
        2: 'gere um tweet inspirado pelas palavras chave dos seguintes tweets, sem copiar eles: '
    },
    'nothing':{
        1: '',
        2: ''
    },
    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(list){
    return list[getRandomInt(0, list.length-1)]
}

function getRandomElementW(list, listPesos=[]){
    if(listPesos == []){listPesos = list.map(el => 1)}
    let random = getRandomInt(0, 11)
    let sum = 0
    let idx = 0
    for(el of listPesos){
        if(random < el+sum){
            return list[idx]
        }
        sum = sum + el
        idx = idx+1
    }
}


function getRandomPrompt(){
    let qntTweets = getRandomInt(1,2)
    let arraySourceTweets = []
    for(let i=0; i<qntTweets; i++){
        arraySourceTweets.push(getRandomElement(tweetsSource))
    }
    let randomKey = getRandomElementW(keys, pesos)
    if(qntTweets == 1){
        return `${template[randomKey]['1']}${arraySourceTweets[0]}.`
    }else{
        return `${template[randomKey]['2']}${JSON.stringify(arraySourceTweets)}.`
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
        return ''
    }
}


module.exports = randomTweet