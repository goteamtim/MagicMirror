"use strict";
var express     = require('express');
var app         = express();
var request     = require('request');
var CONSTANTS   = require('./js/constants.js');
var KEYS        =  { JWT: process.env.JWT };
var jwt         = require('jsonwebtoken');
var FeedParser  = require('feedparser');
var cookieParser = require('cookie-parser')
var moment = require('moment')
//const { exec } = require('child_process');

var userData = {
    ip_info: {},
    weather: {},
    weatherAPIKey: "",
    driveTimeApiKey: "",
    driveData: {
        lastUpdated: new Date().getTime(),
        content: {}
    }
};
var quote = {},
    port = process.env.PORT || 3000;

var randomQute = getRandomQuote();


function updateWeatherData(key,location) {
    request('https://api.forecast.io/forecast/' + key + '/' + location, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            userData.weather = body;
        } else{
             console.log("API call to weather not working.\n" + error);
        };
    });
}
/*
function updateServer(){
    exec("git pull", (err, stdout, stderr) => {
        if (err) {
          console.log('stderr: ' + stderr);
          return;
        }
        console.log('stdout: ' + stdout);
      });
}*/

function getCurrentDriveTime(originLatLon,destLat,destLon,driveTimeApiKey) {
    var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + originLatLon + '&destinations=' + destLat + ',' + destLon + '&departure_time=now&traffic_model=best_guess&key='+driveTimeApiKey;
    request(url, function (error, response, body) {


        if (!error && response.statusCode == 200) {

            if (body.status != "REQUEST_DENIED") {
                userData.driveData.content = JSON.parse(body);
                return JSON.parse(body);
            } else {
                console.log("Drive time status: " + body.status);
                return body.status;
            }
        }else{
            console.log( "Error getting drive time.\n", error );
            return body.status;
        }
    });
}

function getRandomQuote() {
    var parsedQuote;
    request('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                parsedQuote = JSON.parse(body);
            } catch (error) {
                parsedQuote = {
                    quoteText: "Loading quote...",
                    quoteAuthor: ""
                };
                //Set function to run again so a real quote is saved
                setTimeout(getRandomQuote,CONSTANTS.HALF_A_SECOND);
            }
            randomQute = parsedQuote;
            return parsedQuote;
        } else {
            console.log("Error in quote: " + error);
            // return null;
        }
    });
}

function updateRSSFeed(userUrl) {
    return new Promise(function(resolve, reject){
        var feedURL = typeof userUrl  !== 'undefined' ?  userUrl  : 'http://www.goodnewsnetwork.org/feed/';
        var req = request(feedURL);
        var feedparser = new FeedParser([]);
        var headlines = [];

        req.on('error', function (error) {
            reject(['Error', error])
        });

        req.on('response', function (res) {
            var stream = this; // `this` is `req`, which is a stream 
            if (res.statusCode !== 200) {
                this.emit('error', new Error('Bad status code'));
            }
            else {
                stream.pipe(feedparser);
            }
        });

        feedparser.on('error', function (error) {
            reject(['Error', error])
        });

        feedparser.on('readable', function () {
            // This is where the action is! 
            var stream = this; // `this` is `feedparser`, which is a stream 
            var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance 
            var item;

            while (item = stream.read()) {
                headlines.push({
                    "title": item.title,
                    "url": item.link,
                    "description" : item.description
                });
                resolve(headlines);
            }
        });
    })

}



updateWeatherData(userData.weatherAPIKey);
setInterval(updateWeatherData, CONSTANTS.WEATHER_TIMEOUT);
//getRandomQuote();
//getUserLocation();

app.use(cookieParser())

// we are specifying the html directory as another public directory
app.use(express.static(__dirname));

//Impliment users?
app.get('/mirror/:userName', function (req, res) {
    res.sendFile(__dirname + '\/index.html?userID=' + req.params.userName);
});

app.get('/setup', function (req, res) {
    res.sendFile(__dirname + '\/setup.html');
});

app.get('/weather/:apiKey/:location', function (req, res) {
    updateWeatherData(req.params.apiKey, req.params.location);
    if (req.params.apiKey !== null) {
        userData.weatherAPIKey = req.params.apiKey;
    }
    res.send(userData.weather);
});

app.get('/feeds/:encodedUrl', function (req, res) {
    updateRSSFeed(decodeURIComponent(req.params.encodedUrl)).then(function(value){
    res.send(value);
}).catch(function(reason){
    console.log("Error getting feed...")
    console.log(reason)
})

    
});

app.get('/driveTime/:currLocation/:destLat/:destLon/:apiKey', function (req, res) {
    getCurrentDriveTime(req.params.currLocation, req.params.destLat, req.params.destLon, req.params.apiKey);
    res.send(userData.driveData.content);
});

app.get('/randomQuote', function (req, res) {

    res.send(randomQute);
    getRandomQuote();

});
/*
app.get('/updateMirror', function( req, res ){
    updateServer();
    res.send({status: "updating"})
});  */

app.get('/', function (req, res) {
    res.sendFile(__dirname + '\/index.html');
});


app.listen(port, function () {
    console.log('Magic behind the mirror running at localhost:' + port + ' in your browser.');
});

// export app so we can test it
exports = module.exports = app;
