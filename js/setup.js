var userData = {};

function getUsersIpInformation(){
    $.getJSON('http://ipinfo.io', function(data){
  userData["location"] = data;
  //storeCookie("userData",JSON.stringify(userData));
})
}

function storeCookie(name,cookieData){
		document.cookie = name + '=' + cookieData;
}

function getCoords(){
    if(!userData.hasOwnProperty("location")){
        getUsersIpInformation();
    }
    var location = userData.location.loc;
    var lat = location.substr(0,location.indexOf(","));
    var lon = location.substr(location.indexOf(",")+1,location.length);
    $('#latitude').val(+lat);
    $('#longitude').val(+lon);
}

function saveSettings(){
    var inputFields = document.querySelectorAll('.userDataField');
    for (var i = 0; i < inputFields.length; i++) {
        var element = inputFields[i];
        console.log(element);
        if(element.value != ""){
            userData[element.id] = element.value;
        }
    }
        storeCookie('userData',JSON.stringify(userData));
}

$('.checkbox').change(function(){
    
    if ($('#' + this.id).prop('checked')) {
        $('#' + this.id + 'Field').attr('disabled',true);
        console.log(this.id);
    }else{
        $('#' + this.id + 'Field').attr('disabled',false);
    }
});


$('form').submit(function(event) {
	event.preventDefault();
	saveSettings();
	
})


getUsersIpInformation();