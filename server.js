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
  twitch.getTopStreams(options)
    .then(data => {
        var topStreams = {
          total: data.total,
          streams: []
        };
    for(var i = 0; i < data.streams.length; i++) {
      const currentStream = data.streams[i];
      topStreams.streams.push({
        name:currentStream.channel.name,
        title:currentStream.channel.status,
        preview:currentStream.preview.large,
        viewers: currentStream.viewers,
        quality: currentStream.video_height,
        streamType: currentStream.stream_type
      })
    }
    response.send(topStreams)
    })
    .catch(error => {
        console.error(error);
        response.send({"error": error})
    })
});

app.get("/featuredStreams", function (request, response) {
  const options = {game: request.query.game};
  twitch.getFeaturedStreams(options)
    .then(data => {
        var featuredStreams = [];
    for(var i = 0; i < data.featured.length; i++) {
      const currentStream = data.featured[i].stream;
      featuredStreams.push({
        name:currentStream.channel.name,
        title:currentStream.channel.status,
        preview:currentStream.preview.large,
        viewers: currentStream.viewers,
        quality: currentStream.video_height,
        streamType: currentStream.stream_type
      })
    }
    response.send(featuredStreams)
    })
    .catch(error => {
        console.error(error);
        response.send({"error": error})
    })
});

app.get("/user", function (request, response) {
  twitch.getUser(request.query.user)
  .then(data => {
    response.send({name:data.stream.channel.display_name, viewers:data.stream.viewers, lifetimeViews:data.stream.channel.views, game: data.stream.channel.game, avatar: data.stream.channel.logo})
  })
  .catch(error => {
    console.error(error);
    response.send({"error": error});
  });
});

app.get("/search", function (request, response) {
  twitch.searchGames(request.query.query, true)
    .then(data => {
    if(data.games) {
      var results = [];
      console.log(data.games[0])
      for(var i = 0; i < data.games.length; i++) {
        const currentGame = data.games[i];
        results.push({name:currentGame.name, logo:currentGame.logo.small})
      }
      console.log(results)
      response.send({results})
    } else {
      response.send({games:[]})
    }
    })
    .catch(error => {
        console.error(error);
        response.send({"error": error})
    });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

