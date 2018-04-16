"use strict";
// client-side js
// run by the browser each time your view template is loaded

function callServer(params, endpoint) {
  var xhr = new XMLHttpRequest();
  endpoint += "?data=true"
  for (var param in params) {
    endpoint +=  "&" + param + "=" + params[param];
  }
  console.log("URL:" + endpoint)
  xhr.open( "GET", endpoint, false );
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4 && xhr.status == 200)
        return xhr.responseText;
  }
  xhr.send( null );
  console.log(xhr.onreadystatechange())
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
      return JSON.parse(data)
    }
  }
}

var Vue;

const app = new Vue({
  el: "#app",
  data: {
    state: "directory",
    topGames: Client.retrieve("topGames"),
    topStreams: ""
  },
  methods: {
    changeGame: function(game){
      this.topStreams = Client.retrieve("topStreams", {game: game});
      this.state = "streams"
    }
  }
});