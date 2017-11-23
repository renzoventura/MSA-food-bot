var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        //MAKE NEW CONGNITIVE SERVICES FOR FOOD
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/453f231c-df1c-4729-bdae-e8f4e7a61e95/url?iterationId=db71240e-9798-4c9c-a928-a19b07b2bc51',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': 'c6b2b330bd2c43eea73185db8a0b2a10'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}