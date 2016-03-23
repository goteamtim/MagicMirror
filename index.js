var express = require('express');
var app = express();
var request = require('request');
var fs = require('fs');
var userData = {};

function updateWeatherData(){
    request('https://api.forecast.io/forecast/{apiKey}/{lat},{long}', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            userData = body;
            console.log("Stored userData.");
        }
    })
};

function getCurrentDriveTime(){
    request('https://maps.googleapis.com/maps/api/distancematrix/json?origins={long},{lat}&destinations={long},{lat}&departure_time=now&traffic_model=best_guess&key={googleDistanceApiKey}', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            
            var currentTime = new Date().getTime();
            console.log("Got Drive Time: " + currentTime);
            return body;
        }
        //handle error.  
    })
};
};

updateWeatherData();
setInterval(updateWeatherData,60000*60);

// we are specifying the html directory as another public directory
app.use(express.static(__dirname));

   //Impliment users?
app.get('/mirror/:userName',function(req,res){
 res.sendFile(__dirname + '\/mirror.htm?userID='+ req.params.userName); 
});

app.get('/setup',function(req,res){
    res.sendFile(__dirname + '\/setup.htm');
});

app.get('/weather', function(req, res) {
    res.send(userData);
});

app.get('/driveTime',function(req,res){
    res.send(getCurrentDriveTime());
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});