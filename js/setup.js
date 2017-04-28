var userData = JSON.parse(localStorage.getItem('userData')) || {};

function getUsersIpInformation(){
    $.getJSON('https://ipinfo.io', function(data){
  userData.location = data;
})
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

function loadUserDataObject(){
    var inputFields =  document.querySelectorAll('.userDataField');
    for(var i = 0; i < inputFields.length; i++ ){
        inputFields[i].value = userData[inputFields[i].id];
    }
}

function saveSettings() {
    var inputFields = document.querySelectorAll('.userDataField');
    for (var i = 0; i < inputFields.length; i++) {
        var element = inputFields[i];
        console.log(element);

        if (element.value !== "") {
            if (element.type === "checkbox") {
                userData[element.id] = element.checked;
            } else {
                userData[element.id] = element.value;
            }
        }
    }
    localStorage.setItem('userData', JSON.stringify(userData));
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