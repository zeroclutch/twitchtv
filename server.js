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

function refreshTopGames() {
  twitch.getTopGames()
  .then(data => {
    topGames = [];
    for(var i = 0; i < data.top.length; i++) {
      const currentGame = data.top[i];
      topGames.push({name:currentGame.game.name, image:currentGame.game.box.large, viewers: currentGame.viewers, channels: currentGame.channels})
    }
  })
  .catch(error => {
      console.error(error);
  })
}
refreshTopGames()

// refresh top games every minute
setInterval(() => {
  refreshTopGames()
}, 60000);


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/topGames", function (request, response) {
  response.send(topGames);
});

app.get("/topStreams", function (request, response) {
  const options = {game: request.query.game, language: "en"};
  console.log(options)
  twitch.getTopStreams(options)
    .then(data => {
        response.send(data)
    })
    .catch(error => {
        console.error(error);
        response.send({"error": error})
    })
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

