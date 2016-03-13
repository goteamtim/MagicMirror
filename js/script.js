var apiKey;
var zip;

function loadData(){
	$.getJSON("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&appid="+apiKey, function(json){
		//Gather weather here as object first then use it later in broken out functuions?
			console.log(json)

	})
}

loadData()
//Google driving api maybe?
//Uber/lyft waiting time
//Top stories
//Random uplifting quote from reddit?  /r/uplifting stories?  /r/quotes?