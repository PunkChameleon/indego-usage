var app = (function app() {
    $.get('/bikes', function(data) {
        var stationData,
            counter = 0;
        console.log(data);
        _.each(data, function(station) {
            counter++;
            stationData = JSON.stringify(station);
            $(".stationData").append('<li>' +counter+ ') ' +stationData+ '</li>');
        })
    });
    console.log( "hello world");
})();