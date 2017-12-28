var urlHash = window.location.hash;
var hashedUrl = window.location;


document.querySelector('#submit').addEventListener("click", function(){
var url = document.querySelector('#input').value;
  console.log("url: " + url)
  window.location = url + urlHash.replace('#','?')
})
