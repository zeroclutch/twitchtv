"use strict";
// client-side js
// run by the browser each time your view template is loaded

function callServer(params, endpoint) {
  var xhr = new XMLHttpRequest();
  endpoint += "?data=true"
  for (var param in params) {
    endpoint +=  "&" + param + "=" + params[param];
  }
  xhr.open( "GET", endpoint, false );
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4 && xhr.status == 200)
        return xhr.responseText;
  }
  xhr.send( null );
  return xhr.onreadystatechange();
  
}

var Client = {
  retrieve: function(command, params) {
    return Client[command].callback(callServer((params || {}), Client[command].endpoint));
  },
  topGames: {
    endpoint: "/topGames",
    callback: function(data) {
      return JSON.parse(data)
    }
  },
  topStreams: {
    endpoint: "/topStreams",
    callback: function(data) {
      const button = document.querySelector(".game-search");
      button.classList.remove("is-loading");
      return JSON.parse(data)
    }
  },
  featuredStreams: {
    endpoint: "/featuredStreams",
    callback: function(data) {
      return JSON.parse(data)
    }
  }
}

var Vue, Twitch

const app = new Vue({
  el: "#app",
  data: {
    state: "directory",
    topGames: Client.retrieve("topGames"),
    topStreams: {},
    featuredStreams: [],
    currentGame: "",
    currentStream: ""
  },
  methods: {
    viewFeatured: function() {
      this.featuredStreams = Client.retrieve("featuredStreams", {});
      this.state = "featured"
    },
    changeGame: function(game) {
      //Loading button
      const button = document.querySelector(".game-search");
      button.classList.add("is-loading");
      
      this.topStreams = Client.retrieve("topStreams", {game: game}).streams;
      this.currentGame = game;
      this.state = "streams";
    }, watchStream: function(stream) {
      //Loading button
      const button = document.querySelector(".stream-search");
      button.classList.add("is-loading");
      
      this.currentStream = stream;
      this.state = "watching"
      Vue.nextTick(function(){
        document.getElementById("twitch-embed").innerHTML = "";
        new Twitch.Embed("twitch-embed", {
          width: 1350,
          height: 780,
          channel: stream
        });
        const button = document.querySelector(".stream-search");
        button.classList.remove('is-loading');
      });
    }
  }
});