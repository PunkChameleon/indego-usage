var request = require('request'),
    _ = require('underscore'),
    path = require('path'),
    express = require('express'),
    app = express(),
    tempStore = {
        "JFK" : {
            "lastAvailable" : 0,
            "departures" : 0,
            "arrivals" : 0
        }
    };

app.use(express.static(path.join(__dirname, 'public')));

function doStuff() {
    console.log('doing stuff');
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {
    console.log('hit');

            _.each(body.features, function (value, key, list ) {
                console.log('looped');
                var id = value.properties.kioskId,
                    currentState = tempStore[id],
                    station = value.properties,
                    difference;

                if (tempStore[id]) {
                    // Do math
                    difference = station.docksAvailable - tempStore.lastAvailable;

                    if ( difference < 0 ) {
                        tempStore.arrivals += difference * -1;
                    } else {
                        tempStore.departures += difference;
                    }
                    console.log(tempStore);
                } else {
                    tempStore = {
                        "lastAvailable" : value.properties.docksAvailable,
                        "departures" : 0,
                        "arrivals" : 0
                    }
                
                }

                console.log(tempStore);

            });          

              // Send something

          }
    });
}

setInterval(doStuff, 30000);

// Loop over data, store when changes

// Most taken bikes

// Most given
 
app.listen(3000);
console.log('Localhost 3000')
