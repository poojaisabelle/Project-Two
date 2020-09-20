// // TO TEST WHETHER DATA CAN BE READ IN
// // Use D3 fetch to read the JSON file
// // The data from the JSON file is arbitrarily named importedData as the argument
// function retrieveFaunaData(recordId) {
// 	d3.json("/api/v1.0/aggregation").then((importedData) => {
// 		console.log(importedData);
// 	});
// }
// retrieveFaunaData(978)

// 1. GAUGE CHART 

function gaugeChart(animal) {

	// Read in the JSON from the aggregation route 
	d3.json("/api/v1.0/aggregation").then((data) => {
		console.log(data);

		// Obtain the metadata array that contains the 
		// total sightings per species  
		var metaData = data.metadata;
		console.log(metaData)

		// Filter by common name/ _id 
		var result = metaData.filter(function(object) {
			return object._id === animal;
		});

		console.log(result);
		
		// Obtain the totalsightings number 
		totalSightings = result[0].totalSightings;
		console.log(totalSightings);
	
		// MAKE GUAGE CHART 
		
		var data = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: totalSightings,
              title: { text: "<b>Rarity Scale</b> <br> Total Sightings in the last 5 years </br>", font: { size: 16 } },
              gauge: {
                axis: { range: [1, 3000], tickwidth: 1, tickcolor: "black" },
                bgcolor: "white",
                bar: { color: "#E3E3DD" },
                borderwidth: 1,
                bordercolor: "gray",
                steps: [
					{ range: [0, 500], color: "#F31919" },
					{ range: [500, 1000], color: "#F35519" },
					{ range: [1000, 1500], color: "#F39219" },
					{ range: [1500, 2000], color: "#F3BA19" },
					{ range: [2000, 2500], color: "#F3D519" },
					{ range: [2500, 3000], color: "#E9F319" }
                ],
              }
            }
          ];
		  
		  var layout = {
			width: 500,
			height: 400,
			margin: { t: 25, r: 35, l: 25, b: 25 },
			font: { color: "black", family: "Arial" },
		  };
		  
		  Plotly.newPlot('gauge', data, layout);
        });
}
gaugeChart(978)

// Create an init function 
function init() {

	// Use D3 to select the dropdown menu 
	var dropDown = d3.select("#selDataset");

	// Use D3 to read in the JSON data 
	d3.json("/api/v1.0/aggregation").then((data) => {

		// Access the metadata array 
		var metaData = data.metadata;

		// Create array to store distinct species name 
		var speciesName = metaData.map(row => row._id);
		console.log(speciesName);

		// // Create array to store distinct species names 
		// var uniqueAnimals = d3.map(metaData, function(d) {
		// 	return d._id;
		// }).keys()
		// console.log(uniqueAnimals);

		speciesName.forEach(function(name) {
			dropDown.append("option").text(name).property("value")
		});

		var animalChosen = dropDown.node().value;
		console.log(animalChosen);

		gaugeChart(animalChosen);

	});
}

function optionChanged(newAnimal) {
	gaugeChart(newAnimal);
}


init();