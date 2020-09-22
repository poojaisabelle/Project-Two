// Create a function to retreieve "fun facts" for each species 
function getFunFacts(animal) {
	d3.json("/api/v1.0/aggregation").then((data) => {

		// Obtain the metadata array that contains the taxon ID 
		// and the scientific name 
		var metaData = data.metadata;
		// console.log(metaData);

		// Filter the metadata by common name 
		result = metaData.filter(function(d) {
			return d._id === animal;
		});
		// console.log(result);

		// Get the first object 
		object = result[0];
		// console.log(object);

		// Clear the panel before a new animal is chosen 
		var funFactsPanel = d3.select("#species-metadata");
		funFactsPanel.html("");

		// Create array to store scientific name and taxon id  
		Object.entries(object).forEach((key) => {

			// Append fun fact info to the panel and format 
			// console.log(key);
			funFactsPanel
				.append("p")
				.text(`${key[0].replace(/_/g, " ").toUpperCase()}: ${key[1]}`);
			});
	}); //.catch( error =>  console.log(error));
}
getFunFacts(978);

// IMAGE AND INFO SCRAPED 
function getImageInfo(animal) {
	d3.json("/api/v1.0/scrapedfauna").then((scrapedData) => {

		console.log(scrapedData);

		// Rename array 
		animalInfo = scrapedData;

		// Filter to animal name 
		result = animalInfo.filter(row => row.animal_name === animal)[0];

		if (result === undefined) {
			return;
		}
		// console.log(result.image_url);

		d3.select(".img-gallery")
			.html(`<img src="${result.image_url}">`);	
	});
}
getImageInfo(978);



// 1. GAUGE CHART 

function gaugeChart(animal) {

	// Read in the JSON from the aggregation route 
	d3.json("/api/v1.0/aggregation").then((data) => {
		//console.log(data);

		// Obtain the metadata array that contains the 
		// total sightings per species  
		var metaData = data.metadata;
		//console.log(metaData)

		// Filter by common name/ _id 
		var result = metaData.filter(function(object) {
			return object._id === animal;
		});

		//console.log(result);
		
		// Obtain the totalsightings number 
		totalSightings = result[0].total_sightings;
		//console.log(totalSightings);
	
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
        });// .catch( error =>  console.log(error));
}
gaugeChart(978)

// 2. TIME SERIES CHART 
function buildTimeSeries(animal) {

	// Use D3 to read in the JSON data 
	d3.json("/api/v1.0/aggregation").then((data) => {

		// Access the records array 
		var records = data.records;
		// console.log(records);

		// Filter to specific animal 
		var result = records.filter(row => row._id === animal)[0]
		
		if (result === undefined) {
			return;
		}

		var startDate = result.start_date;

		var newDates = [];

		startDate.map(function(date) {
			newDates.push(date.slice(8, 16));
		});
		// console.log(newDates);

		// obtain number of sightings 
		var numSightings = result.number_sightings;


		var data = [
			{
			  x: newDates,
			  y: numSightings,
			  type: 'scatter'
			}
		  ];
		  
		  Plotly.newPlot('bubble', data);		

	});// .catch( error =>  console.log(error));
}
buildTimeSeries(978);



// Create an init function to initialize the page 
function init() {

	// Use D3 to select the dropdown menu 
	var dropDown = d3.select("#selDataset");

	// Use D3 to read in the JSON data 
	d3.json("/api/v1.0/aggregation").then((data) => {

		// Access the metadata array 
		var metaData = data.metadata;

		// Create array to store distinct species name 
		var speciesName = metaData.map(row => row._id);
		//console.log(speciesName);

		speciesName.forEach(function(name) {
			dropDown.append("option").text(name).property("value")
		});

		var animalChosen = dropDown.node().value;
		//console.log(animalChosen);

		gaugeChart(animalChosen);
		getFunFacts(animalChosen);
		getImageInfo(animalChosen);
		buildTimeSeries(animalChosen);

	});
}

function optionChanged(newAnimal) {
	gaugeChart(newAnimal);
	getFunFacts(newAnimal);
	getImageInfo(newAnimal);
	buildTimeSeries(newAnimal);
}

init();