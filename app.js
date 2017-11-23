var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./controller/LuisDialog');


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "bdd0f61c-0fd0-4d93-bf21-ef848ac60b54",
    appPassword: "enfzsKOBF380tuUQK64(%{:"
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

var lastSaid = "";

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    

    if (lastSaid == session.message.text) {
            session.send("you said that already!");
    } else {
        session.send("You said: " + session.message.text);
    }
    lastSaid = session.message.text;
    
});

// This line will call the function in your LuisDialog.js file
luis.startDialog(bot);
