// date format
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


// Attibution: SODA API requests based on this example: https://github.com/chriswhong/soda-leaflet
// DEFINE A CUSTOM CLASS (PROTOTYPE) BASED ON SODA LEAFLET OBJECT
L.TimeDimension.Layer.SODAHeatMap = L.TimeDimension.Layer.extend({

	initialize: function(options) {
			var heatmapCfg = this._getHeatmapOptions(options.heatmatOptions || {});
			var layer = new HeatmapOverlay(heatmapCfg);
			L.TimeDimension.Layer.prototype.initialize.call(this, layer, options);
			this._currentLoadedTime = 0;
			this._currentTimeData = {
					max: this.options.heatmapMax || 10,
					data: []
			};
			// ASSIGN PASSED BASE URL
			this._baseURL = this.options.baseURL || null;
			this._period = this.options.period || "P1M";
	},

	// PRIVATE (CALLED INSIDE THIS OBJECT
	_getHeatmapOptions: function(options) {
			var config = {};
			var defaultConfig = {
					radius: 15,
					maxOpacity: .8,
					scaleRadius: false,
					useLocalExtrema: false,
					latField: 'lat',
					lngField: 'lng',
					valueField: 'count'
			};
			for (var attrname in defaultConfig) {
					config[attrname] = defaultConfig[attrname]; 
			}
			for (var attrname in options) {
					config[attrname] = options[attrname]; 
			}
			return config;
	},

	// EVENT HANDLER, WHEN I CALL ADD LAYER, THEN CALL THIS FUNCTION
	onAdd: function(map) {
			L.TimeDimension.Layer.prototype.onAdd.call(this, map);
			map.addLayer(this._baseLayer);
			if (this._timeDimension) {
					this._getDataForTime(this._timeDimension.getCurrentTime());
			}
	},

	_onNewTimeLoading: function(ev) {
			this._getDataForTime(ev.time);
			return;
	},

	isReady: function(time) {
			return (this._currentLoadedTime == time);
	},

	_update: function() {
			this._baseLayer.setData(this._currentTimeData);
			return true;
	},

	_getDataForTime: function(time) {
			if (!this._baseURL || !this._map) {
					return;
			}
			var url = this._baseURL;
			//var url = this._constructQuery(time);
			var oReq = new XMLHttpRequest();
			oReq.addEventListener("load", (function(xhr) {
					var response = xhr.currentTarget.response;
					var data = JSON.parse(response);
					// FIX HERE work on JSON
					delete this._currentTimeData.data;
					this._currentTimeData.data = [];
					for (var i = 0; i < data.length; i++) {
							var marker = data[i];
							if (marker.location) {
									this._currentTimeData.data.push({
											lat: marker.lat,
											lng: marker.long,
											count: 1
									});
							}
					}
					this._currentLoadedTime = time;
					if (this._timeDimension && time == this._timeDimension.getCurrentTime() && !this._timeDimension.isLoading()) {
							this._update();
					}
					this.fire('timeload', {
							time: time
					});
			}).bind(this));

			oReq.open("GET", url);
			oReq.send();

	},

	// FIX HERE
	_constructQuery: function(time) {
			var bbox = this._map.getBounds();
			var sodaQueryBox = [bbox._northEast.lat, bbox._southWest.lng, bbox._southWest.lat, bbox._northEast.lng];

			var startDate = new Date(time);
			var endDate = new Date(startDate.getTime());
			L.TimeDimension.Util.addTimeDuration(endDate, this._period, false);

			var where = "&$where=created_date > '" +
					startDate.format('yyyy-mm-dd') +
					"' AND created_date < '" +
					endDate.format('yyyy-mm-dd') +
					"' AND within_box(location," +
					sodaQueryBox +
					")&$order=created_date desc";

			var url = this._baseURL + where;
			return url;
	}

});


// CREATE A FUNCTION THAT RETURNS AN OBJECT FROM CLASS ABOVE with Options = Parameters
L.timeDimension.layer.sodaHeatMap = function(options) {
	return new L.TimeDimension.Layer.SODAHeatMap(options);
};


// // GET CURRENT TIMES FOR THE MAP
// var currentTime = new Date();
// currentTime.setUTCDate(1, 0, 0, 0, 0);

// CANVAS
var map = L.map('map', {
	zoom: 8,
	fullscreenControl: true,
	timeDimension: true,
	timeDimensionOptions: {
			timeInterval: "2015-01-01/2020-03-30",
			period: "P1D"
			// currentTime: currentTime
	},
	center: [-37.5, 145]
});

// ADD LAYER TO THE MAP
var layer = new L.StamenTileLayer("toner-lite");
map.addLayer(layer);

// INVOKE THE FUNCTION ABOVE, PASS
// 1. baseURL of data
// TODO: PASS OUR API LINK HERE TO GET DATA FROM FLASK
var testSODALayer = L.timeDimension.layer.sodaHeatMap({
	baseURL: '/api/v1.0/vbafauna',
});

// ADD DATA LAYER TO THE MAP
// map addLayer(testSODALayer)
//	trigger event: onAdd
testSODALayer.addTo(map);

// CONTROL MAP
// map.attributionControl.addAttribution('<a href="https://nycopendata.socrata.com/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9">NYC OpenData</a>');

// TIME MENU TOOLS
L.Control.TimeDimensionCustom = L.Control.TimeDimension.extend({
	_getDisplayDateFormat: function(date){
			return date.format("mmmm yyyy");
	}
});
var timeDimensionControl = new L.Control.TimeDimensionCustom({
	playerOptions: {
			buffer: 1,
			minBufferReady: -1
	}
});

map.addControl(this.timeDimensionControl);