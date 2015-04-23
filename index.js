var request = require('request'),
    _ = require('underscore'),
    express = require('express'),
    app = express();

app.get('/', function (req, res) {
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {
                  res.send(body)
          }
    });
});
 
app.listen(3000);
