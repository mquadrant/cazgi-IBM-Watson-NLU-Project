const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config()

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key
        }),
        serviceUrl: api_url
    })
    return naturalLanguageUnderstanding
}

function callToNLU(analyzeParams) {
    return new Promise((resolve, reject) => {
        getNLUInstance().analyze(analyzeParams)
        .then(analysisResults => {
            resolve(analysisResults)
        })
        .catch(err => {
            reject(err)
        });
    })
}

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", async (req,res) => {
    try{
      const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        const doc = response.result.emotion.document
        return res.send(doc.emotion);  
    } catch(err) {
        console.log('error:', err);
    }
});

app.get("/url/sentiment", async (req,res) => {
    try{
        const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        const doc = response.result.sentiment.document
        return res.send(doc.label);
    } catch(err) {
        console.log('error:', err);
    }
});

app.get("/text/emotion", async (req,res) => {
    try{
        const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        const doc = response.result.emotion.document
        return res.send(doc.emotion); 
    } catch(err) {
        console.log('error:', err);
    }
});

app.get("/text/sentiment", async (req,res) => {
    try{
        const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        const doc = response.result.sentiment.document
        return res.send(doc.label);
    } catch(err) {
        console.log('error:', err);
    }
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

