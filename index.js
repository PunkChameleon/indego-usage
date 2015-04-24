var request = require('request'),
    _ = require('underscore'),
    path = require('path'),
    express = require('express'),
    app = express(),
    tempStore = {
        "JFK" : {
            "lastAvailable"
            "departures" : 0,
            "arrivals" : 0,
        }
    };

app.use(express.static(path.join(__dirname, 'public')));

function doStuff() {
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {

            _.each(body.features, function (value, key, list ) {
                var id = value.properties.kioskId,
                    currentState = tempStore[id];

                if (tempStore[id]) {
                    // Do math
                } else {
                    tempStore = {
                        "departures" : 0,
                        "arrivals" : 0
                    }
                
                }

            });          

              // Send something
              res.send(body)
          }
    });
}

// Loop over data, store when changes

// Most taken bikes

// Most given
 
app.listen(3000);
console.log('Localhost 3000')
