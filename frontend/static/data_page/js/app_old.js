// from data.js
var tableData = data;

// LEVEL 2: MULTIPLE SEARCH CATEGORIES

// Get a reference to the table body
var tbody = d3.select("tbody");

// Loop through each ufo object in the data array
tableData.forEach((ufo) => {

	// Use d3 to append one table row `tr` for each ufo object
	var row = tbody.append("tr");

	// Use `Object.entries` and forEach to iterate through keys and values
	Object.entries(ufo).forEach(([key, value]) => {

		// Use d3 to append one cell per ufo object value (date, city, state, country, shape, duration, and comments)  
		var cell = row.append("td");
		cell.text(value);
	});
});

// Create arrays to store distinct countries, states, and shapes
var uniqueCountry = [... new Set(tableData.map(ufo => ufo.country))];
console.log(uniqueCountry);

var uniqueState = [... new Set(tableData.map(ufo => ufo.state))];
console.log(uniqueState);

var uniqueShape = [... new Set(tableData.map(ufo => ufo.shape))];
console.log(uniqueShape);

// Dynamically add unique countries, states and shapes to dropdown menus
uniqueCountry.forEach((country) => {
	d3.select("#country").append("option").text(country)
});

uniqueState.forEach((state) => {
	d3.select("#state").append("option").text(state)
});

uniqueShape.forEach((shape) => {
	d3.select("#shape").append("option").text(shape)
});

// Select the button
var button = d3.select("#filter-btn");

// Select the form
var form = d3.select("form");

// Create event handlers 
button.on("click", runEnter);
form.on("submit", runEnter);

// Complete the event handler function for the form
function runEnter() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

	// Select the input elements and get the values of the input elements
	var countryInputValue = d3.select("#country").property("value");
	var stateInputValue = d3.select("#state").property("value");
	var shapeInputValue = d3.select("#shape").property("value");
	var cityInputValue = d3.select("#city").property("value");
	var dateInputValue = d3.select("#datetime").property("value");

	// Create filter object
	var multifilters = {
		country: countryInputValue,
		state: stateInputValue,
		shape: shapeInputValue,
		city: cityInputValue,
		datetime: dateInputValue
	};

	// Use the form's inputs and dropdown selections to filter the data by multiple attributes

	var results = tableData.filter(function(ufo) {
		for (var key in multifilters) {
			if (multifilters[key] === undefined || ufo[key] != multifilters[key])
				return false;
		}
		return true;
	});
	
	// Clear out current contents in the table
	tbody.html("");

	// Handle no matching results
	if (results.length === 0) {
		tbody.text(`No ufo sightings found.`);
	}
	else {
		results.forEach((ufo) => {
			var row = tbody.append("tr");
			Object.entries(ufo).forEach(([key, value]) => {
				var cell = row.append("td");
				cell.text(value);
			});
		});
	};
};