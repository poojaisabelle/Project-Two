// Create a function to retrieve "fun facts" for each species 
function getFunFacts(animal) {
	d3.json("/api/v1.0/aggregation").then((data) => {

		// Obtain the metadata array that contains the taxon ID 
		// and the scientific name 
		var metaData = data.metadata;
		// console.log(metaData);

		// Filter the metadata by common name 
		var result = metaData.filter(function(d) {
			return d._id === animal;
		});
		// console.log(result);

		// Get the first object 
		var object = result[0];
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
	});
}


// IMAGE AND INFO SCRAPED 
function getImageInfo(animal) {
	d3.json("/api/v1.0/scrapedfauna").then((scrapedData) => {

		// console.log(scrapedData);

		// Rename array 
		var animalInfo = scrapedData;

		// Filter to animal name 
		var result = animalInfo.filter(row => row.animal_name === animal)[0];

		if (result === undefined) {
			return;
		}
		// console.log(result.image_url);

		d3.select(".img-gallery")
			.html("")
			.append("img")
			.attr("src", result.image_url)
			.attr("alt", result.image_alternative)
			.classed("img-fluid", true)
			.classed("img-thumbnail", true);
	});
}


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
		var totalSightings = result[0].total_sightings;
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
			height: 500,
			margin: { t: 25, r: 35, l: 25, b: 25 },
			font: { color: "black", family: "Arial" },
		};

		var config = {responsive: true}
		
		Plotly.newPlot('gauge', data, layout, config);
	});
}

// 2. BAR CHART 
function buildBarChart(animal) {
	d3.json("/api/v1.0/aggregation").then((data) => {

		// Access the sightings by month 
		var sightingsPerMonth = data.sightings_by_month;
		//console.log(sightingsPerMonth); 

		var object = sightingsPerMonth;
		// console.log(object); 

		// Filter the results according to the animal chosen 
		result = object.filter(object => object._id.animal_name === animal);
		// console.log(result);

		// Create empty arrays 
		var yearMonth = [];
		var totalSightings = [];


		// Loop over every result array and push info to arrays 
		result.forEach(function(d) {
			yearMonth.push(d._id.year_month);
			totalSightings.push(d.total_sightings);
		});
		// console.log(yearMonth);
		// console.log(totalSightings);

		yearMonth.sort(function(a,b) {
			a = a.split('/').reverse().join('');
			b = b.split('/').reverse().join('');
			return a > b ? 1 : a < b ? -1 : 0;
		  });
		console.log(yearMonth);

		var data = [
			{
			  x: yearMonth,
			  y: totalSightings,
			  type: 'bar'
			}
		  ];

		var layout = {
			title: 'Total Sightings Per Month',
			yaxis: {
				title: "Number of Sightings"
			},
			xaxis: {
				title: "Months",
				tickmode: 'array',
				nticks: 70,
				tickangle: -45
			}
		}

		var config = {responsive: true}
		  
		Plotly.newPlot('bar', data, layout, config);

	});
}

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
		buildBarChart(animalChosen);
		// buildTimeSeries(animalChosen);

	});
}

init();

function optionChanged(newAnimal) {
	gaugeChart(newAnimal);
	getFunFacts(newAnimal);
	getImageInfo(newAnimal);
	buildBarChart(newAnimal);
	// buildTimeSeries(newAnimal);
}