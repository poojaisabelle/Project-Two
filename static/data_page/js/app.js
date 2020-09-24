// Call the table api

d3.json("/api/v1.0/table").then(function(importedData) {
	var tableData = importedData;

	// Get a reference to the table body
	var tbody = d3.select("tbody");

	// Add the whole table of animal sightings data when loading the page
	tableData.forEach((record) => {
		var row = tbody.append("tr");
		Object.entries(record).forEach(([key, value]) => {
			var cell = row.append("td");
			cell.text(value);
		})
	})

	// Create arrays to store distinct animals and taxon types in abc order
	var uniqueAnimal = [... new Set(tableData.map(record => record.comm_name))].sort();

	var uniqueType = [... new Set(tableData.map(record => record.taxon_type))].sort();

	// Dynamically add unique animal and taxon types to corresponding dropdown menus
	uniqueAnimal.forEach((animal) => {
		d3.select("#comm_name").append("option").text(animal);
	})

	uniqueType.forEach((type) => {
		d3.select("#taxon_type").append("option").text(type);
	})

	// Select and Create event handlers for the form's inputs and dropdown selections
	d3.selectAll(".form-control").on("change", updateFilters);

	// Select and Create event handlers for the button Clear Filter
	d3.select("#filter-btn").on("click", clear);

	// Create filter object to keep track of all filters
	var multifilters = {};

	// Create a function to dynamically add a filter value each time user add any filter
	function updateFilters() {

		// Save the element, value, and id of the filter that was changed
		// In an event, "this" refers to the html element that received the event.
		var inputElement = d3.select(this);
		var filterId = inputElement.attr("id");
		var inputValue = inputElement.property("value");

		// If a filter value was entered then add that filterId and value
		// to the filters array. Otherwise, clear that filter from the filters object.
		if (inputValue) {
		  multifilters[filterId] = inputValue;
		 }
		else {
		   delete multifilters[filterId];
		}

		// Call function to apply all filters and rebuild the table
		filterTable();
	}

	function filterTable() {

		// Prevent the page from refreshing
		d3.event.preventDefault();

		// Use the form's inputs and dropdown selections to filter the data by multiple attributes
		var results = tableData.filter(function(record) {
			for (var key in multifilters) {
				if (multifilters[key] === undefined || record[key] != multifilters[key])
					return false;
			}
			return true;
		})
		
		// Clear out current contents in the table
		tbody.html("");

		// Handle no matching results
		if (results.length === 0) {
			tbody.text(`No animal sightings found.`);
		}
		else {
			results.forEach((record) => {
				var row = tbody.append("tr");
				Object.entries(record).forEach(([key, value]) => {
					var cell = row.append("td");
					cell.text(value);
				})
			})
		}
	}

	function clear() {
		multifilters = {};
		document.getElementById("filter-form").reset();
		filterTable();
	}
});