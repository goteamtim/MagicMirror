var express = require('express');
var app = express();
var request = require('request');
var fs = require('fs');
var userData = {
    ip_info: {},
    weather: {}
};
var quote = {};

function updateWeatherData() {
    //Check if the ip information exists and if it doesnt call the function and wait
    if (!userData["ip_info"].hasOwnProperty("loc")) {
        getUserLocation();
        setTimeout(updateWeatherData, 5000);
        return;
    }
    console.log("test" + userData["ip_info"].loc);
    request('https://api.forecast.io/forecast/{apiKey}/' + userData["ip_info"].loc, function(error, response, body) {
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

function getCurrentDriveTime() {
    request('https://maps.googleapis.com/maps/api/distancematrix/json?origins={long},{lat}&destinations={long},{lat}&departure_time=now&traffic_model=best_guess&key={googleDistanceApiKey}', function(error, response, body) {
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
    request('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            //Issue here
            try {
                var parsedQuote = JSON.parse(body);
            } catch (error) {
                console.log(error);
                
            }
            
            console.log("---" + parsedQuote.quoteText);
            return parsedQuote;
        } else {
            console.log("Error in quote: " + error);
        }
    })
};

updateWeatherData();
setInterval(updateWeatherData, 60000 * 60);
getRandomQuote();
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

app.get('/weather', function(req, res) {
    res.send(userData["weather"]);
});

app.get('/driveTime', function(req, res) {
    res.send(getCurrentDriveTime());
});

app.get('/randomQuote', function(req, res) {
    res.send(getRandomQuote());
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});