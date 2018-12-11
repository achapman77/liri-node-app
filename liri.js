require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);



var moment = require('moment');

var axios = require('axios');

var fs = require('fs');

// Bonus
var inquirer = require('inquirer');

const chalk = require('chalk');

const log = console.log;

inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like Liri to Do?",
      choices: ["Find Concert for a Band", "Spotify a Song", "Get Info for a Movie", "Do what it says"],
      name: "liriCommand"
    },
    // {
    //   type: "input",
    //   message: "What would you like Liri to find?",
    //   name: "userInput",
    // }
  ])
  .then(function(inquirerResponse) {
 
      var command = inquirerResponse.liriCommand;
      
      switch (command) {
          case "Find Concert for a Band":
              inquirer
                  .prompt({
                      type: "input",
                      message: "What Band?",
                      name: "userInput",
                  })
                  .then(function (inquirerResponse) {
                    var userQuery = formatUserInput(inquirerResponse.userInput)  
                    concertThis(userQuery);
                  });
              break;
          case "Spotify a Song":
              inquirer
                  .prompt({
                    type: "input",
                    message: "What Song?",
                    name: "userInput",
                  })
                  .then(function (inquirerResponse) {
                    var userQuery = formatUserInput(inquirerResponse.userInput)
                    spotifyThisSong(userQuery);
                  })
              break;
          case "Get Info for a Movie":
              inquirer
                  .prompt({
                      type: "input",
                      message: "What Movie?",
                      name: "userInput",
                  })
                  .then(function (inquirerResponse) {
                    var userQuery = formatUserInput(inquirerResponse.userInput)
                    movieThis(userQuery);
                  });
              break;
          case "Do what it says":
              doWhatItSays();
              break;
      }
    
  });


function formatUserInput(response) {
    var userUrlQuery = "";

    var userInputArray = response.split(" ");
    for (var i = 0; i < userInputArray.length; i++) {

        if (i > 0 && i < userInputArray.length) {
            userUrlQuery = userUrlQuery + "+" + userInputArray[i];
        }
        else {
            userUrlQuery += userInputArray[i]
        }
    };
    return userUrlQuery
}

// var userQuery = formatUserInput(inquirerResponse.userInput)
//concert-this
// This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:
    // Name of the venue
    // Venue location
    // Date of the Event (use moment to format this as "MM/DD/YYYY")
function concertThis(userQuery) {
    
    // var userQuery = formatUserInput(inquirerResponse.userInput)
    var upperCaseUserQuery = userQuery.split("+").join(" ").toUpperCase();

    axios
    .get(`https://rest.bandsintown.com/artists/${userQuery}/events?app_id=codingbootcamp`)
    .then(function (response) {
        // console.log(response.data);
        
        var concertDate = response.data[0].datetime.split("T");
        var concertDateFormatted = moment(concertDate[0], 'YYYY-MM-DD').format('MM/DD/YYYY');
        //Calculate days from now til concert
        var diffDays = (moment().diff(concertDate[0], "days")) * -1;

        // console.log(diffDays);

        log(chalk.blue(`\nThere's a ${upperCaseUserQuery} concert at the ${response.data[0].venue.name} in ${response.data[0].venue.city}, ${response.data[0].venue.region} on ${concertDateFormatted}.\n`) +
        chalk.red(`Hurry and buy tickets soon...That's only ${diffDays} days from now!\n`));
        
        fs.appendFile("log.txt", `COMMAND:concertThis, QUERY:${userQuery}, VENUE:${response.data[0].venue.name}, CITY:${response.data[0].venue.city}, REGION:${response.data[0].venue.region}, DATE:${concertDateFormatted}||\n`, function (err) {
            if (err) {
                return console.log(err);
              }
            
              // Otherwise, it will print: "movies.txt was updated!"
              console.log(chalk.green("log.txt was updated!"));
        });

    })
    .catch(function(error) {
        if (error.response) {
            log(chalk.red.bold(`\nNo Concert for You! (You forgot to enter band name).\n`))
            // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        //   console.log(error.response.status);
        //   console.log(error.response.headers);
        } else if (error.request) {
            
            // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
        
            console.log("Error", error.message);
        }
        // log(chalk.red.bold(`\nNo Concert for You! (You forgot to enter band name).\n`))
        // console.log(error.config);
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

function spotifyThisSong(userQuery) {

    if (userQuery === "") {
        spotifyAceOfBase();
    }
    else { 
        spotify
        .search({ type: 'track', query: `${userQuery}`, limit: 10 })
        .then(function(response) {
            for (var i = 0; i < response.tracks.items.length; i++) {
                
                log(chalk.blue(`\nTRACK: ${response.tracks.items[i].name}`));
                for (var x = 0; x < response.tracks.items[i].artists.length; x++) {
                    log(chalk.green(`ARTIST(s): ${response.tracks.items[i].artists[x].name}`));
                }
                log(chalk.yellow(`ALBUM: ${response.tracks.items[i].album.name}`));
                log(`PreVIEW: ${response.tracks.items[i].preview_url}`);
                log(chalk.red(`--------------------------------------------------`));
            }

        })
        .catch(function(err) {
            console.log(err);
        });
    };
    
    
};

function spotifyAceOfBase(userQuery) {
    log(chalk.red(`\nYour reward for FAILURE to enter a track to search...`))
    log(chalk.blue(`TRACK: The Sign`));
    log(chalk.green(`ARTIST(s): Ace of Base`));
    log(chalk.yellow(`ALBUM: The Sign (US Album) [Remastered]`));
    log(`PreVIEW: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=542aa62ee5dd45d99be2d8c03615336c`);
    log(chalk.red(`--------------------------------------------------`));
};


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
function movieThis(userQuery) {
    
    if (userQuery === "") {
        log(chalk.red(`\nSince you FAILED to provide Movie to search...we recommend: `))
        var queryURL = `http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy`
    }
    else {
        var queryURL = `http://www.omdbapi.com/?t=${userQuery}&y=&plot=short&apikey=trilogy`;
    }
    // console.log(queryURL);

    axios
        .get(queryURL)
        .then(function (response) {
                // log(response.data);
                log(chalk.bgRed.bold.white(`\n               ${response.data.Title}                `));
                log(`RELEASED: ${response.data.Year} from ${response.data.Country} in ${response.data.Language}`);
                log(`REVIEWS:`)
                for (var i = 0; i < response.data.Ratings.length; i++) {
                    log(`   * ${response.data.Ratings[i].Source}: ${response.data.Ratings[i].Value}`);
                };
                log(`PLOT: ${response.data.Plot}`);
                log(`STARRING: ${response.data.Actors}\n`);   
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



//do-what-it-says

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
     
        if (error) {
            return console.log(error);
        }

        log(data);

        var dataArr = data.split(", ");
        log(dataArr);
        //This part works for single command, search pair...
        // var userQuery = formatUserInput(dataArr[1]);
        // log(userQuery)
        // if (dataArr[0] === 'concertThis') {
        //     concertThis(userQuery);
        // }

        //need recursive function to iterate through random.txt and allow for api promises
        var i = 0 
            
        function loop() {
            if (i > dataArr.length - 1) {
                return;
            }
            if (dataArr[i] === 'concertThis') {
                userQuery = formatUserInput(dataArr[i + 1]);
                concertThis(userQuery);
                i = i + 2;
                setTimeout(loop, 1500);
            }
            else if (dataArr[i] === 'spotifyThisSong') {
                userQuery = formatUserInput(dataArr[i + 1]);
                spotifyThisSong(userQuery);
                i = i + 2;
                setTimeout(loop, 1500);
            }
            else if (dataArr[i] === 'movieThis') {
                userQuery = formatUserInput(dataArr[i + 1]);
                movieThis(userQuery);
                i = i + 2;
                setTimeout(loop, 1500);
            }
        }
        loop();
    });


};

