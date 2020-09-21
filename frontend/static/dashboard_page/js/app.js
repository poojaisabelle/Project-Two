// Create a function to retreieve "fun facts" for each species 
function getFunFacts(animal) {
	d3.json("/api/v1.0/aggregation").then((data) => {

		// Obtain the metadata array that contains the taxon ID 
		// and the scientific name 
		var metaData = data.metadata;
		//console.log(metaData[0]);

		// Filter the metadata by common name 
		result = metaData.filter(function(d) {
			return d._id === animal;
		});

		console.log(result);

		// Clear the panel before a new animal is chosen 
		var funFactsPanel = d3.select("#species-metadata");
		funFactsPanel.html("");

		// Create an empty array that will contain the scientific name 
		// and Taxon ID of each species
		//var funFacts = [];
		// Append the taxon id and scientific name


		
		// Create array to store scientific name and taxon id  
		Object.entries(result[0]).forEach((key) => {

			// Append fun fact info to the panel and format 
			// console.log(key);
			funFactsPanel.append("p").text(key[0] + ": " + key[1]);
			});



	});
}
getFunFacts(978);



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


// // 2. BAR CHART 
// function barChart(animal) {
// 	d3.json("/api/v1.0/aggregation").then((Data) => {

// 		//




// 	});
// }



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
		getFunFacts(animalChosen);

	});
}

function optionChanged(newAnimal) {
	gaugeChart(newAnimal);
	getFunFacts(newAnimal);
}

init();