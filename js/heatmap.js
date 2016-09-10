$(document).ready(function() {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
				 .attr("y", -125)
				 .attr("x", -50)
				 .attr("class", "axisLabel")
				 .attr("dy", "2em")
				 .text("Months");
	}

	var chartWidth = 1000;
	var chartHeight = 500;
	var chart = d3.select('.chart').attr("width", chartWidth).attr("height", chartHeight).append("g").attr("transform", "translate(" + 50 + "," + 0 + ")");

	var colorCodes = ['#f00', '#00f'];

	var x = d3.scaleLinear().range([0, chartWidth]);
	//var y = d3.scaleTime().domain([new Date(2016,11,31), new Date(2016,0,1)]).range([chartHeight, 0]);
	var y = d3.scaleTime().domain([new Date(2016,11,31), new Date(2016,0,1)]).range([chartHeight, 0]);

	d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(error, heatData) {
		if (error) throw error;

		x.domain(d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );
		console.log(d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );

		console.log("Number of cells: " + heatData.monthlyVariance.length);
		var baseTemp = heatData.baseTemperature;
		var numYears = Math.floor(heatData.monthlyVariance.length/12);
		console.log("Years: " + numYears);
		var cellWidth = chartWidth/numYears;
		var cellHeight = chartHeight/12;
		console.log("chartWidth: " + chartWidth);
		console.log("cell width: "+ cellWidth);
		//for (var i = 0; i < heatData.monthlyVariance.length; i++) {
		for (var i = 0; i < 15; i++) {
			var year = heatData.monthlyVariance[i].year;
			var month = monthNames[heatData.monthlyVariance[i].month-1];
			var temp = baseTemp + heatData.monthlyVariance[i].variance
			console.log(month + " " + year + " " + temp);
		}

		var cards = chart.selectAll("g")
									 .data(heatData.monthlyVariance)
									 .enter().append("rect")
									 .attr("x", function(d) { return x(d.year); })
									 .attr("y", function(d) { var me = new Date('2016-' + (d.month) + '-01'); return y(me); })
									 .attr("height", cellHeight)
									 .attr("width", cellWidth)
									 .style("fill", 'red')
									 .on("mouseover", function() {
										 console.log(d3.select(this).datum());
									 });
		});
		buildXAxis(x);
		buildYAxis(y);


});
