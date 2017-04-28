var apiKey,
zip,
weatherData = {};
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
    $.getJSON("/weather/" + userData.weatherApiKey +'/'+userData.ip_info.loc, function (json) {
        //Gather weather here as object first then use it later in broken out functuions?
        if(!json.hasOwnProperty('currently')){
            setTimeout(function() {
                loadWeatherData();
                //Need to handle for having a loop here.
            }, 500);
        }
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
        skycons.add("clear-night", json.currently.icon);
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
        if(json.hasOwnProperty('rows')){
            document.querySelector("#currentDriveTime").innerHTML = json.rows[0].elements[0].duration_in_traffic.text;
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
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = zeroBuffer(m);
    document.querySelector('#currentTime').innerHTML = h + ":" + m;
    //changeBackground();
    setTimeout(startCurrTime, 500);
};

function zeroBuffer(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
};

function getUsersIpInformation() {
    $.getJSON('https://ipinfo.io', function (data) {
        userData.ip_info = data;
        localStorage.setItem('userData', JSON.stringify(userData))
    });
}

function init() {
    getUsersIpInformation();
    loadWeatherData();
    updateDate();
    refreshQuote();
    startCurrTime();
    updateDrivingDistance(userData.ip_info.loc);
}

function cycleFeed(feedArray){
    var rand = Math.floor(Math.random()*(feedArray.length + 1));
    var e = document.getElementById('currentAlert');
    $('#currentAlert').fadeOut('fast',function(){
        e.innerHTML = feedArray[rand].title;
        e.href = feedArray[rand].url;
        $('#currentAlert').fadeIn('fast');
    });
    
    setTimeout(cycleFeed.bind(null,feedArray),4000);
}

setTimeout(init,1500);




cycleFeed(
    [ { title: 'Whole Foods Is Mothering A Goose in its Parking Lot',
    url: 'http://www.goodnewsnetwork.org/whole-foods-mothering-goose-parking-lot/' },
  { title: '97-Year-old Fulfills Lifelong Dream, Becomes Firefighter For a Day',
    url: 'http://www.goodnewsnetwork.org/97-year-old-fulfills-lifelong-dream-becomes-firefighter-day/' },
  { title: 'New Study Shows that American Youth Violence is on the Decline',
    url: 'http://www.goodnewsnetwork.org/new-study-says-youth-violence-decline/' },
  { title: 'Watch Stag Climb to Elderly Woman’s Window Twice a Day For a Snack',
    url: 'http://www.goodnewsnetwork.org/watch-stag-climb-elderly-womans-window-twice-day-snack/' },
  { title: '50-Year-old Drug Saves Thousands of Moms After Childbirth',
    url: 'http://www.goodnewsnetwork.org/50-year-old-drug-saves-thousands-moms-childbirth/' },
  { title: 'Good News in History, April 27',
    url: 'http://www.goodnewsnetwork.org/events060427/' },
  { title: 'Swipe Right to Save a Species: Last Male White Rhino Takes to Tinder',
    url: 'http://www.goodnewsnetwork.org/swipe-right-save-species-last-male-white-rhino-takes-tinder/' },
  { title: 'Pope Francis is Paying the Rent of a Private Beach for the Disabled',
    url: 'http://www.goodnewsnetwork.org/pope-francis-paying-rent-private-beach-disabled/' },
  { title: 'Bloomberg Gives $3Mil to Job Training For Coal Communities in Decline',
    url: 'http://www.goodnewsnetwork.org/bloomberg-gives-3-million-to-coal-worker-retraining/' },
  { title: 'Cop Herds Lost Goats into His Police Car, Finds Owners Using Cute Pics',
    url: 'http://www.goodnewsnetwork.org/cop-herds-lost-goats-police-car-finds-owners-using-cute-pics/' },
  { title: 'What Do 30,000 Sick Kids Have in Common? Piles of New Art Supplies From Michaels',
    url: 'http://www.goodnewsnetwork.org/30000-sick-kids-common-piles-new-art-supplies-michaels/' },
  { title: 'Good News in History, April 26',
    url: 'http://www.goodnewsnetwork.org/events060426/' },
  { title: 'Wife of Late Army Ranger Finishes His Cancer Bucket List',
    url: 'http://www.goodnewsnetwork.org/wife-late-army-ranger-finishes-cancer-bucket-list/' },
  { title: 'Doritos Flies Couple to Prom After Snack-Themed Promposal',
    url: 'http://www.goodnewsnetwork.org/doritos-flies-couple-prom-snack-themed-promposal/' },
  { title: 'Chinese Man Trapped in India Finally Arrived Home After 50 Years',
    url: 'http://www.goodnewsnetwork.org/chinese-man-trapped-india-finally-arrived-home-50-years/' },
  { title: 'States to Cut College Costs by Introducing Open Source Textbooks',
    url: 'http://www.goodnewsnetwork.org/states-cut-college-costs-introducing-open-source-textbooks/' },
  { title: 'Plastic-eating Caterpillar Could Munch Waste, Scientists Say',
    url: 'http://www.goodnewsnetwork.org/plastic-eating-caterpillar-munch-waste-scientists-say/' },
  { title: 'Good News in History, April 25',
    url: 'http://www.goodnewsnetwork.org/event060425/' },
  { title: 'Craftsman Donates Tools (and Himself) to New Tool-Lending Library',
    url: 'http://www.goodnewsnetwork.org/craftsman-donates-tools-new-tool-library/' },
  { title: 'Previously-Suicidal Man Runs Marathon With Guy Who Talked Him Down From Bridge',
    url: 'http://www.goodnewsnetwork.org/previously-suicidal-man-runs-marathon-guy-talked-bridge/' } ]
)

