var apiKey;
var zip;
var weatherData = {};
//var userDataString = getCookie('userData');
var time = new Date();
var weatherLastLoadTime = time.getMilliseconds() * 1000;
var userData = JSON.parse(localStorage.getItem('userData')) || {};


var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


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

function checkDay(currentDay) {
    if (currentDay >= 6) {
        return currentDay % 7;
    } else {
        return currentDay;
    }
}

function loadWeatherData() {
    //Check to see if they filled out the API key yet
    if (!userData.hasOwnProperty('weatherApiKey')) {
        $("#setupError").modal();
        return null;
    }
    $.getJSON("/weather/" + userData.weatherApiKey +'/'+userData.ip_info.loc, function (json) {
        //Gather weather here as object first then use it later in broken out functuions?
        console.log(json);
        weatherData = json;
        localStorage.setItem('weatherData', JSON.stringify(json));
        document.querySelector("#currTemp").innerHTML = Math.round(json.currently.apparentTemperature) + "&deg;";
        document.querySelector("#currDesc").innerHTML = json.hourly.summary;

        //Alerts (if any)
        //document.querySelector("#currentAlert").innerHTML = json.alerts[0].description;

        //5 day forecast
        var today = new Date().getDay();
        var counter = 1;
        for (var i = 1; i < 6; i++) {
            var dailySkycon = new Skycons({ "color": "white" });
            var icon = json.daily.data[i].icon;
            var tempMax = Math.round(json.daily.data[i].temperatureMax);
            var tempMin = Math.round(json.daily.data[i].temperatureMin);
            var day = weekday[checkDay(today + counter)];
            var ul = document.querySelector("#weatherForecast");
            var li = document.createElement("li");
            li.innerHTML = day.substr(0, 3) + " " + tempMin + "&deg;-" + tempMax + "&deg; <canvas id=\"" + day + "\" width=\"32\" height=\"32\" style=\"float: right;\"></canvas>";
            li.setAttribute("class", "weatherForecastDay");
            ul.appendChild(li);
            counter++;
            dailySkycon.add(day, icon);
            dailySkycon.play();
        }
        var skycons = new Skycons({ "color": "white" });
        skycons.add("clear-night", json.currently["icon"]);
        skycons.play();
    })

};

function refreshQuote() {
    $.getJSON("/randomQuote", function (json) {
        document.querySelector("#quote").innerHTML = json.quoteText;
        document.querySelector("#quoteAuthor").innerHTML = json.quoteAuthor;
        if (json.quoteAuthor == "") {
            document.querySelector("#quoteAuthor").innerHTML = "Unknown";
        }
    })
};

function updateDrivingDistance(currLoc, destLat, destLon, apiKey) {
    $.getJSON('/driveTime/' + currLoc + '/' + userData.destLat + '/' + userData.destLon + '/' + userData.distanceApiKey).done(function (json) {
        document.querySelector("#currentDriveTime").innerHTML = json.rows[0].elements[0].duration_in_traffic.text;
    });
}

function updateDate() {
    var d = new Date();
    var n = weekday[d.getDay()];
    document.querySelector('#today').innerHTML = n;
    document.querySelector('#date').innerHTML = month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function startCurrTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    document.querySelector('#currentTime').innerHTML = h + ":" + m;
    //changeBackground();
    setTimeout(startCurrTime, 500);
};

function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
};

function getUsersIpInformation(){
    $.getJSON('http://ipinfo.io', function(data){
  userData["ip_info"] = data;
  localStorage.setItem('userData',JSON.stringify(userData))
})
}

function init() {
    getUsersIpInformation();
    loadWeatherData();
    updateDate();
    refreshQuote();
    startCurrTime();
    updateDrivingDistance(userData.ip_info.loc);
}



setTimeout(init,1500);

