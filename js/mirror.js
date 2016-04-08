var apiKey;
var zip;
var weatherData = {};
//var userDataString = getCookie('userData');
var time = new Date();
var weatherLastLoadTime = time.getMilliseconds() * 1000;
var userData = JSON.parse(localStorage.getItem('userData'));

function loadWeatherData() {
    $.getJSON("http://localhost:3000/weather/" + userData.weatherApiKey, function(json) {
        //Gather weather here as object first then use it later in broken out functuions?
        weatherData = json;
        localStorage.setItem('weatherData',JSON.stringify(json));
        document.querySelector("#currTemp").innerHTML = Math.round(json.currently["apparentTemperature"]);
        document.querySelector("#currDesc").innerHTML = json.hourly.summary;

        var skycons = new Skycons({ "color": "white" });
        skycons.add("clear-night", json.currently["icon"]);
        skycons.play();
    })

};

function refreshQuote() {
    $.getJSON("http://localhost:3000/randomQuote", function(json) {
        document.querySelector("#quote").innerHTML = json.quoteText;
        document.querySelector("#quoteAuthor").innerHTML = json.quoteAuthor;
        if (json.quoteAuthor == "") {
            document.querySelector("#quoteAuthor").innerHTML = "Unknown";
        }
    })
};

function updateDrivingDistance(destLat, destLon) {
    $.getJSON('http://localhost:3000/distance/destLat/destLon', function(json) {
        //do something with json here
        //update currentDriveTime
    });
}

function updateDate() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var n = weekday[d.getDay()];
    document.querySelector('#today').innerHTML = n;
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    document.querySelector('#date').innerHTML = month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}



loadWeatherData()
updateDate()
refreshQuote()
//Uber waiting time
//Top stories
//Calendar
