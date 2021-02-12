const express = require('express');
const app = new express();

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
            apiKey: api_key
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

app.get("/url/emotion", (req,res) => {
    try{
      const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        console.log("The Response Url Emotion !!! ", response)
        return res.send({"happy":"90","sad":"10"});  
    } catch(err) {
        console.log('error:', err);
    }
});

app.get("/url/sentiment", (req,res) => {
    try{
        const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        console.log("The Response Url Sentiment!!! ", response)
        return res.send("url sentiment for "+req.query.url);
    } catch(err) {
        console.log('error:', err);
    }
});

app.get("/text/emotion", (req,res) => {
    try{
        const analyzeParams = {
        'url': req.query.text,
        'features': {
            'emotion': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        console.log("The Response Text Emotion !!! ", response)
        return res.send({"happy":"10","sad":"90"});
    } catch(err) {
        console.log('error:', err);
    }
});

app.get("/text/sentiment", (req,res) => {
    try{
        const analyzeParams = {
        'url': req.query.text,
        'features': {
            'sentiment': { 'limit': 3 }
            }
        };
        const response = await callToNLU(analyzeParams)
        console.log("The Response Text Sentiment!!! ", response)
        return res.send("text sentiment for "+req.query.text);
    } catch(err) {
        console.log('error:', err);
    }
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

