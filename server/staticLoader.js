var utils = require('./utils.js');
var fs = require("fs");

exports.loadFile = function (request, response, url) {
  var type = '';
  var extension = url.slice(-3)
  var path = (url === '/') ? '/refactor.html' : url;

  if(extension === '.js') {
    type = 'text/javascript'
  } else if (extension === 'css') {
    type = 'text/css';
  } else if (extension === 'gif') {
    type = 'image/gif';
  } else {
    type = 'text/html';
  }

  var file_stream = fs.createReadStream('.' + path);

  utils.collectData(file_stream, function(rawData) {
    utils.sendResponse(response, rawData, 200, type);
  });
}