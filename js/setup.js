var userData = JSON.parse(localStorage.getItem('userData')) || {};

function getUsersIpInformation(){
    $.getJSON('https://ipinfo.io', function(data){
  userData.location = data;
})
}

// function getUserLocation() {
//     request('https://ipinfo.io', function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             userData["ip_info"] = JSON.parse(body);
//         } else {
//             console.log("Error in IP: " + error);
//         }
//     });
// } 

function getCoords(){
    if(!userData.hasOwnProperty("location")){
        getUsersIpInformation();
    }
    var location = userData.ip_info.loc;
    var lat = location.substr(0,location.indexOf(","));
    var lon = location.substr(location.indexOf(",")+1,location.length);
    $('#latitude').val(+lat);
    $('#longitude').val(+lon);
}

function loadUserDataObject(){
    var inputFields =  document.querySelectorAll('.userDataField');
    for(var i = 0; i < inputFields.length; i++ ){
        inputFields[i].value = userData[inputFields[i].id];
    }
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
        localStorage.setItem('userData',JSON.stringify(userData));
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
loadUserDataObject();