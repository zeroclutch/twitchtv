// init project
const express = require('express');
const app = express();

// add twitch stuff
const Twitch = require("twitch.tv-api");
const twitch = new Twitch({
    id: process.env.TWITCH_ID,
    secret: process.env.TWITCH_SECRET
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
