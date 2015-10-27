/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require("fs");

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var i = 0;

fs.readFileSync('../message.txt', 'utf8' , function (err, text) {
  var objs = text.split('\n');
  for(var j = 0; j < objs.length; j++) {
    result.results.unshift(JSON.parse(objs[j]));
  }
  i = j-1;
});

var output = fs.createWriteStream('../message.txt');

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
  headers['Content-Type'] = "text/plain";
  var statusCode;
  if (request.method === 'POST'  /*(request.url === '/classes/messages' || request.url === '/classes/room1')*/) {
    var data = '';
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
    });
    statusCode = 201
  } else if(request.method === 'GET' && (request.url === '/classes/messages' || request.url === '/classes/room1' || request.url.charAt(1) === '?')) {
    statusCode = 200;
  } else if(request.method === 'GET' && request.url === '/') {
    headers['Content-Type'] = 'text/html';
    statusCode = 200;
    response.writeHead(statusCode, headers);

    var file_stream = fs.createReadStream('./refactor.html');

    file_stream.on("error", function(exception) {
      console.error("Error reading file: ", exception);
    });
     
    file_stream.on("data", function(data) {
      response.write(data.toString());
    });
     
    file_stream.on("close", function() {
      response.end();
    });

  } else if(request.url.slice(0, 7) === '/client'){

    statusCode = 200;
    var type = '';
    var extension = request.url.split('.')[1]
    
    if(extension === 'js') {
      type = 'text/javascript'
    } else if (extension === 'css') {
      type = 'text/css';
    } else {
      type = 'image/gif';
    }

    headers['Content-Type'] = type;
    response.writeHead(statusCode, headers);

    var file_stream = fs.createReadStream('.'+request.url);

    file_stream.on("error", function(exception) {
      console.error("Error reading file: ", exception);
    });
     
    file_stream.on("data", function(data) {
      response.write(data.toString());
    });
     
    file_stream.on("close", function() {
      response.end();
    });

  } else {
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
  if(request.url !== '/' && request.url.slice(0, 7) !== '/client') {
    response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

    response.end(JSON.stringify(result));
    // console.log('saibfvikelwyorpibipvqeljflbvwqeilnvw')
    // if(request.method === 'POST') {
    //   fs.appendFile('./message.json', JSON.stringify(result.results[0]), function (err) {
    //     if (err) throw err;
    //     console.log('The "data to append" was appended to file!');
    //   });
    // } 
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
