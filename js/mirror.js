var apiKey,
    zip,
    weatherData = {};
var time = new Date();
var weatherLastLoadTime = time.getMilliseconds() * 1000;
var feedCycle;
var userData = JSON.parse(localStorage.getItem('userData')) || {};


var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


var month = new Array(12);
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
/**Calls the server to get information about the current weather conditions
 * @param {string} weatherApiKey - API key for weather underground
 * @param {string} location - Location of the weather in lat/long string
 */
function loadWeatherData() {
    //Check to see if they filled out the API key yet
    if (!userData.hasOwnProperty('weatherApiKey')) {
        $("#setupError").modal();
        return null;
    }
    if(userData.showWeather && userData.ip_info != undefined)
    {
        $.getJSON("/weather/" + userData.weatherApiKey + '/' + userData.ip_info.loc, function (json) {
            //Gather weather here as object first then use it later in broken out functuions?
            if (!json.hasOwnProperty('currently')) {
                setTimeout(function () {
                    loadWeatherData();
                    //Need to handle for having a loop here.
                }, 500);
                return;
            }
            weatherData = json;
            localStorage.setItem('weatherData', JSON.stringify(json));
            document.querySelector("#currTemp").innerHTML = Math.round(json.currently.apparentTemperature) + "&deg;";
            document.querySelector("#currDesc").innerHTML = json.hourly.summary;
    
            //Alerts (if any)
            if(json.hasOwnProperty('alerts')){
                for (var i = 0; i < json.alerts.length; i++) {var element = json.alerts[i];
                    document.querySelector("#currentAlert").innerHTML +=  json.alerts[i].title + " : ";
                    //description:expires:regions:severity:time:title:uri
                }
            
            }
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
            skycons.add("clear-night", json.currently.icon);
            skycons.play();
        })
    }

};

function refreshQuote(userInfo) {
    if(userInfo.showQuote){
        $.getJSON("/randomQuote", function (json) {
            document.querySelector("#quote-container").style.visibility = "visible";
            document.querySelector("#quote").innerHTML = json.quoteText;
            document.querySelector("#quoteAuthor").innerHTML = json.quoteAuthor;
            if (json.quoteAuthor === "") {
                document.querySelector("#quoteAuthor").innerHTML = "Unknown";
            }
        })
    }else{
        document.querySelector("#quote-container").style.visibility = "hidden";
    }
};

function getNewsFeed(url) {
    if(url != "undefined"){
        $.getJSON("/feeds/" + encodeURIComponent(url), function (feedArray) {
            //console.log(feedArray)
            if (feedArray === []) {
                //Call again to see if you can parse.  You should keep track and only try a few times.
                setTimeout(getNewsFeed.bind(null, url), 500);
            }
            cycleFeed(feedArray)
        });
    }
};

function updateDrivingDistance(currLoc, destLat, destLon, apiKey) {

    $.getJSON('/driveTime/' + currLoc + '/' + userData.destLat + '/' + userData.destLon + '/' + userData.distanceApiKey).done(function (json) {
        if (json.hasOwnProperty('rows') && json.status != 'REQUEST_DENIED') {
            document.querySelector("#currentDriveTime").innerHTML = json.rows[0].elements[0].duration_in_traffic.text;
            document.querySelector('#drive-time-container').style.visibility = "visibile";
        } else {
            document.querySelector("#currentDriveTime").innerHTML = 'Error: -1'
        }
    });
}

function updateDate() {
    var d = new Date();
    var n = weekday[d.getDay()];
    document.querySelector('#today').innerHTML = n;
    document.querySelector('#date').innerHTML = month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function startCurrTime() {
    var today = new moment();
    if(userData.timeFormat == "Military"){
        document.querySelector('#currentTime').innerHTML = new moment().format('HH' + ":" + "mm");
    }else{
        document.querySelector('#currentTime').innerHTML = new moment().format('h' + ":" + "m a");
    }
    setTimeout(startCurrTime, 500);
};

function zeroBuffer(i) {
    if (i < 10) 
    { 
        i = "0" + i; 
    }  // add zero in front of numbers < 10
    return i;
};

function getUsersIpInformation() {
    $.get('https://ipinfo.io/json', function (data) {
        userData.ip_info = data;
        localStorage.setItem('userData', JSON.stringify(userData))
    });
}

function init() {
    getNewsFeed(userData.userRssFeed);
    getUsersIpInformation();
    loadWeatherData();
    updateDate();
    refreshQuote(userData);
    startCurrTime();
    updateDrivingDistance(userData.ip_info.loc);
}

function cycleFeed(feedArray) {
    var copiedFeed = feedArray;
    var rand = Math.floor(Math.random() * feedArray.length);
    var e = document.getElementById('rssFeed');
    $('#rssFeed').fadeOut('slow', function () {
        console.log(feedArray[rand])
        while (e.innerHTML === feedArray[rand].title && feedArray.length > 1 && feedArray !== undefined) {
            rand = Math.floor(Math.random() * (feedArray.length + 1));
        }
        e.innerHTML = feedArray[rand].title + " -" + feedArray[rand].description;
        e.href = feedArray[rand].url;
        $('#rssFeed').fadeIn('slow');
    });

    feedCycle = setTimeout(cycleFeed.bind(this, copiedFeed), 30500);
}

function standardMilitaryTimeSwap( time ){

}

window.onclick= function()
{
window.location = '/setup';
}

setTimeout(init, 1500);

module.exports = {
    zeroBuffer: zeroBuffer
}