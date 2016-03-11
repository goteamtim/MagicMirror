function loadData(){
	$.getJSON("https://api.forecast.io/forecast/{API_KEY}/32.8050413,-117.2580296", function(json){
		//Gather weather here as object first then use it later in broken out functuions?
			console.log(json)

	})
}

loadData()
//Google driving api maybe?
//Uber/lyft waiting time
//Top stories
//Random uplifting quote from reddit?  /r/uplifting stories?  /r/quotes?