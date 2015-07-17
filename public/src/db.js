(function() {
    IF.Database = function() {
        this.getStations = function(callback) {
            $.get('/bikes').done(function(data) {
                return callback(data);
            }).fail(function(error) {
                return callback(null, error);
            });
        }
    }
}());