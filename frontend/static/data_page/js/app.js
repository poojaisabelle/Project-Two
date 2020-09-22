// Grab the data with d3
d3.json("/api/v1.0/vbafauna").then((importedData) => {
	console.log(importedData);

	var data = importedData;
	// console.log(typeof (data));
	// console.log(data);

	var animalNames = data.map(row => row.comm_name);
	// console.log(typeof(animalNames));

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

	var initialData1 = uniqueAnimals[[0]];

	// Create list of unique taxon type
	var taxons = data.map(row => row.taxon_type);
	console.log(typeof (taxons));

	// Create list of unique taxon type
	var uniqueTaxons = d3.map(data, function (d) { return d.taxon_type; }).keys()

	// Get names of taxon types  for drop down
	var dropdown2 = d3.select("#selDataset2")
		.selectAll("option")
		.data(uniqueTaxons)
		.enter().append("option")
		.attr("value", function (d) { return d.taxon_type; })
		.text(function (d) {
			return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
		});

	var initialData2 = uniqueTaxons[[0]];

	// 	Create list of unique months
	var months = data.map(row => row.start_mth);
	// console.log(typeof(animalNames));

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

	var initialData3 = uniqueMonths[[0]];
});

// Insert data table
// from data.js
//var tableData = data;

// Attach HTML table and add rows for data
d3.json("/api/v1.0/vbafauna").then((importedData) => {
	console.log(importedData);

	var data = importedData;
	var tbody = d3.select("tbody");
	console.log("Yeah that worked")

	data.forEach((data) => {
		var row = tbody.append("tr");
		Object.entries(data).forEach(([key, value]) => {
			var cell = row.append("td");
			cell.text(value);
		});
	});

	// Listen for events and search date column for matches to user input

	// Select the filter button for animals
	//var button = d3.select("#selDataset1");

	// Select the form
	// var form = d3.select("#");

	// Create event handlers 
	//button.on("click", runEnter);
	//form.on("submit", runEnter);

	// Complete the event handler function for the aniaml drop down
	function optionChanged1(inputAnimal) {

		// Prevent the page from refreshing
		// d3.event.preventDefault();

		// Select the input element, property, and get the raw HTML node
		//var inputAnimal = d3.select("#selDataset1").property("value");

		// Use the drop down to filter the data 
		filteredData = data;

		filteredData = filteredData.filter(data => data.comm_name == inputAnimal);
		}

		// Show filtered results only in main table
		//   if (filteredData.length == 0) {
		//       // console.log(`No results for the parameters you have provided - ${inputDate}, ${inputCity}, ${inputState}, ${inputCountry}, ${inputShape}.`);
		//       tbody.html("");
		//       tbody.text(`There are no results for the parameters you have provided - ${inputDate}, ${inputCity}, ${inputState}, ${inputCountry}, ${inputShape}.`);
		//     } else {
		tbody.html("");
		filteredData.forEach((report) => {
			var row = tbody.append('tr');
			Object.entries(report).forEach(([key, value]) => {
				// console.log(key, value);
				var cell = row.append('td');
				cell.text(value);
			});
		});
	});

// Complete the event handler function for the taxon drop down
function optionChanged2(inputTaxon) {

	// Prevent the page from refreshing
	// d3.event.preventDefault();

	// Select the input element, property, and get the raw HTML node
	var inputType = d3.select("#selDataset2").property("value").toLowerCase();

	// Use the drop down to filter the data 
	filteredData = data;

	filteredData = filteredData.filter(data => data.taxon_type == inputTaxon);

	// Show filtered results only in main table
	//   if (filteredData.length == 0) {
	//       // console.log(`No results for the parameters you have provided - ${inputDate}, ${inputCity}, ${inputState}, ${inputCountry}, ${inputShape}.`);
	//       tbody.html("");
	//       tbody.text(`There are no results for the parameters you have provided - ${inputDate}, ${inputCity}, ${inputState}, ${inputCountry}, ${inputShape}.`);
	//     } else {
	tbody.html("");
	filteredData.forEach((report) => {
		var row = tbody.append('tr');
		Object.entries(report).forEach(([key, value]) => {
			// console.log(key, value);
			var cell = row.append('td');
			cell.text(value);
		});
	});
};

// Complete the event handler function for the aniaml drop down
function optionChanged3(inputMonth) {

	// Prevent the page from refreshing
	// d3.event.preventDefault();

	// Select the input element, property, and get the raw HTML node
	var inputMonth = d3.select("#selDataset3").property("value").toLowerCase();

	// Use the drop down to filter the data 
	filteredData = data;
	filteredData = filteredData.filter(data => data.start_mth == inputMonth);

	// Show filtered results only in main table
	//   if (filteredData.length == 0) {
	//       // console.log(`No results for the parameters you have provided - ${inputDate}, ${inputCity}, ${inputState}, ${inputCountry}, ${inputShape}.`);
	//       tbody.html("");
	//       tbody.text(`There are no results for the parameters you have provided - ${inputDate}, ${inputCity}, ${inputState}, ${inputCountry}, ${inputShape}.`);
	//     } else {
	tbody.html("");
	filteredData.forEach((report) => {
		var row = tbody.append('tr');
		Object.entries(report).forEach(([key, value]) => {
			// console.log(key, value);
			var cell = row.append('td');
			cell.text(value);
		});
	});
};

myChart.draw();
d3.selectAll('.dropdown-submenu.year > a').on("click", function(d) {
	year = this.text;
	chartsUpdate();
  colsUpdate();
});
// Create an init function 
// function init() {

// 	if (inputAnimal) {
		
// 	// Use D3 to select the dropdown menu 
// 	var dropdown1 = d3.select("#selDataset1");

// 	// Use D3 to read in the JSON data 
// 	d3.json("/api/v1.0/vbafauna").then((data) => {

// 		// Access the common name array
// 		var animalData = data.comm_name;

// 		// Create array to store distinct species name 
// 		var speciesName = animalData.map(row => row.comm_name);
// 		//console.log(speciesName);

// 		// // Create array to store distinct species names 
// 		// var uniqueAnimals = d3.map(metaData, function(d) {
// 		// 	return d._id;
// 		// }).keys()
// 		// console.log(uniqueAnimals);

// 		speciesName.forEach(function (name) {
// 			dropDown.append("option").text(name).property("value")
// 		});

// 		var animalChosen = dropDown.node().value;
// 		//console.log(animalChosen);

// 		optionChanged(animalChosen);

// 	});
// }

// function optionChanged(newAnimal) {
// 	optionChanged(newAnimal);
// }

// init1();