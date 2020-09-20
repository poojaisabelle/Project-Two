d3.json("/api/v1.0/vbafauna").then(function(vbadata) {


	// Create function to filter data for a specific animal from vbafauna api
	function filterData(animal) {

		var animalData = vbadata.filter(row => row.comm_name == animal);
		var filteredData = animalData.map(function(d){
			return {
				common_name: d.comm_name,
				date: d.start_date,
				latitude: d.lat,
				longitude: d.long,
				totalsightings: d.totalcount      
			}
		});

		return filteredData;
	}


	// Create function to create an layer for each filtered animal data
	function createLayer(filteredData) {
		console.log("Creating Frog Layer");
	
		var markers = L.markerClusterGroup();
	
		for (var i = 0; i < filteredData.length; i++) {
			var record = filteredData[i];
	
			var animalMarker = L.marker([record.latitude, record.longitude]);
				
			// bind a pop-up to show the some information on the sighting record
			animalMarker.bindPopup(record.comm_name);
	
			// Add a new marker to the cluster group and bind a pop-up
			markers.addLayer(animalMarker);    
		}
	
		return markers;
	}


	function createMap(animalLayer) {
		
		// Create BASEMAP layers
		var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
			maxZoom: 18,
			id: "outdoors-v11",
			accessToken: API_KEY
		});

		var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
			attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
			tileSize: 512,
			maxZoom: 18,
			zoomOffset: -1,
			id: "mapbox/streets-v11",
			accessToken: API_KEY
		});

		var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
			maxZoom: 18,
			id: "dark-v10",
			accessToken: API_KEY
		});


		// Create a baseMaps object
		var baseMaps = {
			"Outdoors": outdoors,
			"Street Map": streetmap,
			"Dark Map": darkmap
		};

		// Create an overlay object to add to the layer control
		var overlayMaps = {
			"Swift Parrot": animalLayer
		};

		// // Initialize all of the LayerGroups we'll be using
		// var layers = {
		// 	SWIFTPARROT: new L.LayerGroup()
		// };

		// Define a map object
		var myMap = L.map("map", {
			center: [-37.5, 145],
			zoom: 8,
			layers: [outdoors, animalLayer]
		});

		// // Add satellite layer to the map
		// outdoors.addTo(myMap);

		// // Create an overlay object to add to the layer control
		// var overlayMaps = {
		// 	"Swift Parrot": layers.SWIFTPARROT
		// };

		// Pass our map layers into our layer control
		// Add the layer control to the map
		L.control.layers(baseMaps, overlayMaps, {
			collapsed: false
		}).addTo(myMap);
	}
	
	var filteredData = filterData("Swift Parrot");
	var animalLayer = createLayer(filteredData);
	createMap(animalLayer);

});

// // Filter Swift Parrot data
// var swiftParrotData = data.filter(row => row.comm_name == "Swift Parrot");
// var latitude = swiftParrotData.map(row => +row.lat);
// var longitude = swiftParrotData.map(row => +row.long);
// var totalsightings = swiftParrotData.map(row => +row.totalcount)

// console.log(totalsightings);

// for (var i = 0; i < swiftParrotData.length; i++) {
// 	var circleMarkers = L.marker(
// 		[latitude[i], longitude[i]], {
// 			fillOpacity: 0.5,
// 			fillColor: "rgb(240, 107, 107)",
// 			color: "rgb(240, 107, 107)",
// 			radius: totalsightings[i] * 1000
// 		});

// 	// Add the new marker to the appropriate layer
// 	circleMarkers.addTo(layers.SWIFTPARROT);
// }

// })	



// // Create function to color cicles according to earthquake magnitudes
// function getColor(d) {
// 	return d >= 5 ? "rgb(240, 107, 107)" :
// 					d >= 4 ? "rgb(240, 167, 107)" :
// 					d >= 3 ? "rgb(243, 186, 77)" :
// 					d >= 2 ? "rgb(243, 219, 77)" :
// 					d >= 1 ? "rgb(225, 243, 77)" :
// 										"rgb(183, 243, 77)";
// };

// // Perform an API call to the earthquake data endpoint

// d3.json(earthquakeUrl).then(function(infoEarth) {
	
// 	// Grab the features earthquake data
// 	var earthFeatures = infoEarth.features;

// 	for (var i = 0; i < earthFeatures.length; i++) {
		
// 		//Define variable magnitudes and coordinates of the earthquakes
// 		var magnitudes = earthFeatures[i].properties.mag;
// 		var coordinates = earthFeatures[i].geometry.coordinates;

// 		// Add circles and bind PopUps to map
// 		var circleMarkers = L.circle(
// 													[coordinates[1], coordinates[0]], {
// 														fillOpacity: 0.9,
// 														fillColor: rgb(240, 107, 107),
// 														color: getColor(magnitudes),
// 														stroke: false,
// 														radius: magnitudes * 17000
// 													});

// 		// Add the new marker to the appropriate layer
// 		circleMarkers.addTo(layers.EARTHQUAKES);

// 		// Bind a popup to the marker that will  display on click. This will be rendered as HTML
// 		circleMarkers.bindPopup("<h3>" + earthFeatures[i].properties.place +
// 										"</h3><hr><p>" + new Date(earthFeatures[i].properties.time) + 
// 										'<br>' + '[' + coordinates[1] + ', ' + coordinates[0] + ']' + "</p>");
// 	};
// });

// // Legend for the chart
// var legend = L.control({position: 'bottomright'});
// legend.onAdd = function () {

// 	var div = L.DomUtil.create('div', 'info legend'),
// 		grades = [0, 1, 2, 3, 4, 5];

// 	// loop through our magnitude intervals and generate a label with a colored square for each interval
// 	for (var i = 0; i < grades.length; i++) {
// 		div.innerHTML +=
// 			'<i style="background:' + getColor(grades[i]) + '"></i> ' +
// 			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
// 	}
// 	return div;
// };
// legend.addTo(myMap);



//**** BELOW ARE TRACEY'S REFERENCES CODE. PLEASE REFER TO /IGNORE/ DELETE AS YOU LIKE

// // CREATE BASE LAYERS
// var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "satellite-v9",
//   accessToken: API_KEY
// });

// var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "light-v10",
//   accessToken: API_KEY
// });

// var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "outdoors-v11",
//   accessToken: API_KEY
// });

// // Create a baseMaps object
// var baseMaps = {
//   "Satellite": satellite,
// 	"Grayscale": grayscale,
// 	"Outdoors": outdoors
// };

// // Initialize all of the LayerGroups we'll be using
// var layers = {
//   TECTONIC_LINE: new L.LayerGroup(),
//   EARTHQUAKES: new L.LayerGroup()
// };

// // Define a map object
// var myMap = L.map("map", {
// 	center: [23.6978, 120.9605],
// 	zoom: 4,
//   layers: [
// 		layers.TECTONIC_LINE,
// 		layers.EARTHQUAKES
// 	]
// });

// // Add satellite layer to the map
// satellite.addTo(myMap);

// // Create an overlay object to add to the layer control
// var overlayMaps = {
// 	"Fault Lines": layers.TECTONIC_LINE,
//   "Earthquakes": layers.EARTHQUAKES
// };

// // Pass our map layers into our layer control
// // Add the layer control to the map
// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(myMap);

// // Store our API endpoints
// var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// // Perform a call to the tectonic endpoint
// d3.json(tectonicUrl).then(function(infoTec) {

// 	// Grab the features tectonic data
// 	var tecFeatures = infoTec.features;

// 	for (var i = 0; i < tecFeatures.length; i++) {

// 		// Because the coordinates in geojson are ordered reversely against what 
// 		// should be passed into Leaflet to be rendered correctly, we'll create an array to
// 		// reorder each pair of coordinates
// 		var coordinates = tecFeatures[i].geometry.coordinates;

// 		var orderedCoordinates = [];

// 		orderedCoordinates.push(
// 			coordinates.map(coordinate => [coordinate[1], coordinate[0]])
// 		);

// 		// Create tectonic lines
// 		var lines = L.polyline(orderedCoordinates, {color: "rgb(255, 165, 0)"});
		
// 		// Add the new marker to the appropriate layer
// 		lines.addTo(layers.TECTONIC_LINE);
// 	};
// });


// // Create function to color cicles according to earthquake magnitudes
// function getColor(d) {
// 	return d >= 5 ? "rgb(240, 107, 107)" :
// 					d >= 4 ? "rgb(240, 167, 107)" :
// 					d >= 3 ? "rgb(243, 186, 77)" :
// 					d >= 2 ? "rgb(243, 219, 77)" :
// 					d >= 1 ? "rgb(225, 243, 77)" :
// 										"rgb(183, 243, 77)";
// };

// // Perform an API call to the earthquake data endpoint

// d3.json(earthquakeUrl).then(function(infoEarth) {
	
// 	// Grab the features earthquake data
// 	var earthFeatures = infoEarth.features;

// 	for (var i = 0; i < earthFeatures.length; i++) {
		
// 		//Define variable magnitudes and coordinates of the earthquakes
// 		var magnitudes = earthFeatures[i].properties.mag;
// 		var coordinates = earthFeatures[i].geometry.coordinates;

// 		// Add circles and bind PopUps to map
// 		var circleMarkers = L.circle(
// 													[coordinates[1], coordinates[0]], {
// 														fillOpacity: 0.9,
// 														fillColor: getColor(magnitudes),
// 														color: getColor(magnitudes),
// 														stroke: false,
// 														radius: magnitudes * 17000
// 													});

// 		// Add the new marker to the appropriate layer
// 		circleMarkers.addTo(layers.EARTHQUAKES);

// 		// Bind a popup to the marker that will  display on click. This will be rendered as HTML
// 		circleMarkers.bindPopup("<h3>" + earthFeatures[i].properties.place +
// 										"</h3><hr><p>" + new Date(earthFeatures[i].properties.time) + 
// 										'<br>' + '[' + coordinates[1] + ', ' + coordinates[0] + ']' + "</p>");
// 	};
// });

// // Legend for the chart
// var legend = L.control({position: 'bottomright'});
// legend.onAdd = function () {

// 	var div = L.DomUtil.create('div', 'info legend'),
// 		grades = [0, 1, 2, 3, 4, 5];

// 	// loop through our magnitude intervals and generate a label with a colored square for each interval
// 	for (var i = 0; i < grades.length; i++) {
// 		div.innerHTML +=
// 			'<i style="background:' + getColor(grades[i]) + '"></i> ' +
// 			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
// 	}
// 	return div;
// };
// legend.addTo(myMap);