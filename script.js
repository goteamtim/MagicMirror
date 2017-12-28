var u = window.location.hash;
document.querySelector('#submit').addEventListener("click", function(){
var q = document.querySelector('#input').value;
  window.location = q + u.replace('#','?')
})
