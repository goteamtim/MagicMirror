var express = require('express');
var app = express();
var request = require('request');
//app.use(express.cookieParser());
var fs = require('fs');
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

    request('https://api.forecast.io/forecast/' + key + '/' + userData["ip_info"].loc, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            userData["weather"] = body;
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

function getCurrentDriveTime(originLatLon,destLat,destLon,driveTimeApiKey) {
    var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + originLatLon + '&destinations=' + destLat + ',' + destLon + '&departure_time=now&traffic_model=best_guess&key='+driveTimeApiKey
    console.log(url);
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            if (body.status != "REQUEST_DENIED") {
                console.log(typeof("distType: "+body));
                userData.driveData.content = JSON.parse(body);
                return JSON.parse(body);
            } else {
                console.log("Drive time status: " + body.status);
                return body.status;
            }
        }
        //handle error.  
    })
setTimeout(function(originLatLon,destLat,destLon,driveTimeApiKey){
    getCurrentDriveTime(originLatLon,destLat,destLon,driveTimeApiKey);
},900000)
};

function getRandomQuote() {
    var parsedQuote;
    request('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en', function(error, response, body) {
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
    updateWeatherData(req.params.apiKey);
    if (req.params.apiKey != null) {
        userData.weatherAPIKey = req.params.apiKey;
    }
    
    res.send(userData["weather"]);
});

app.get('/driveTime/:destLat/:destLon/:apiKey', function(req, res) {
    
        getCurrentDriveTime(userData.ip_info.loc,req.params.destLat,req.params.destLon,req.params.apiKey);
    
       res.send(userData.driveData.content);
    

});

app.get('/randomQuote', function(req, res) {
    
        res.send(randomQute);
        //Get the next random quote since sometimes it has to go through a few to find valid json
    getRandomQuote();
    
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});