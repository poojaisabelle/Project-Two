// Create BASE LAYERS
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "outdoors-v11",
	accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "dark-v10",
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


// Create a baseMaps object
var baseMaps = {
	"Outdoors": outdoors,
	"Dark Map": darkmap,
	"Street Map": streetmap
};


// Initialize all of the LayerGroups we'll be using
var layers = {
  HOODED_PLOVER: new L.LayerGroup(),
	GIANT_BURROWING_FROG: new L.LayerGroup(),
	LEADBEATERS_POSSUM: new L.LayerGroup(),
	REGENT_HONEYEATER: new L.LayerGroup(),
	GREATER_GLIDER: new L.LayerGroup(),
	SWIFT_PARROT: new L.LayerGroup(),
	NEW_HOLLAND_MOUSE: new L.LayerGroup(),
	MOUNTAIN_PYGMY_POSSUM: new L.LayerGroup(),
	MALLEE_EMU_WREN: new L.LayerGroup()
};


// Define a map object
var myMap = L.map("map", {
	center: [-36.5, 145.5],
	zoom: 7,
	layers: [
		layers.HOODED_PLOVER,
		layers.GIANT_BURROWING_FROG,
		layers.LEADBEATERS_POSSUM,
		layers.REGENT_HONEYEATER,
		layers.GREATER_GLIDER,
		layers.SWIFT_PARROT,
		layers.NEW_HOLLAND_MOUSE,
		layers.MOUNTAIN_PYGMY_POSSUM,
		layers.MALLEE_EMU_WREN
	]
});

// Add outdoor layer to the map
outdoors.addTo(myMap);

// Create an overlay object to add to the layer control
var overlayMaps = {
	"Hooded Plover": layers.HOODED_PLOVER,
	"Giant Burrowing Frog": layers.GIANT_BURROWING_FROG,
	"Leadbeater's Possum": layers.LEADBEATERS_POSSUM,
	"Regent Honeyeater": layers.REGENT_HONEYEATER,
	"Greater Glider": layers.GREATER_GLIDER,
	"Swift Parrot": layers.SWIFT_PARROT,
	"New Holland Mouse": layers.NEW_HOLLAND_MOUSE,
	"Mountain Pygmy-possum": layers.MOUNTAIN_PYGMY_POSSUM,
	"Mallee Emu-wren": layers.MALLEE_EMU_WREN
};

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


// Create function to filter data for a specific animal from vbafauna api
function filterData(data, animal) {

	var animalData = data.filter(row => row.comm_name == animal);
	var filteredData = animalData.map(function(d) {
		return {
			comm_name: d.comm_name,
			start_date: d.start_date,
			latitude: d.lat,
			longitude: d.long,
			totalcount: d.totalcount      
		}
	});

	return filteredData;
}


// Create function to create an layer for each filtered animal data
function createLayer(filteredData) {

	var markers = L.markerClusterGroup();

	for (var i = 0; i < filteredData.length; i++) {
		var record = filteredData[i];

		var animalMarker = L.marker([record.latitude, record.longitude]);
		
		// bind a pop-up to show the some information on the sighting record
		animalMarker.bindPopup("<h4>" + record.comm_name +
														"</h4><hr><p>" + record.start_date + 
														'<br>' + '[' + record.latitude + ', ' + record.longitude + ']' +
														'<br>' + 'Total Sightings: ' + record.totalcount + "</p>");

		// Add a new marker to the cluster group and bind a pop-up
		markers.addLayer(animalMarker);    
	}

	return markers;
}

// Perform an api call to the vba fauna data
d3.json("/api/v1.0/vbafauna").then(function(vbadata) {

	// Loop through each key value pairs in the overlay Maps object
	Object.entries(overlayMaps).forEach(([key, value]) => {

		var filteredData = filterData(vbadata, key);
		var markers = createLayer(filteredData);

		// Add the marker cluster to the appropriate layer
		markers.addTo(value);
	});
});