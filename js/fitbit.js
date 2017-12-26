var urlHash = window.location.hash;
var hashedUrl = window.location;
window.location = window.location.origin + window.location.pathname + urlHash.replace('#','?')