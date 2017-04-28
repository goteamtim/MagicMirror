var express = require('express');
var app = express();
var request = require('request');
//var firebase = require('./js/db.js')
var FeedParser = require('feedparser');
var jsdom = require('jsdom')
//app.use(express.cookieParser());
///var fs = require('fs');
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

function updateWeatherData(key, location) {
    //console.log("PassedKey: "+ key);
    //Check if the ip information exists and if it doesnt call the function and wait
    // if (!userData["ip_info"].hasOwnProperty("loc")) {
    //     getUserLocation();
    //     setTimeout(function(){updateWeatherData(userData.weatherAPIKey);}, 5000);
    //     return;
    // }
    request('https://api.forecast.io/forecast/' + key + '/' + location, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            userData.weather = body;
        } else { console.log("API call to weather not working.\n" + error); }
    })
};



function getCurrentDriveTime(originLatLon, destLat, destLon, driveTimeApiKey) {
    var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + originLatLon + '&destinations=' + destLat + ',' + destLon + '&departure_time=now&traffic_model=best_guess&key=' + driveTimeApiKey
    console.log(url);
    request(url, function (error, response, body) {


        if (!error && response.statusCode == 200) {

            if (body.status != "REQUEST_DENIED") {
                console.log(typeof ("distType: " + body));
                userData.driveData.content = JSON.parse(body);
                return JSON.parse(body);
            } else {
                console.log("Drive time status: " + body.status);
                return body.status;
            }
        }
        //handle error.  
    })
};

function getRandomQuote() {
    var parsedQuote;
    request('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //Issue here
            try {
                parsedQuote = JSON.parse(body);
            } catch (error) {
                parsedQuote = {
                    quoteText: "Loading quote...",
                    quoteAuthor: ""
                };
                //Set function to run again so a real quote is saved
                setTimeout(function () {
                    getRandomQuote();
                    console.log("\nTrying again\n");
                }, 500);

            }
            randomQute = parsedQuote;
            return parsedQuote;
        } else {
            console.log("Error in quote: " + error);
        }
    })
};

function getUberEstimate(latitude, longitude, uberServerToken) {
    $.ajax({
        url: "https://api.uber.com/v1/estimates/price",
        headers: {
            Authorization: "Token " + uberServerToken
        },
        data: {
            start_latitude: latitude,
            start_longitude: longitude,
            //Dont think I need destinations currently.  Only get wait time and possibly surge pricing?
            //end_latitude: destLatitude,
            //end_longitude: destLongitude
        },
        success: function (result) {
            console.log(result);
        }
    });
}




function updateRSSFeed(feedURL = 'http://www.goodnewsnetwork.org/feed/') {

    var req = request(feedURL)
    var feedparser = new FeedParser([]);
    var headlines = [];

    req.on('error', function (error) {
        // handle any request errors 
        return ['Error',error];
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
        // always handle errors 
        return ['Error',error];
    });

    feedparser.on('readable', function () {
        // This is where the action is! 
        var stream = this; // `this` is `feedparser`, which is a stream 
        var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance 
        var item;

        while (item = stream.read()) {
            headlines.push(item.title);
        }
    });
    return headlines;
}

var rssHeadlines = updateRSSFeed();
updateWeatherData(userData.weatherAPIKey);
setInterval(updateWeatherData, 60000 * 60);
//getRandomQuote();
//getUserLocation();

// we are specifying the html directory as another public directory
app.use(express.static(__dirname));

//Impliment users?
app.get('/mirror/:userName', function (req, res) {
    res.sendFile(__dirname + '\/mirror.htm?userID=' + req.params.userName);
});

app.get('/setup', function (req, res) {
    res.sendFile(__dirname + '\/setup.htm');
});

app.get('/weather/:apiKey/:location', function (req, res) {
    updateWeatherData(req.params.apiKey, req.params.location);
    if (req.params.apiKey !== null) {
        userData.weatherAPIKey = req.params.apiKey;
    }

    res.send(userData.weather);
});

app.get('/uber/:destLat/:destLon/:apiKey', function (req, res) {
    getUberEstimate(req.params.destLat, req.params.destLon, req.params.apiKey);
    res.send(userData.uber);
});

app.get('/driveTime/:currLocation/:destLat/:destLon/:apiKey', function (req, res) {
    getCurrentDriveTime(req.params.currLocation, req.params.destLat, req.params.destLon, req.params.apiKey);
    console.log(userData.driveData.content);
    res.send(userData.driveData.content);
});

app.get('/randomQuote', function (req, res) {

    res.send(randomQute);
    //Get the next random quote since sometimes it has to go through a few to find valid json
    getRandomQuote();

});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '\/mirror.htm');
})


app.listen(port, function () {
    console.log('Navigate to localhost:' + port + ' in your browser.');
});
