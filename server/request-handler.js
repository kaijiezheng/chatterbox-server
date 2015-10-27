/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require("fs");

var i = 0;
var output;

fs.exists('../message.txt', function(exists) {
  if(exists) {
    var file_stream = fs.createReadStream('../message.txt');
    var text = '';

    file_stream.on("error", function(exception) {
      console.error("Error reading file: ", exception);
    });
     
    file_stream.on("data", function(data) {
      text = data.toString();
    });

    file_stream.on("close", function() {
      if(text) {
        var objs = text.split('\n');
        for(var j = 0; j < objs.length; j++) {
          if(objs[j] !== '') {
            result.results.unshift(JSON.parse(objs[j]));
          }
        }
        i = j-1;
        output = fs.createWriteStream('../message.txt');
        output.write(text);
      } else {
        output = fs.createWriteStream('../message.txt');
      }
    });
  } else {
      output = fs.createWriteStream('../message.txt');
  }
});

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var headers = defaultCorsHeaders;
  var resp = result;
  var statusCode;

  if (request.method === 'POST'  /*(request.url === '/classes/messages' || request.url === '/classes/room1')*/) {
    console.log('POSTPOSTPOSTPOST');
    headers['Content-Type'] = "text/plain";
    var data = '';
    statusCode = 201
    request.on('data', function (json) {
      data += json;
    });

    request.on('end', function() {
      var msg = JSON.parse(data)
      msg['-createdAt'] = (new Date()).now
      msg['objectId'] = i++;
      result.results.unshift(msg);

      output.write(JSON.stringify(msg) + '\n');
      // if(result.results.length > 100) {
      //   result.results.shift();
      // }
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(msg)/*JSON.stringify(result)*/);
    });

  } else if (request.method === 'GET') {
    console.log('GETGETEGETGETGET');
    statusCode = 200;

    if (request.url === '/' || request.url.slice(0, 7) === '/client') {
      var type = '';
      var extension = request.url.split('.')[1]
      var path = (request.url === '/') ? '/refactor.html' : request.url;

      if(extension === 'js') {
        type = 'text/javascript'
      } else if (extension === 'css') {
        type = 'text/css';
      } else if (extension === 'gif') {
        type = 'image/gif';
      } else {
        type = 'text/html';
      }

      headers['Content-Type'] = type;
      response.writeHead(statusCode, headers);

      var file_stream = fs.createReadStream('.' + path);

      file_stream.on("error", function(exception) {
        console.error("Error reading file: ", exception);
      });

      file_stream.on("data", function(data) {
        response.write(data.toString());
      });

      file_stream.on("close", function() {
        response.end();
      });

    } else if (request.url === '/classes/messages' || request.url === '/classes/room1' || request.url.charAt(1) === '?') {
      console.log(result)
      response.writeHead(statusCode, headers);  
      response.end(JSON.stringify(result));
    } else {
      statusCode = 404;
    }
  } else {
    console.log('40404040404');
    statusCode = 404;
  }

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  if(statusCode === 404) {
    response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

    response.end(JSON.stringify(result));
  }
};

var result = {
  results: []
};


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

// module.exports = requestHandler;
exports.requestHandler = requestHandler;
