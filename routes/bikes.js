var express = require('express'),
    bikes = express.Router(),
    _ = require('underscore'),
    Parse = require('parse').Parse;

// Raw Call
bikes.get('/bikes-raw.json', function(req, res, next) {
        var BikeStation = Parse.Object.extend("BikeStation"),
            query = new Parse.Query(BikeStation),
            resultsArray = [];

        query.find({
            success: function(results) {
                _.each(results, function(result) {
                    resultsArray.push(result.attributes);
                });

                return res.send(resultsArray);
            }
        });
});

bikes.get('/top-arrivals.json', function(req, res, next) {
        var BikeStation = Parse.Object.extend("BikeStation"),
            query = new Parse.Query(BikeStation);

        query.find({
            success: function(results) {
                return res.send(_.sortBy(results, "arrivals"));
            }
        });
});

bikes.get('/top-departures.json', function(req, res, next) {
        var BikeStation = Parse.Object.extend("BikeStation"),
            query = new Parse.Query(BikeStation);

        query.find({
            success: function(results) {
                return res.send(_.sortBy(results, "departures"));
            }
        });
});

module.exports = bikes;