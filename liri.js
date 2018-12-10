// require("dotenv").config();

var inquirer = require("inquirer");
var moment = require("moment");
// var keys = require("./keys.js");

var axios = require("axios");

// var omdb = require('omdb');

// var spotify = new Spotify(keys.spotify);

inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like Liri to Do?",
      choices: ["Find Concert for a Band", "Spotify a Song", "Get Info for a Movie", "Do what it says"],
      name: "liriCommand"
    },
    {
      type: "input",
      message: "What would you like Liri to find?",
      name: "userInput",
    }
  ])
  .then(function(inquirerResponse) {
    //   console.log(inquirerResponse.liriCommand);
    //   console.log(inquirerResponse.userInput);
      
    //Need to add + inbetween user input words to enable API calls
    //Therefore make user input into array
    //loop through all the words in user input and add "+"
      var userInput = "";
    
        var userInputArray = inquirerResponse.userInput.split(" ");
        for (var i = 0; i < userInputArray.length; i++) {

            if (i > 0 && i < userInputArray.length) {
                userInput = userInput + "+" + userInputArray[i];
            }
            else {
                userInput += userInputArray[i]
            }
        };

    //   if (inquirerResponse.liriCommand === "Find Concert for a Band") {
    //       concertThis(userInput)
    //   } else if (inquirerResponse.liriCommand === "Spotify a Song") {

    //   }
      var command = inquirerResponse.liriCommand;
      switch (command) {
          case "Find Concert for a Band":
              concertThis(userInput);
              break;
      }
    
  });


//concert-this
// This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
function concertThis(userInput) {

    var reFormatUserInput = userInput.split("+").join(" ").toUpperCase();

    axios
    .get(`https://rest.bandsintown.com/artists/${userInput}/events?app_id=codingbootcamp`)
    .then(function (response) {
        // console.log(response.data);
        
        var concertDate = response.data[0].datetime.split("T");
        var concertDateFormatted = moment(concertDate[0], 'YYYY-MM-DD').format('MM/DD/YYYY');
        //Calculate days from now til concert
        var diffDays = (moment().diff(concertDate[0], "days")) * -1;

        // console.log(diffDays);

        console.log(`There's a ${reFormatUserInput} concert at the ${response.data[0].venue.name} in ${response.data[0].venue.city}, ${response.data[0].venue.region} on ${concertDateFormatted}.  Hurry and buy tickets soon...That's only ${diffDays} days from now!`);

    })
    .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
};



//spotify-this-song
//https://www.npmjs.com/package/spotify
// This will show the following information about the song in your terminal/bash window
    // Artist(s)
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.





//movie-this
// API-Key: Trilogy
    // * Title of the movie.
    // * Year the movie came out.
    // * IMDB Rating of the movie.
    // * Rotten Tomatoes Rating of the movie.
    // * Country where the movie was produced.
    // * Language of the movie.
    // * Plot of the movie.
    // * Actors in the movie.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'


//do-what-it-says

