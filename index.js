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

function makeLogFun(station, currentState, type) {
    var logger = [
        station.name, 
        "departures - ", 
        currentState.departures,
        "arrivals - ",
        currentState.arrivals
    ].join(" ");
    console.log('----' + type + '----');
    console.log(logger);

}

function doStuff() {
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {

            _.each(JSON.parse(body).features, function (value, key, list ) {

                var id = value.properties.kioskId,
                    savedState = tempStore[id],
                    currentState = value.properties,
                    difference;

                if (savedState) {
                    // Do math - Current Docks Available - Last Amount of Docks Available
                    difference = currentState.docksAvailable - savedState.lastAvailable;

                    // if difference is positive, then bikes have been added
                    if ( difference < 0 ) {
                        savedState.arrivals = savedState.arrivals + Math.abs(difference);
                        makeLogFun(currentState, savedState, "arrivals");
                    } else {
                        savedState.departures = savedState.departures + difference;
                        if (difference) {
                            makeLogFun(currentState, savedState, "departure");
                        }
                    }

                    savedState.lastAvailable = currentState.docksAvailable;

                } else {
                    tempStore[id] = {
                        "name" : currentState.name,
                        "lastAvailable" : currentState.docksAvailable,
                        "departures" : 0,
                        "arrivals" : 0
                    }
                }

            });

              // Send something

          } else {
            console.log(error);
          }
    });
}
setInterval(doStuff, 30000);

// Loop over data, store when changes

// Most taken bikes

// Most given

app.listen(3000);
console.log('Localhost 3000')
