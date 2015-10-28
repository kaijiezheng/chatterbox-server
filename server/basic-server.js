/* Import node's http module: */
var http = require("http");
var fs = require("fs");
var urlParser = require('url');
var utils = require('./utils.js')
var handleRequest = require("./request-handler.js").requestHandler;
var loadFile = require('./staticLoader').loadFile;


// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
var port = 3000;

// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.
var ip = "127.0.0.1";



// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
var server = http.createServer(function (request, response) {
  var url = urlParser.parse(request.url).pathname;
  if(url === '/' || url.slice(0, 7) === '/client') {
    loadFile(request, response, url);
  } else if(url.slice(0, 8) === '/classes') {
    handleRequest(request, response); // normal request
  } else {
    utils.sendResponse(response, null, 404, 'text/plain');
  }
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

