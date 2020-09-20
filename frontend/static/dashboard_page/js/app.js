// // Use D3 fetch to read the JSON file
// // The data from the JSON file is arbitrarily named importedData as the argument
// function retrieveFaunaData(recordId) {
// 	d3.json("/api/v1.0/vbafauna").then((importedData) => {
// 		//console.log(importedData);
// 	});
// }
// retrieveFaunaData(978)


function gaugeChart(animal) {
	d3.json("/api/v1.0/vbafauna").then((importedData) => {

		// Store the Data array in a new one
		var data = importedData;
		// console.log(data)
	
		// Use nested function to aggregate number of sightings per unique species 
		var totalSightings = d3.nest()
			.key(function(d) { return d.comm_name; })
			.rollup(function(v) { return d3.sum(v, function(d) { return d.totalcount; }); })
			.entries(data);

		console.log(totalSightings)
		
		// var totalSightings = animalSightings.map(row => row.value);
		// console.log(totalSightings);
		
		// MAKE GUAGE CHART 
		
		var data = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: animalSightings,
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

	// Use D3 to read in the JSON data 
	d3.json("/api/v1.0/vbafauna").then((importedData) => {

		// Rename array 
		var data = importedData;
		// console.log(data);

		// Create array to store distinct species names 
		var uniqueAnimals = d3.map(data, function(d) {
			return d.comm_name;
		}).keys()

		console.log(uniqueAnimals);

		// Use D3 to select the dropdown menu 
		var dropDown = d3.select("#selDataset");

		uniqueAnimals.forEach(function(name) {
			dropDown.append("option").text(name).property("value")

		});

		var nameChosen = dropDown.node().value;

		gaugeChart(nameChosen);

	});
}

function optionChanged(newName) {
	gaugeChart(newName);
}


init();