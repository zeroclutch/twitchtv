// client-side js
// run by the browser each time your view template is loaded

function callServer(params, endpoint, callback) {
  var xhr = new XMLHttpRequest();
  endpoint += "?data=true"
  for (var param in params) {
    endpoint +=  "&" + param + "=" + params[param];
  }
  console.log("URL:" + endpoint)
  xhr.open( "GET", endpoint, false ); // false for synchronous request
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4 && xhr.status == 200)
        callback(xhr.responseText);
  }
  xhr.send( null );
  return xhr.responseText;
}

var Client = {
  retrieve: function(command, params) {
    callServer((params || null), Client[command].endpoint, Client[command].callback)
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


const app = new Vue({
  el: "#app",
  data: {
    topGames: Client.retrieve("topGames")
  }
});