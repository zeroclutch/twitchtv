// init project
const express = require('express');
const app = express();

// add twitch stuff
const Twitch = require("twitch.tv-api");
const twitch = new Twitch({
    id: process.env.TWITCH_ID,
    secret: process.env.TWITCH_SECRET
});

var topGames = [];

// refresh top games every minute
//setInterval(() => {
  twitch.getTopGames()
  .then(data => {
    console.log(data.top[0])
    topGames = [];
    for(var i = 0; i < data.top.length; i++) {
      const currentGame = data.top[i];
      topGames.push({name:currentGame.game.name, image:currentGame.game.box.large, viewers: currentGame.viewers, channels: currentGame.channels})
    }
  })
  .catch(error => {
      console.error(error);
  })
//}, 60000);

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
