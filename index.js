var request = require('request'),
    _ = require('underscore'),
    Parse = require('parse').Parse,
    path = require('path'),
    express = require('express'),
    bikes = require('./routes/bikes'),
    app = express(),
    APP_ID = "xDXlzlXTR1ZSb23k54Q8bxd4SXQJOP9PAmi1im0m",
    MASTER_KEY = "WhByAllYLAO1ntPpjoyguLRqlJdZgF4E5nkt9u96",
    API_KEY = "wklBSbjwHnn4nfO3Xd8EIAehbQxvdPfXN2qEqoCX";

app.use(express.static(path.join(__dirname, 'public')));

Parse.initialize(APP_ID, "pWp60mazMjiTkjrRXEUaCZ5dTgdg3xl6zy9lAGLz");

var BikeStation = Parse.Object.extend("BikeStation");

function doStuff() {
    request('http://api.phila.gov/bike-share-stations/v1', function (error, response, body) {
          if (!error && response.statusCode == 200) {
                var query = new Parse.Query(BikeStation);
                var updatedStations = [];
                var newStations = [];
                var indegoArray = JSON.parse(body).features;


                query.find({
                    success: function(results) {
//                        stationArray = results;
                        console.log("retrieved ", results.length, " stations");

//                        if (results.length !== indegoArray.length && results.length < indegoArray.length) {
//                            // find difference
//                            var unique;
//                            for (var i = 0; i < indegoArray.length; i++) {
//                                unique = true;
//                                var indegoStation = indegoArray[i];
//
//                                for (var j = 0; j < results.length; j++) {
//                                    if(indegoStation.properties.id == results[j].get("kioskId")) {
//                                        unique = false;
//                                        break;
//                                    }
//                                }
//
//                                if (unique) {
//                                    newStations.push(indegoStation);
//                                }
//                            }
//                        }

                        _.each(indegoArray, function (value, key, list ) {
                            var id = value.properties.kioskId,
                                bikeStation = new BikeStation(),
                                difference,
                                departures,
                                arrivals,
                                unique = true,
                                recentLastAvailable = value.properties.docksAvailable,
                                insertObj = {
                                    "kioskId": value.properties.kioskId.toString(),
                                    "name": value.properties.name,
                                    "lastAvailable": value.properties.docksAvailable,
                                    "departures": 0,
                                    "arrivals": 0
                                };

                            console.log("indegoArray key: ", key);

                            // Loop through bike array results to find matching kiosk id
                            _.each(results, function (station, index, array) {
                                console.log("results key: ", index);
                                console.log("indegoId: ", id.toString(), "; ", "ParseId: ", station.get("kioskId"));
                                if (id.toString() === station.get("kioskId")) {
                                    unique = false;
                                    console.log("unique is false because we found a match!");
                                    departures = station.get("departures");
                                    arrivals = station.get("arrivals");

                                    difference = station.get("lastAvailable") - recentLastAvailable;

                                    station.set("lastAvailable", recentLastAvailable);

                                    if (difference < 0) {
                                        // Departure
                                        departures += Math.abs(difference);
                                        console.log("Departure: ", difference);
                                        station.set("departures", departures);
                                    } else if (difference > 0) {
                                        // Arrival
                                        arrivals += Math.abs(difference);
                                        console.log("Arrivals: ", difference);
                                        station.set("arrivals", arrivals);
                                    }

                                    updatedStations.push(station);
//                                    results.splice(i, 1);
//                                    console.log(results.length);
//                                    i--;
                                }
                            });

                            // If unique flag was not set to false we have a new station that needs to be saved to DB
                            if (unique) {
                                console.log("unique is true");
                                bikeStation.save(insertObj, {
                                    success: function(bikeStation) {
                                        console.log("Inserted new station.");
                                    },
                                    error: function(bikeStation, error) {
                                        console.log("New station failed to save.");
                                    }
                                });
                            }
                        });

                        // Update all things in updatedStations array
                        Parse.Object.saveAll(updatedStations, {
                            success: function(savedStations) {
                                console.log("Stations saved");
                            },
                            error: function(err) {
                                console.log("Error: ", err);
                            }
                        });

                        // Add whats left from results array to db
//                        if (newStations.length) {
//                            console.log( "A new station appeared" );
//                            _.each(newStations, function (station) {
//                                var newStation = new BikeStation();
//                                var insertObj = {
//                                    "kioskId": station.properties.kioskId.toString(),
//                                    "lastAvailable": station.properties.docksAvailable,
//                                    "departures": 0,
//                                    "arrivals": 0
//                                };
//
//                                for (var prop in insertObj) {
//                                    newStation.set( prop, insertObj[prop] );
//                                }
//
//                                newStation.save(null, {
//                                    success: function (station) {
//                                        console.log("Inserted object: ", station.attributes);
//                                        //                                            return;
//                                    },
//                                    error: function (station, error) {
//                                        console.log("Insert error: ", error);
//                                        //                                            return;
//                                    }
//                                });
//                            });
//                        }
                    },
                    error: function(object, error) {
                        console.log(object, error);
                    }
                });
          }
    });

    setTimeout(doStuff, 30000);
}

doStuff();

app.get('/bikes', bikes.getBikeData);

// Loop over data, store when changes

// Most taken bikes

// Most given

app.listen(3000);
console.log('Localhost 3000');
