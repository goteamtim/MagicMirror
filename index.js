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

updateWeatherData();
setInterval(updateWeatherData,60000*60);

// we are specifying the html directory as another public directory
app.use(express.static(__dirname));

   
app.get('/mirror',function(req,res){
 res.sendFile(__dirname + '\/mirror.htm'); 
});

app.get('/setup',function(req,res){
    res.sendFile(__dirname + '\/setup.htm');
});

app.get('/weather', function(req, res) {
    res.send(userData);
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});