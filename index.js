var request = require('request'),
    _ = require('underscore'),
    Parse = require('parse').Parse,
    Kaiseki = require('kaiseki'),
    path = require('path'),
    express = require('express'),
    app = express(),
    APP_ID = "xDXlzlXTR1ZSb23k54Q8bxd4SXQJOP9PAmi1im0m",
    MASTER_KEY = "WhByAllYLAO1ntPpjoyguLRqlJdZgF4E5nkt9u96",
    API_KEY = "wklBSbjwHnn4nfO3Xd8EIAehbQxvdPfXN2qEqoCX",
    options = {
        app_id:'xDXlzlXTR1ZSb23k54Q8bxd4SXQJOP9PAmi1im0m',
        api_key:'wklBSbjwHnn4nfO3Xd8EIAehbQxvdPfXN2qEqoCX',
        master_key: 'WhByAllYLAO1ntPpjoyguLRqlJdZgF4E5nkt9u96'
    },
    kaiseki = new Kaiseki(APP_ID, API_KEY),
    tempStore = {
        "JFK" : {
            "lastAvailable" : 0,
            "departures" : 0,
            "arrivals" : 0
        }
    };

app.use(express.static(path.join(__dirname, 'public')));

Parse.initialize(APP_ID, "pWp60mazMjiTkjrRXEUaCZ5dTgdg3xl6zy9lAGLz");

var BikeStation = Parse.Object.extend("BikeStation");

function doStuff() {
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {

            _.each(JSON.parse(body).features, function (value, key, list ) {
                var id = value.properties.kioskId,
                    collection = "Stations",
                    currentState = tempStore[id],
//                    station = value.properties,
//                    Station = new Parse.Object.extend("Station" ),
                    bikeStation = new BikeStation(),
                    query = new Parse.Query(BikeStation),
                    difference,
                    updateObj,
                    departures,
                    arrivals,
                    recentLastAvailable = value.properties.docksAvailable;

                query.equalTo("kioskId", id.toString());
                query.find({
                    success: function(results) {

                        // Does not exist yet, so we will add it.
                        if (!results.length) {
                            var insertObj = {
                                "kioskId": id.toString(),
                                "lastAvailable": value.properties.docksAvailable,
                                "departures": 0,
                                "arrivals": 0
                            };

                            for (var prop in insertObj) {
                                bikeStation.set(prop, insertObj[prop]);
                            }
                            console.log( bikeStation );
                            bikeStation.save(null, {
                                success: function(station) {
                                    console.log("Inserted object: ", station.attributes);
                                    return;
                                },
                                error: function(station, error) {
                                    console.log("Insert error: ", error);
                                    return;
                                }
                            });
                        } else {
                            // kioskId should be unique and therefore return only one result.
                            if(results.length === 1){
                                updateObj = results[0];
                                departures = updateObj.get("departures");
                                arrivals = updateObj.get("arrivals");

                                difference = updateObj.get("lastAvailable") - recentLastAvailable;

                                updateObj.set("lastAvailable", recentLastAvailable);

                                if (difference < 0) {
                                    // Departure
                                    departures += Math.abs(difference);
                                    console.log("Departure: ", difference);
                                    updateObj.set("departures", departures);
                                } else if (difference > 0) {
                                    // Arrival
                                    arrivals += Math.abs(difference);
                                    console.log("Arrivals: ", difference);
                                    updateObj.set("arrivals", arrivals);
                                }

                                updateObj.save(null, {
                                    success: function(savedStation){
                                        console.log("Saved: ", savedStation.attributes);
                                        return savedStation;
                                    },
                                    error: function(failStation, error) {
                                        console.log("Failed save: ", error);
                                        console.log(failStation);
                                    }
                                });
                            } else {
                                console.error( "More than one object with kioskId" );
                                return;
                            }
                        }
                    },
                    error: function(object, error) {
                        console.log("Query error: ", error);
                    }
                });
            });
          }
    });

    setTimeout(doStuff, 30000);
}

doStuff();

// Loop over data, store when changes

// Most taken bikes

// Most given

app.listen(3000);
console.log('Localhost 3000');
