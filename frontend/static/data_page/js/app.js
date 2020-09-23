// Attach HTML table and add rows for data
d3.json("/api/v1.0/vbafauna").then((importedData) => {
	// console.log(importedData);

	var data = importedData;
	var tbody = d3.select("tbody");
	// console.log("Yeah that worked")

	data.forEach((data) => {
		var row = tbody.append("tr");
		Object.entries(data).forEach(([key, value]) => {
			var cell = row.append("td");
			cell.text(value);
		});
	});
});

// Complete the event handler function for the aniaml drop down
function animalOption(inputAnimal) {

	d3.json("/api/v1.0/vbafauna").then((importedData) => {
		//console.log(importedData);

		var data = importedData;

		// Use the drop down to filter the data 
		result = data.filter(function(d) {
			return d.comm_name;
		});
		console.log(result);
		result = data.filter(data => data.comm_name == inputAnimal);
		console.log(result)
		if (result === undefined){return;}

	var tbody = d3.select("tbody");
	tbody.html("");
	result.forEach((report) => {
		var row = tbody.append('tr');
				Object.entries(report).forEach(([key, value]) => {
			// console.log(key, value);
			var cell = row.append('td');
			cell.text(value);
		});
	});
	});
}

// Complete the event handler function for the taxon drop down
function taxonOption(inputTaxon) {

	d3.json("/api/v1.0/vbafauna").then((importedData) => {
		// console.log(importedData);

		var data = importedData;

		// Use the drop down to filter the data 
		result = data.filter(function(d) {
			return d.taxon_type;
		});
		//console.log(result);
		result = data.filter(data => data.taxon_type == inputTaxon);
		//console.log(result)
		if (result === undefined){return;}

	var tbody = d3.select("tbody");
	tbody.html("");
	result.forEach((report) => {
		var row = tbody.append('tr');
				Object.entries(report).forEach(([key, value]) => {
			// console.log(key, value);
			var cell = row.append('td');
			cell.text(value);
		});
	});
	});
}

// Complete the event handler function for the aniaml drop down
function monthOption(inputMonth) {

	d3.json("/api/v1.0/vbafauna").then((importedData) => {
		// console.log(importedData);

		var data = importedData;

		// Use the drop down to filter the data 
		result = data.filter(function(d) {
			return d.start_mth;
		});
		// console.log(result);
		result = data.filter(data => data.start_mth == inputMonth);
		// console.log(result)
		if (result === undefined){return;}

	var tbody = d3.select("tbody");
	tbody.html("");
	result.forEach((report) => {
		var row = tbody.append('tr');
				Object.entries(report).forEach(([key, value]) => {
			// console.log(key, value);
			var cell = row.append('td');
			cell.text(value);
		});
	});
	});
}

// Create an init function to initialize the page 
function init() {

	// Use D3 to select the dropdown menu 
	var dropdown1 = d3.select("#selDataset1");
	var dropdown2 = d3.select("#selDataset2");
	var dropdown3 = d3.select("#selDataset3");

	// Use D3 to read in the JSON data 
	d3.json("/api/v1.0/vbafauna").then((data) => {

		var data = data;
		// console.log(typeof (data));
		// console.log(data);
	
		// Create list of unique animals
		var uniqueAnimals = d3.map(data, function (d) { return d.comm_name; }).keys()
		// console.log(uniqueAnimals);
		// console.log(typeof (uniqueAnimals));
		// console.log(d3.selectAll(uniqueAnimals).size());
	
		// Get names of animals for dropdown
		var dropdown1 = d3.select("#selDataset1")
			.selectAll("option")
			.data(uniqueAnimals)
			.enter().append("option")
			.attr("value", function (d) { return d.comm_name; })
			.text(function (d) {
				return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
		});
	
		// Create list of unique taxon type
		var uniqueTaxons = d3.map(data, function (d) { return d.taxon_type; }).keys()
	
		// Get names of taxon types for drop down
		var dropdown2 = d3.select("#selDataset2")
			.selectAll("option")
			.data(uniqueTaxons)
			.enter().append("option")
			.attr("value", function (d) { return d.taxon_type; })
			.text(function (d) {
				return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
			});
	
		// Create list of unique months
		var uniqueMonths = d3.map(data, function (d) { return d.start_mth; }).keys()
	
		// Get names of months for drop down
		var dropdown3 = d3.select("#selDataset3")
			.selectAll("option")
			.data(uniqueMonths)
			.enter().append("option")
			.attr("value", function (d) { return d.start_mth; })
			.text(function (d) {
				return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
			});
	});

		// Bind drop down values
		var animalChosen = dropdown1.node().value;
		var taxonChosen = dropdown2.node().value;
		var monthChosen = dropdown3.node().value;
		// console.log(animalChosen);

		animalOption(animalChosen);
		taxonOption(taxonChosen);
		monthOption(monthChosen);
}

// Create function for optionChange
function optionChanged1(newAnimal) {
	animalOption(newAnimal);
}

function optionChanged2(newTaxon) {
	taxonOption(newTaxon);
}

function optionChanged3(newMonth) {
	monthOption(newMonth);
}
init();
