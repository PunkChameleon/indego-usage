(function() {
    IF.db = new IF.Database();

//    if (window.navigator.geolocation) {
//        var failure, success;
//        success = _.bind(function(position) {
//            console.log(position);
//            var lat = position.coords.latitude;
//            var lng = position.coords.longitude;
//
//            console.log(IF);
//
//            IF.map = new IF.Views.MapView({lat: lat, lng: lng});
//        }, this);
//        failure = function(message) {
//            alert('Cannot retrieve location!');
//        };
//        navigator.geolocation.getCurrentPosition(success, failure, {
//            maximumAge: Infinity,
//            timeout: 5000
//        });
//    }

    IF.map = new IF.Views.MapView({});
}());