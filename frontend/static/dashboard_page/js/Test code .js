// // TO TEST WHETHER DATA CAN BE READ IN
// // Use D3 fetch to read the JSON file
// // The data from the JSON file is arbitrarily named importedData as the argument
// function retrieveFaunaData(recordId) {
// 	d3.json("/api/v1.0/aggregation").then((importedData) => {
// 		console.log(importedData);
// 	});
// }
// retrieveFaunaData(978)




		// Identify the totalSightings 
		// var totalSightings = metaResult.totalSightings;
		//console.log(totalSightings);
	
		// Use nested function to aggregate number of sightings per unique species 
		// var totalSightings = d3.nest()
		// 	.key(function(d) { return d.comm_name; })
		// 	.rollup(function(v) { return d3.sum(v, function(d) { return d.totalcount; }); })
		// 	.entries(data);

		// // console.log(totalSightings)
		
		// var result = totalSightings[0];
		// // console.log(sightingsResult);

		// var totalSightingsResult = result.value;
		// console.log(totalSightingsResult);