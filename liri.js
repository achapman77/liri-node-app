// require("dotenv").config();

var inquirer = require("inquirer");

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
      console.log(inquirerResponse.liriCommand);
      console.log(inquirerResponse.userInput);
      if (inquirerResponse.liriCommand === "Find Concert for a Band") {
          concertThis(inquirerResponse.userInput)
    //   } else if (inquirerResponse.liriCommand === "Spotify a Song") {

    //   }
    
  });

//concert-this
// This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
function concertThis(userInput) {

    var artist = userInput
    axios
    .get(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`)
    .then(function (response) {
        console.log(response.data);
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

