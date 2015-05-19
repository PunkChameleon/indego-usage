var _ = require('underscore'),
    Parse = require('parse').Parse;

exports.getBikeData = function(req, res, next) {
    var BikeStation = Parse.Object.extend("BikeStation");
    var query = new Parse.Query(BikeStation);
    var resultsArray = [];

    query.find({
        success: function(results) {
            _.each(results, function(result) {
                resultsArray.push(result.attributes);
            });

            return res.send(resultsArray);
        }
    });
};