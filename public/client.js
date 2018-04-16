// client-side js
// run by the browser each time your view template is loaded

function callServer(params, endpoint, callback) {
  var xhr = new XMLHttpRequest();
  var url = new URL(endpoint);
  for (var param in params) {
    url.searchParams.append(param, params[param]);
  }

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
    callServer(params, Client[command].endpoint, Client[command].callback)
  },
  topGames: {
    endpoint: "/topGames",
    callback: function(data) {
      console.log(data)
    }
  },
  topStreams: {
    endpoint: "/topStreams",
    callback: function(data) {
      console.log(data)
    }
  }
}

Client.retrieve({},"topGames")