"use strict";
// client-side js
// run by the browser each time your view template is loaded

function callServer(params, endpoint, callback) {
  var xhr = new XMLHttpRequest();
  endpoint += "?data=true"
  for (var param in params) {
    endpoint +=  "&" + param + "=" + params[param];
  }
  console.log("URL:" + endpoint)
  xhr.open( "GET", endpoint, true );
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4 && xhr.status == 200)
        callback(xhr.responseText);
  }
  xhr.send( null );
  return xhr.responseText;
}

var Client = {
  retrieve: function(command, params) {
    callServer((params || {}), Client[command].endpoint, Client[command].callback)
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
    topGames: [{"name":"Fortnite","image":"https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-272x380.jpg","viewers":227368,"channels":8950},{"name":"League of Legends","image":"https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-272x380.jpg","viewers":70328,"channels":1658},{"name":"Hearthstone","image":"https://static-cdn.jtvnw.net/ttv-boxart/Hearthstone-272x380.jpg","viewers":67381,"channels":296},{"name":"IRL","image":"https://static-cdn.jtvnw.net/ttv-boxart/IRL-272x380.jpg","viewers":42908,"channels":593},{"name":"PLAYERUNKNOWN'S BATTLEGROUNDS","image":"https://static-cdn.jtvnw.net/ttv-boxart/PLAYERUNKNOWN%27S%20BATTLEGROUNDS-272x380.jpg","viewers":32733,"channels":1806},{"name":"Overwatch","image":"https://static-cdn.jtvnw.net/ttv-boxart/Overwatch-272x380.jpg","viewers":21912,"channels":1299},{"name":"Dota 2","image":"https://static-cdn.jtvnw.net/ttv-boxart/Dota%202-272x380.jpg","viewers":16968,"channels":336},{"name":"Counter-Strike: Global Offensive","image":"https://static-cdn.jtvnw.net/ttv-boxart/Counter-Strike:%20Global%20Offensive-272x380.jpg","viewers":11824,"channels":459},{"name":"Grand Theft Auto V","image":"https://static-cdn.jtvnw.net/ttv-boxart/Grand%20Theft%20Auto%20V-272x380.jpg","viewers":11385,"channels":312},{"name":"Far Cry 5","image":"https://static-cdn.jtvnw.net/ttv-boxart/Far%20Cry%205-272x380.jpg","viewers":10733,"channels":244}]
  },
  methods: {
    changeGame: function(){}
  }
});