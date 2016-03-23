var express = require('express');
var app = express();
var request = require('request');
var fs = require('fs');

// we are specifying the html directory as another public directory
app.use(express.static(__dirname));


//

app.get('/mirror',function(req,res){

});

app.get('/weather', function(req, res) {
    request('https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // Show the HTML for the Google homepage.
        }
    })
    res.send();
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});