var urlHash = window.location.hash;
var hashedUrl = window.location;
console.log(window.location)
console.log(urlHash.replace('#','?'))
window.location = window.location.origin + window.location.pathname + urlHash.replace('#','?')