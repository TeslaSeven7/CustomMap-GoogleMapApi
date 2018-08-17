var choix;
var map;
var panel;
var initialize;
var calculate;
var direction;
var pos;
var posme;
var origin;
var destination;
var service;
var waypoints = [];


function initMap() {


	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 12,
		styles: [
		{elementType: 'geometry', stylers: [{color: '#242f3e'}]},
		{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
		{elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
		{
			featureType: 'administrative.locality',
			elementType: 'labels.text.fill',
			stylers: [{color: '#d59563'}]
		},
		{
			featureType: 'poi',
			elementType: 'labels.text.fill',
			stylers: [{color: '#d59563'}]
		},
		{
			featureType: 'poi.park',
			elementType: 'geometry',
			stylers: [{color: '#263c3f'}]
		},
		{
			featureType: 'poi.park',
			elementType: 'labels.text.fill',
			stylers: [{color: '#6b9a76'}]
		},
		{
			featureType: 'road',
			elementType: 'geometry',
			stylers: [{color: '#38414e'}]
		},
		{
			featureType: 'road',
			elementType: 'geometry.stroke',
			stylers: [{color: '#212a37'}]
		},
		{
			featureType: 'road',
			elementType: 'labels.text.fill',
			stylers: [{color: '#9ca5b3'}]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry',
			stylers: [{color: '#746855'}]
		},
		{
			featureType: 'road.highway',
			elementType: 'geometry.stroke',
			stylers: [{color: '#1f2835'}]
		},
		{
			featureType: 'road.highway',
			elementType: 'labels.text.fill',
			stylers: [{color: '#f3d19c'}]
		},
		{
			featureType: 'transit',
			elementType: 'geometry',
			stylers: [{color: '#2f3948'}]
		},
		{
			featureType: 'transit.station',
			elementType: 'labels.text.fill',
			stylers: [{color: '#d59563'}]
		},
		{
			featureType: 'water',
			elementType: 'geometry',
			stylers: [{color: '#17263c'}]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.fill',
			stylers: [{color: '#515c6d'}]
		},
		{
			featureType: 'water',
			elementType: 'labels.text.stroke',
			stylers: [{color: '#17263c'}]
		}
		]
	});
	service = new google.maps.places.PlacesService(map);

	
	google.maps.event.addListener(map, 'click', function(event) {	
		ination = event.latLng;
		document.getElementById('pac-input').value = event.latLng.lat()+ ',' + event.latLng.lng();
		calculate();
	});

	direction = new google.maps.DirectionsRenderer({
		map   : map, 
		panel : panel
	});

	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(function(position) {
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(pos);

			marker = new google.maps.Marker({
				map: map,
				draggable: true,
				animation: google.maps.Animation.DROP,
				position: pos
			});
			posme = pos['lat'] + ',' + pos['lng'];
			document.getElementById('pac-input1').value = pos['lat'] + ',' + pos['lng'];
			document.getElementById('panel').innerHTML = '<h2>Ma position: </h2><p>' + posme  +'</p>';
		},
		function() {
			handleLocationError(true, map.getCenter());
		});
	}

	else {
		handleLocationError(false, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
}



calculate = function(){
	choix = document.getElementById('selec').value;
	origin =  document.getElementById('pac-input1').value;
    		destination = document.getElementById('pac-input').value;
    		if(origin && destination){
    			var request = {
    				origin      : origin,
    				destination : destination,
    				waypoints: waypoints,
    				optimizeWaypoints: true,
    				provideRouteAlternatives : true,
    				travelMode  : google.maps.DirectionsTravelMode[choix]
    			}
    			var directionsService = new google.maps.DirectionsService();
    			directionsService.route(request, function(response, status){ 
    				if(status == google.maps.DirectionsStatus.OK){
    					direction.setDirections(response);
    				}
    			});
    			places();

    		}
    	};



    	function places () {

    		var places = [];
    		var infoWindow = new google.maps.InfoWindow({map: map});
    		var request = 
    		{
    			bounds: map.getBounds(),
    			types: ['museum', 'amusement_park', 'casino', 'spa', 'mosque', 'aquarium', 'art_gallery', 'zoo', 'shopping_mall', 'park']
    		};
    		service.radarSearch(request, radar);

    		function radar(results, status)
    		{
    			if (status !== google.maps.places.PlacesServiceStatus.OK) 
    			{
    				return;
    			}
    			for (var i = 0, result; result = results[i]; i++) 
    			{
    				pointsInterests(result);
    			}
    		}


    		function pointsInterests(place) 
    		{
    			for (var i = 0; i < places.length; i++)
    			{
    				if (place.place_id === places[i].place_id) 
    				{
    					return;
    				}
    			}
    			var image = 'ici.png';
    			var marker = new google.maps.Marker(
    			{
    				map: map,
    				position: place.geometry.location,
    				icon: 
    				{
    					url: 'pi.png',
    					scaledSize: new google.maps.Size(25, 25)
    				}
    			});
    			places.push(place);

    			google.maps.event.addListener(marker, 'click', function() 
    			{
    				service.getDetails(place, function(result, status) 
    				{
    					if (status !== google.maps.places.PlacesServiceStatus.OK) 
    					{
    						return;
    					}
    					var content = "<h4>" + result.name + '</h4>'; 
    					content += 
    					"<p>" + result.formatted_address + "</p>";
    					content += 
    					"<p>" + result.types + "</p>";
    					content += 
    					"<button type='button' class='buttoni' onclick='waypoint(\"" + result.formatted_address + "\")'>Passe par ici</button>";
    					infoWindow.setContent(content);
    					infoWindow.open(map, marker);
    				});
    			});
    		}



    	}

    	function waypoint(address)
    	{
    		waypoints.push({location: address, stopover: true});
    		calculate();
    	}


