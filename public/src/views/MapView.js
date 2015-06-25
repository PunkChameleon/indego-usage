(function() {

    IF.Views.MapView = Backbone.View.extend({
        initialize: function(options) {
            this.options = options;
            this.lat = options.lat || 39.952626;
            this.lng = options.lng || -75.163519;
            this.getMap();
        },

        render: function() {

        },

        setMap: function() {
            var mapOptions = {
                zoom: 15
            };

            this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            // Try HTML5 geolocation
            if(navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = new google.maps.LatLng(position.coords.latitude,
                        position.coords.longitude);

                    var infowindow = new google.maps.InfoWindow({
                        map: this.map,
                        position: pos,
                        content: 'Location found using HTML5.'
                    });

                    this.map.setCenter(pos);
                }, function() {
                    this.handleNoGeolocation(true);
                });
            } else {
                // Browser doesn't support Geolocation
                this.handleNoGeolocation(false);
            }
        },

        handleNoGeolocation: function(errorFlag) {
            if(errorFlag) {
                var content = 'Error: The Geolocation service failed';
            } else {
                var content = 'Error: Your browser doesn\'t support geolocation.';
            }

            var options = {
                map: this.map,
                position: new google.maps.LatLng(39.952626, -75.163519),
                content: content
            };

            var infoWindow = new google.maps.InfoWindow(options);
            this.map.setCenter(options.position);
        },

        getMap: function() {
            google.maps.event.addDomListener(window, 'load', this.setMap);
        }
    });

}());