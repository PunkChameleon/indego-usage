var request = require('request'),
    _ = require('underscore'),
    path = require('path'),
    express = require('express'),
    app = express(),
    tempStore = {};

function compareId(stationId) {
    console.log('DOING SOME COMPARE');    
}
app.use(express.static(path.join(__dirname, 'public')));

app.get('/proxy.json', function (req, res) {
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {

                    
                  res.send(body)
          }
    });
});

// Loop over data, store when changes

// Most taken bikes

// Most given
 
app.listen(3000);
console.log('Localhost 3000')
