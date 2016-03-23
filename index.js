var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('This is my first server checkin and this is the best I could come up with.  Listening to Pink Floyd - Comfortably Numb ;)');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});