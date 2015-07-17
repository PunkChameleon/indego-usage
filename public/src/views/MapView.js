(function() {

    IF.Views.MapView = Backbone.View.extend({
        initialize: function(options) {
            this.options = options;
            this.lat = options.lat || 39.952626;
            this.lng = options.lng || -75.163519;
            this.getMarkers();
            //this.getMap();
        },

        render: function() {

        },

        setMap: function() {
            console.log( "setting map" );
            console.log( this );
            var mapOptions = {
                zoom: 14,
                center: new google.maps.LatLng(this.lat, this.lng)
            };

            this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            // Try HTML5 geolocation
            //if(navigator.geolocation) {
            //    var _this = this;
            //    navigator.geolocation.getCurrentPosition(function(position) {
            //        var pos = new google.maps.LatLng(position.coords.latitude,
            //            position.coords.longitude);
            //
            //        var infowindow = new google.maps.InfoWindow({
            //            map: _this.map,
            //            position: pos,
            //            content: 'Location found using HTML5.'
            //        });
            //
            //        _this.map.setCenter(pos);
            //    }, function() {
            //        this.handleNoGeolocation(true);
            //    });
            //} else {
            //    // Browser doesn't support Geolocation
            //    this.handleNoGeolocation(false);
            //}

            //this.createMarkers();

            var infowindow = new google.maps.InfoWindow();

            var marker, i;

            for ( i = 0; i < this.locations.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(this.locations[i]["lat"], this.locations[i]["lon"]),
                    map: this.map
                });

                google.maps.event.addListener(marker, 'click', (function(marker, i, context) {
                    return function() {
                        var contentString = [
                            '<h4>' + context.locations[i]["name"] + '</h4>',
                            '<p>Arrivals: ' + context.locations[i]["arrivals"] + '</p>',
                            '<p>Departures: ' + context.locations[i]["departures"] + '</p>'
                        ].join('');

                        infowindow.setContent(contentString);
                        infowindow.open(context.map, marker);
                    }
                })(marker, i, this));
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

            //var infoWindow = new google.maps.InfoWindow(options);
            this.map.setCenter(options.position);
        },

//        getMap: function() {
//            console.log( "getting map" );
////            this.createMarkers( _.bind(function(){
////                google.maps.event.addDomListener(window, 'load', this.setMap);
////            },this));
//            google.maps.event.addDomListener(window, 'load', (function(context) {
//                return function() {
//                    context.setMap();
//                }
//            })(this));
//        },

        getMarkers: function() {
            this.locations = [];
            IF.db.getStations( _.bind(function(stations, error) {
                _.each(stations, function(station) {
                    this.locations.push(station);
                }, this);

                this.setMap();
            }, this));
        }

//        createMarkers: function(callback) {
//            console.log( 'creating markers');
//            IF.db.getStations( _.bind(function(stations, error) {
//                _.each(stations, function(station, index) {
//
////                    this.createMarker(station.lat, station.lng);
//
//                    this.placeMarker(station.lat, station.lng);
//
//                }, this);
//            }, this));
//
////            callback();
//        },

        //createMarker: function(lat, lng) {
        //    console.log( 'creating marker', lat, lng );
        //    var myLatlng = new google.maps.LatLng(lat, lng);
        //
        //    var marker = new google.maps.Marker({
        //        position: myLatlng,
        //        map: this.map,
        //        title: 'Hello World!'
        //    });
        //},
        //
        //placeMarker: function(lat, lng) {
        //    console.log('place marker');
        //    google.maps.event.addDomListener(window, 'load', (function(context){
        //        console.log('about to create a marker');
        //        return function() {
        //            context.createMarker(lat, lng);
        //        }
        //    })(this));
        //}
    });

}());