// init project
const express = require('express');
const app = express();

// add twitch stuff
const http = require('request');
const Twitch = require("twitch.tv-api");
const twitch = new Twitch({
    id: process.env.TWITCH_ID,
    secret: process.env.TWITCH_SECRET
});

var topGames = [];

function refreshTopGames() {
  twitch.getTopGames({limit: 50})
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
//app.use(express.static(__dirname + '/public'));
app.use(express.static('public'))


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
        name: currentStream.channel.name,
        title: currentStream.channel.status,
        preview: currentStream.preview.large,
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
        name: currentStream.channel.name,
        game: currentStream.channel.game,
        title: currentStream.channel.status,
        preview: currentStream.preview.large,
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
    console.log(data)
    response.send({
      title: data.stream.channel.status,
      name:data.stream.channel.display_name,
      viewers:data.stream.viewers,
      lifetimeViews:data.stream.channel.views,
      game: data.stream.channel.game,
      avatar: data.stream.channel.logo
    })
  })
  .catch(error => {
    console.error(error);
    response.send({"error": error});
  });
});

app.get("/followingStreams", function (request, response) {
  //Get client ID
  //https://api.twitch.tv/helix/users?login=<username>
  var userID;
  var options = {
    url: 'https://api.twitch.tv/kraken/users?login=' + request.query.user,
    headers: { 
      'Client-ID': process.env.TID,
      'Accept': 'application/vnd.twitchtv.v5+json'
    }
  };
  
  function getUserID(error, res, body) {
    if (!error && res.statusCode == 200) {
      body = JSON.parse(body);
      console.log(body)
      userID = body.users[0] ? body.users[0]._id : undefined;
      console.log(userID);
      //Get following list
      var options = {
        url: 'https://api.twitch.tv/kraken/users/' + (userID || request.query.user) + '/follows/channels?limit=100',
        headers: { 
          'Client-ID': process.env.TID,
          'Accept': 'application/vnd.twitchtv.v5+json'
        }
      };

      function getFollowing(error, res, body) {
        console.log(error, body)
        if (!error && res.statusCode == 200) {
          var info = JSON.parse(body);
          var followingStreams = [];
          info.follows.forEach((stream) => {
            followingStreams.push({
              name: stream.channel.name,
              game: stream.channel.game,
              title: stream.channel.status,
              viewers: stream.viewers,
              quality: stream.video_height,
              preview: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_{user}-640x360.jpg'.replace('{user}',stream.channel.name),
              streamType: stream.stream_type
            })
          });
          response.send(followingStreams);
        }
      }
      
      if(userID) http(options, getFollowing);
      else response.send('{"error": "user not found"}');
    } else {
      console.error(error);
      response.send('{"error": "user not found"}');
    }
  }
  
  http(options, getUserID)
});


/*app.get("/streamList", async function (request, response) {
  const users = request.query.users.split(",");
  const streams = await (function() {
    var streams = [];
    for(var i = 0; i < users.length; i++) {
      if(users[i]) {
        twitch.getUser(users[i])
        .then(data => {
          if(data.stream) {
            streams.push({title: data.stream.channel.status, name:data.stream.channel.display_name, viewers:data.stream.viewers, lifetimeViews:data.stream.channel.views, game: data.stream.channel.game, avatar: data.stream.channel.logo})
          }
        })
        .catch(error => {
          console.error(error);
          response.send({error});
        });
      }

    }

    console.log(streams)
    response.send(streams);
  })();
*/
app.get("/search", function (request, response) {
  twitch.searchGames(request.query.query, true)
    .then(data => {
    if(data.games) {
      var results = [];
      console.log(data.games[0])
      for(var i = 0; i < data.games.length; i++) {
        const currentGame = data.games[i];
        results.push({name:currentGame.name, logo:currentGame.box.template.replace("{width}","14").replace("{height}", "20")})
      }
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

// http://expressjs.com/en/starter/basic-routing.html
app.get("*", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});