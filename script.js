var urlHash = window.location.hash;
document.querySelector('#submit').addEventListener("click", function(){
var url = document.querySelector('#input').value;
  window.location = url + urlHash.replace('#','?')
})
