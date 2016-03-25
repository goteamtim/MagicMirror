var apiKey;
var zip;
var weatherData = {};
var userDataString = getCookie('userData');
var weatherLastLoadTime = Date.now();
//var userData = JSON.parse(userDataString);

function loadWeatherData() {
    var currentTime = Date.now();
    //Dont get the weather if called within two hours for now
    if (weatherLastLoadTime + 720000 > currentTime) {
        $.getJSON("http://localhost:3000/weather", function(json) {
            //Gather weather here as object first then use it later in broken out functuions?
            weatherData = json;
            storeCookie(JSON.stringify(json),'weatherData');
            document.querySelector("#currTemp").innerHTML = Math.round(json.currently.apparentTemperature);
            document.querySelector("#currDesc").innerHTML = json.hourly.summary;
        })
    } else {

    }

}

function refreshQuote(){
    $.getJSON("http://localhost:3000/randomQuote", function(json) {
        console.log(json);
            document.querySelector("#quote").innerHTML = json.quoteText;
            document.querySelector("#quoteAuthor").innerHTML = json.quoteAuthor;
        })
};

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
    document.getElementById('today').innerHTML = n;
}

function getCookie(name) {
    //sanitizeName
    name += "=";
    //break cookies into array
    var cookies = document.cookie.split(';');
    //cycle through array until you find the cookie then break the function and return the stored value
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        if (cookie.substring(1, cookie.indexOf('=') + 1) == name) {
            return cookie.substring(cookie.indexOf('=') + 1, cookie.length);
        }
    }
}

var storeCookie = function(cookieData, source) {
    //Remember if cookie data doesnt wor you changed this function
    if (source == null) {
        document.cookie = cookieData;
    } else {
        document.cookie = source + '=' + cookieData;
    }

}


loadWeatherData()
updateDate()
refreshQuote()
//Google driving api maybe?
//Uber waiting time
//Top stories
//Random uplifting quote from reddit?  /r/uplifting stories?  /r/quotes?
//Calendar

var skycons = new Skycons({ "color": "white" });
// on Android, a nasty hack is needed: {"resizeClear": true}

// you can add a canvas by it's ID...
skycons.add("clear-night", Skycons.PARTLY_CLOUDY_NIGHT);

// ...or by the canvas DOM element itself.
skycons.add(document.getElementById("icon2"), Skycons.RAIN);

// if you're using the Forecast API, you can also supply
// strings: "partly-cloudy-day" or "rain".

// start animation!
skycons.play();