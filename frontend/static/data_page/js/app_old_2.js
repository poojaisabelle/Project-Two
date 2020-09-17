// get data from data.js
var tableData = data;

// populate filter dropdown
filterKeys=["datetime","city","state","country","shape"];
for (var i of filterKeys) {
    eval("var filterKey=tableData.map(thisdata => thisdata."+i+")");
    valueUnique=[];
    filterKey.forEach((value) => {
        if (i==="country"||i==="state") {
            value=value.toUpperCase();
        }
        if (!(valueUnique.includes(value))) {
            valueUnique.push(value);
        }
    });
    // sort alphabetically before adding to filter dropdown
    if (!(i==="datetime")) {valueUnique=valueUnique.sort()}; 
    for (value of valueUnique) {
        eval(`d3.select("#`+i+`").append("option").text(value);`);
    }
};

// select filter button and form
var button = d3.select("#filter-btn");
var form = d3.select("#form");

// Create event handlers 
button.on("click",runEnter);
form.on("submit",runEnter);

// filter function
function runEnter() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // get filter values
    var inputData=[];
    inputData[0] = d3.select("#datetime").property("value");
    inputData[1] = d3.select("#city").property("value");
    inputData[2] = d3.select("#state").property("value").toLowerCase();
    inputData[3] = d3.select("#country").property("value").toLowerCase();
    inputData[4] = d3.select("#shape").property("value");
    // apply filter
    var filterData=tableData;
    for (i in inputData) {
        if (inputData[i] !="") {
            eval(`filterData = filterData.filter(data => data.`+filterKeys[i]+`==="`+inputData[i]+`");`)           
        }
    }
    // display number of sightings
    var searchLen=d3.select(".search-result");
    if (filterData.length===1) {
        searchLen.html(`<h3>${filterData.length} result found</h3>`);
    }
    else {
        searchLen.html(`<h3>${filterData.length} results found</h3>`);
    }
    // clear table rows
    d3.select("tbody").html("");
    // add sightings to table
    filterData.forEach((sighting) => {
        var row=d3.select("tbody").append("tr");
        Object.entries(sighting).forEach(([key,value]) => {
            // replace html characters
            value=value.toString().replace(/\&#44/g,",");
            value=value.toString().replace(/\&#39/g,"'");
            value=value.toString().replace(/\&#33/g,"!");
            if (key==="country"||key==="state") {
                value=value.toUpperCase();
            }
            row.append("td").text(value);
        });
    });
};