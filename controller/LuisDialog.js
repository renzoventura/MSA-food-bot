var builder = require('botbuilder');
var food = require("./favouritefood");
var rest = require('../API/Restclient');
var restaurant = require("./RestaurantCard");
var nutrition = require("./nutritionCard")
//COGNITIVE
//var cognitive = require('./controller/CustomVision');
// Some sections have been omitted


exports.startDialog = function (bot) {
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ea362548-3cd4-42b3-9654-f09d039141ec?subscription-key=5a929f0001c44918ad072184eca97c90&verbose=true&timezoneOffset=0&q=');
    
        bot.recognizer(recognizer);
    
    




        bot.dialog('DeleteFavourite', function (session, args) {
            session.send("Delete Favourite intent found");
        }).triggerAction({
            matches: 'DeleteFavourite'
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
                if (!isAttachment(session)) {
    
                    if (results.response) {
                        session.conversationData["username"] = results.response;
                    }
    
                    session.send("Retrieving your favourite foods");
                    food.displayFavouriteFood(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
                }
            }
        ]).triggerAction({
            matches: 'GetFavouriteFood'
        });


        //LOOK FOR FAVOURITE FOOD
        bot.dialog('LookForFavourite', [
            function (session, args, next) {
                session.dialogData.args = args || {};        
                if (!session.conversationData["username"]) {
                    builder.Prompts.text(session, "Enter a username to setup your account.");                
                } else {
                    next(); // Skip if we already have this info.
                }
            },
            function (session, results, next) {
                if (!isAttachment(session)) {
        
                    if (results.response) {
                        session.conversationData["username"] = results.response;
                    }
                    // Pulls out the food entity from the session if it exists
                    var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
        
                    // Checks if the food entity was found
                    if (foodEntity) {
                        session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
                        food.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT
        
                    } else {
                        session.send("No food identified!!!");
                    }
                }
            }
        ]).triggerAction({
            matches: 'LookForFavourite'
        });


        //WANT FOOD
        bot.dialog('WantFood', function (session, args) {
                    if (!isAttachment(session)) {
                        // Pulls out the food entity from the session if it exists
                        var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');
            
                        // Checks if the for entity was found
                        if (foodEntity) {
                            session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                            restaurant.displayRestaurantCards(foodEntity.entity, "auckland", session);
                        } else {
                            session.send("No food identified! Please try again");
                        }
                   }
                }).triggerAction({
                    matches: 'WantFood'
        });
            
        //get calories
        bot.dialog('GetCalories', function (session, args) {
                if (!isAttachment(session)) {

                    // Pulls out the food entity from the session if it exists
                    var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

                    // Checks if the for entity was found
                    if (foodEntity) {
                        session.send('Calculating calories in %s...', foodEntity.entity);
                        nutrition.displayNutritionCards(foodEntity.entity, session);

                    } else {
                        session.send("No food identified! Please try again");
                    }
               }
            }).triggerAction({
                matches: 'GetCalories'
            });
}


function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        //call custom vision
        customVision.retreiveMessage(session);

        return true;
    }
    else {
        return false;
    }
}