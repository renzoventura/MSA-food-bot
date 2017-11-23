var builder = require('botbuilder');
var food = require("./favouritefood");
var rest = require('../API/Restclient');

// Some sections have been omitted


exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ea362548-3cd4-42b3-9654-f09d039141ec?subscription-key=5a929f0001c44918ad072184eca97c90&verbose=true&timezoneOffset=0&q=');
    
        bot.recognizer(recognizer);
    
        bot.dialog('GetCalories', function (session, args) {
            session.send("Get Calories intent found");
        }).triggerAction({
            matches: 'GetCalories'
        });

        bot.dialog('DeleteFavourite', function (session, args) {
            session.send("Delete Favourite intent found");
        }).triggerAction({
            matches: 'DeleteFavourite'
        });

        

        bot.dialog('LookForFavourite', function (session, args) {
            session.send("Look For Favourite intent found");
        }).triggerAction({
            matches: 'LookForFavourite'
        });

        bot.dialog('WantFood', function (session, args) {
            session.send("Want Food intent found");
        }).triggerAction({
            matches: 'WantFood'
        });

        bot.dialog('WelcomeIntent', function (session, args) {
            session.send("Good morning Renzo!");
        }).triggerAction({
            matches: 'WelcomeIntent'
        });

        //GET FAVOURITE FOOD
        bot.dialog('GetFavouriteFood', [
            function (session, args, next) {
                session.dialogData.args = args || {};        
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter a username to setup your account.");                
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, results, next) {
             //   if (!isAttachment(session)) {
    
                    if (results.response) {
                        session.conversationData["username"] = results.response;
                    }
    
                    session.send("Retrieving your favourite foods");
                    food.displayFavouriteFood(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
                }
           // }
        ]).triggerAction({
            matches: 'GetFavouriteFood'
        });


}

