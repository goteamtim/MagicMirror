var apiKey;
var zip;
var weatherData = {};
var userDataString = getCookie('userData');
var temperatureUnits = 'Imperial';
//var userData = JSON.parse(userDataString);

function loadWeatherData(){
	$.getJSON("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&appid="+apiKey+'&units='+temperatureUnits, function(json){
		//Gather weather here as object first then use it later in broken out functuions?
			weatherData = json;
            document.querySelector("#locationName").innerHTML = json.name;
            document.querySelector("#temp_max").innerHTML = json.main.temp_max;
            document.querySelector("#temp_min").innerHTML = json.main.temp_min;
            
	})
}

function getCookie(name){
	//sanitizeName
	name += "=";
	//break cookies into array
	var cookies = document.cookie.split(';');
	//cycle through array until you find the cookie then break the function and return the stored value
	for(var i = 0; i < cookies.length; i++){
		var cookie = cookies[i];
		if(cookie.substring(1,cookie.indexOf('=')+1) == name){
			return cookie.substring(cookie.indexOf('=')+1,cookie.length);
		}
	}
}

loadWeatherData()
//Google driving api maybe?
//Uber waiting time
//Top stories
//Random uplifting quote from reddit?  /r/uplifting stories?  /r/quotes?
//Calendar