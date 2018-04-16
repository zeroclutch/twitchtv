// client-side js
// run by the browser each time your view template is loaded

function callServer(params, endpoint, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open( "GET", endpoint, false ); // false for synchronous request
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4 && xhr.status == 200)
        callback(xhr.responseText);
  }
  xhr.send( null );
  return xhr.responseText;
}

