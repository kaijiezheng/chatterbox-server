/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require("fs");
var utils = require('./utils.js');

var i = 0;
var output;
var msgDatabase = '../message.txt';

fs.exists(msgDatabase, function(exists) {
  if(exists) {
    var file_stream = fs.createReadStream(msgDatabase);
    utils.collectData(file_stream, function(text) {
      if(text) {
        var objs = text.split('\n');
        for(var j = 0; j < objs.length; j++) {
          if(objs[j] !== '') {
            result.results.unshift(JSON.parse(objs[j]));
          }
        }
        i = j-1;
        output = fs.createWriteStream(msgDatabase);
        output.write(text);
      } else {
        output = fs.createWriteStream(msgDatabase);
      }
    });
  } else {
      output = fs.createWriteStream(msgDatabase);
  }
});

var actions = {
  'GET' : function (request, response) {
    utils.sendResponse(response, JSON.stringify(result), 200, 'text/plain');
  },

  'POST' : function (request, response) {
    utils.collectData(request, function(data) {
      var msg = JSON.parse(data);
      msg['-createdAt'] = (new Date());
      msg['objectId'] = i++;
      result.results.unshift(msg);

      output.write(JSON.stringify(msg) + '\n');

      utils.sendResponse(response, JSON.stringify({objectId: msg.objectId}), 201, 'text/plain');
    });
  },
  'OPTIONS' : function (request, response) {
    utils.sendResponse(response, null, 200, 'text/plain');
  }
};

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);

  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    utils.sendResponse(response, 'whoops', 404, 'text/plain');
  }
};

var result = {
  results: []
};

exports.requestHandler = requestHandler;
