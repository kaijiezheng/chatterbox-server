var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.sendResponse = function (response, data, statusCode, contentType) {
  headers['Content-Type'] = contentType;
  response.writeHead(statusCode, headers);
  response.end(data);
}

exports.collectData = function (request, callback) {
  var data = '';
  request.on('data', function (json) {
    data += json;
  })
  request.on('end', function () {
    callback(data);
  })
}