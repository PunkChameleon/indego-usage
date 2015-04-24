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
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {

            _.each(JSON.parse(body).features, function (value, key, list ) {
                var id = value.properties.kioskId,
                    currentState = tempStore[id],
                    station = value.properties,
                    difference;

                if (tempStore[id]) {
                    console.log('exists!');
                    // Do math
                    difference = station.docksAvailable - tempStore.lastAvailable;
                    console.log(differnce);

                    if ( difference < 0 ) {
                        tempStore.arrivals += difference * -1;
                        console.log('arrival!');
                    } else {
                        tempStore.departures += difference;
                        console.log('departure');
                    }
                    console.log(tempStore);
                } else {
                    tempStore = {
                        "lastAvailable" : value.properties.docksAvailable,
                        "departures" : 0,
                        "arrivals" : 0
                    }

                }


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
