var rest = require('../API/Restclient');

exports.displayFavouriteFood = function getFavouriteFood(session, username){
    var url = 'http://renzofoodbot1.azurewebsites.net/tables/renzofoodbot';
    rest.getFavouriteFood(url, session, username, handleFavouriteFoodResponse)
};


function handleFavouriteFoodResponse(message, session, username) {
    var favouriteFoodResponse = JSON.parse(message);
    var allFoods = [];
    for (var index in favouriteFoodResponse) {
        var usernameReceived = favouriteFoodResponse[index].username;
        var favouriteFood = favouriteFoodResponse[index].favouritefood;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(favouriteFoodResponse.length - 1) {
                allFoods.push(favouriteFood);
            }
            else {
                allFoods.push(favouriteFood + ', ');
            }
        }        
    }
    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your favourite foods are: %s", username, allFoods);                
    
}

exports.sendFavouriteFood = function postFavouriteFood(session, username, favouriteFood){
    var url = 'http://renzofoodbot1.azurewebsites.net/tables/renzofoodbot';
    rest.postFavouriteFood(url, username, favouriteFood);
};