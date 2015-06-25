(function() {
    IF.Database = function() {
        this.getStations = function() {
            $.get('/bikes', function(data) {
                return data;
            });
        }
    }
}());