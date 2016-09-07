$(document).ready(function() {

	function buildXAxis(x) {
		chart.append("g")
				 .attr("transform", "translate(0," + chartHeight + ")")
				 .call(d3.axisBottom(x));

		//Add text label for x-axis
		chart.append("text")
				 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight+50) + ")")
				 .attr("class", "axisLabel")
				 .text("Years");
	}

	function buildYAxis(y) {
		chart.append("g")
				 .attr("transform", "translate(0,0)")
				 .call(d3.axisLeft(y)
				 				 .ticks(d3.timeMonth)
								 .tickSize(16,0)
								 .tickFormat(d3.timeFormat("%B")));

		//Add Text label for the y-axis
		chart.append("text")
				 .attr("transform", "rotate(-90)")
				 .attr("y", -75)
				 .attr("x", -50)
				 .attr("class", "axisLabel")
				 .attr("dy", "2em")
				 .text("Months");
	}

	var chartWidth = 1000;
	var chartHeight = 500;
	var chart = d3.select('.chart').attr("width", chartWidth).attr("height", chartHeight).append("g").attr("transform", "translate(" + 0 + "," + 0 + ")");

	var x = d3.scaleLinear().range([0, chartWidth]);
	var y = d3.scaleTime().domain([new Date(2016,0,1), new Date(2016,11,31)]).range([chartHeight, 0]);
	buildYAxis(y);

	d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(error, heatData) {
		if (error) throw error;

		x.domain(d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );
		console.log(d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );
		buildXAxis(x);
		
		var baseTemp = heatData.baseTemperature;
		//for (var i = 0; i < heatData.monthlyVariance.length; i++) {
		for (var i = 0; i < 10; i++) {
			console.log(heatData.monthlyVariance[i]);
		}
	});


});
