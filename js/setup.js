var userData = {};

function getUsersIpInformation(){
    $.getJSON('http://ipinfo.io', function(data){
  userData["location"] = data;
  storeCookie("userData",JSON.stringify(userData));
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

$('.checkbox').change(function(){
    if (this.checked) {
        $('#' + this.id + 'Field').attr('disabled',true);
    }else{
        $('#' + this.id + 'Field').attr('disabled',false);
    }
});

getUsersIpInformation();