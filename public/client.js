"use strict";
// client-side js
// run by the browser each time your view template is loaded

// menu
document.addEventListener('DOMContentLoaded', function () {

  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }
});

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

var Vue, Twitch, VueRouter, route;

//Setup routing
route.start(true)
route.base('#/')

/*route(function(mode, location) {
  app.state = mode
  app.currentGame = location
  app.currentStream = location
})*/

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
    viewDirectory: function() {
      //Remove current stream
      document.getElementById("twitch-embed").innerHTML = "";
      this.state = "directory";
      route("directory")
    },
    viewFeatured: function() {
      //Remove current stream
      document.getElementById("twitch-embed").innerHTML = "";
      
      this.featuredStreams = Client.retrieve("featuredStreams", {});
      this.state = "featured"
      
      route("featured")
    },
    changeGame: function(game) {
      //Remove current stream
      document.getElementById("twitch-embed").innerHTML = "";
      
      //Loading button
      const button = document.querySelector(".game-search");
      button.classList.add("is-loading");
      
      this.topStreams = Client.retrieve("topStreams", {game: game}).streams;
      this.currentGame = game;
      this.state = "streams";
      route(this.currentGame.replace(/\s/g, "-") + "/streams")
    }, watchStream: function(stream) {
      //Loading button
      const button = document.querySelector(".stream-search");
      button.classList.add("is-loading");
      
      this.currentStream = stream;
      this.state = "watching"
      Vue.nextTick(function(){
        document.getElementById("twitch-embed").innerHTML = "";
        new Twitch.Embed("twitch-embed", {
          width: "100%",
          height: 780,
          channel: stream
        });
        const button = document.querySelector(".stream-search");
        button.classList.remove('is-loading');
      });
    }
  }
});