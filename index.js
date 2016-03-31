var express = require('express');
var app = express();
var request = require('request');
//app.use(express.cookieParser());
var fs = require('fs');
var userData = {
    ip_info: {},
    weather: {},
    weatherAPIKey: "",
    driveData: {
        lastUpdated: new Date(),
        content: {}
    }
};
var quote = {};

var randomQute = getRandomQuote();

function updateWeatherData(key) {
    console.log("PassedKey: "+ key);
    //Check if the ip information exists and if it doesnt call the function and wait
    if (!userData["ip_info"].hasOwnProperty("loc")) {
        getUserLocation();
        setTimeout(function(){updateWeatherData(userData.weatherAPIKey);}, 5000);
        return;
    }
    console.log("test" + userData["ip_info"].loc);
    console.log("key: " + key)
    request('https://api.forecast.io/forecast/' + key + '/' + userData["ip_info"].loc, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            userData["weather"] = body;
            console.log("Stored userData.");
        } else { console.log("API call to weather not working.\n" + error); }
    })
};

function getUserLocation() {
    request('http://ipinfo.io', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            userData["ip_info"] = JSON.parse(body);
        } else {
            console.log("Error in IP: " + error);
        }
    })
};

function getCurrentDriveTime(originLatLon,destLat,destLon) {
    request('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + originLatLon + '&destinations=' + destLat + ',' + destLon + '&departure_time=now&traffic_model=best_guess&key={googleDistanceApiKey}', function(error, response, body) {
        if (!error && response.statusCode == 200) {

            if (body.status != "REQUEST_DENIED") {
                var currentTime = new Date().getTime();
                console.log("Drive time status: " + body.status)
                console.log("Got Drive Time: " + currentTime);
                return body;
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
    console.log("enteredQuote");
    request('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("quote type: " + typeof(body));
            //Issue here
            try {
                parsedQuote = JSON.parse(body);
                console.log("should be object: " + typeof(parsedQuote));
            } catch (error) {
                parsedQuote = {
                    quoteText: "Loading quote...",
                    quoteAuthor: ""
                };
                //Set function to run again so a real quote is saved
                setTimeout(function(){getRandomQuote();
                    console.log("\nTrying again\n");},500);
                
            }
            randomQute = parsedQuote;
            return parsedQuote;
        } else {
            console.log("Error in quote: " + error);
        }
    })
};

updateWeatherData(userData.weatherAPIKey);
setInterval(updateWeatherData, 60000 * 60);
//getRandomQuote();
getUserLocation();

// we are specifying the html directory as another public directory
app.use(express.static(__dirname));

//Impliment users?
app.get('/mirror/:userName', function(req, res) {
    res.sendFile(__dirname + '\/mirror.htm?userID=' + req.params.userName);
});

app.get('/setup', function(req, res) {
    res.sendFile(__dirname + '\/setup.htm');
});

app.get('/weather/:apiKey', function(req, res) {
    if (req.params.apiKey != null) {
        userData.weatherAPIKey = req.params.apiKey;
    }
    
    res.send(userData["weather"]);
});

app.get('/driveTime/:destLat/:destLon', function(req, res) {
    res.send(getCurrentDriveTime(userData.ip_info.loc,req.params.destLat,req.params.destLon));
});

app.get('/randomQuote', function(req, res) {
    
        res.send(randomQute);

    console.log("Sending: " + typeof(randomQute));
    getRandomQuote();
    
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});