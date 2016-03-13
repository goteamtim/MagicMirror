var userData = {};

function getUsersIpInformation(){
    $.getJSON('http://ipinfo.io', function(data){
  console.log(data);
})
}
