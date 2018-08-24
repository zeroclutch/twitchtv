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
  },
  user: {
    endpoint: "/user",
    callback: function(data) {
      return JSON.parse(data)
    }
  },
  streamList: {
    endpoint: "/streamList",
    callback: function(data) {
      return JSON.parse(data)
    }
  },
  search: {
    endpoint: "/search",
    callback: function(data) {
      return JSON.parse(data)
    }
  }
}

var Vue, Twitch, VueRouter, route;

//Setup routing
route.start(true)
route.base('#/')

route(function(target, params) {
  if (target === "directory") {
    app.viewDirectory(true);
  } else if (target === "featured") {
    app.viewFeatured(true);
  } else if (target === "games") {
    app.changeGame(params.replace(/_/g, " "), true);
  } else if (target === "channels") {
    app.watchStream(params, true);
  }
})

const app = new Vue({
  el: "#app",
  data: {
    state: "directory",
    topGames: Client.retrieve("topGames"),
    topStreams: {},
    featuredStreams: [],
    currentGame: "",
    currentStream: "",
    user: "",
    streamData: {},
    gameDropdown: false,
    gameSearch: {},
    streams: {
      starred: (function() {
        return localStorage.getItem("starred") || []
      })()
    }
  },
  methods: {
    viewDirectory: function(noRoute) {
      //Scroll to top
      scroll("#games");
      
      //Clear info
      this.currentGame = "",
      this.currentStream = "";
      //Remove current stream
      document.getElementById("twitch-embed").innerHTML = "";
      this.state = "directory";
      if(!noRoute) route("directory", 'Directory | Not Twitch TV');
    },
    viewFeatured: function(noRoute) {
      //Clear info
      this.currentGame = "",
      this.currentStream = "";
      //Remove current stream
      document.getElementById("twitch-embed").innerHTML = "";
      
      this.featuredStreams = Client.retrieve("featuredStreams", {});
      this.state = "featured"
      
      if(!noRoute) route("featured", 'Featured | Not Twitch TV');
    },
    viewFollowing: function(user, noRoute) {
      //Scroll to top
      scroll("#games");
      
      //Clear info
      this.currentGame = "",
      this.currentStream = "";
      
      //Remove current stream
      document.getElementById("twitch-embed").innerHTML = "";
      
      this.featuredStreams = Client.retrieve("featuredStreams", {user});
    },
    changeGame: function(game, noRoute) {
      //Scroll to top
      scroll("#games");
      this.topStreams = Client.retrieve("topStreams", {game: game}).streams;
      
      //Remove current stream
      document.getElementById("twitch-embed").innerHTML = "";
      
      //Loading button
      const button = document.querySelector(".game-search");
      button.classList.add("is-loading");
      
      this.topStreams = Client.retrieve("topStreams", {game: game}).streams;
      this.currentGame = game;
      this.state = "streams";
      if(!noRoute) route("games/" + game.replace(/\s/g, "_"), game.replace(/\s/g, "_") + ' | Not Twitch TV');
    }, watchStream: function(stream, noRoute) {
      //Scroll to top
      scroll("#games");
      
      //Set view to show the stream
      const button = document.querySelector(".stream-search");
      button.classList.add("is-loading");
      this.streamData = Client.retrieve("user", {user: stream});
      
      this.currentStream = stream;
      this.state = "watching"
      if(!noRoute) route("channels/" + this.currentStream.replace(/\s/g, "_"), this.currentStream.replace(/\s/g, "_") + ' | Not Twitch TV');
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
    }, starChannel: function(channel) {
      this.streams.starred.push(channel);
    }, hideTitle: function(toggle) {
      //Hides tab info
      document.title = "New Tab";
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = 'error404';
      document.getElementsByTagName('head')[0].appendChild(link);
    }, search: function(query) {
      Vue.nextTick(()=>{
      const oldVal = document.querySelector("#input-game").value;
        setTimeout(()=>{
          const currentVal = document.querySelector("#input-game").value;
          if(oldVal == currentVal) {
              this.gameSearch = Client.retrieve("search", {query});
          }
        }, 550);
      });
    }, dropdownVisibility: function(name, visible, fast) {
      const dropdown = name == 'game' ? document.querySelector(".game-dropdown") : document.querySelector(".stream-dropdown");
      if (visible) dropdown.classList.add('is-active');
      if (!visible && !fast) setTimeout( () => dropdown.classList.remove('is-active'), 1000);
      if (!visible && fast) dropdown.classList.remove('is-active');
    }
  }
});