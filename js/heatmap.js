$(document).ready(function() {

  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var margin = {top: 20, right: 30, bottom: 30, left: 40}
	var chartWidth = 1270 - margin.left - margin.right;
	var chartHeight = 650 - margin.top - margin.bottom;

	var x = d3.scaleLinear().range([0, chartWidth]);
	var y = d3.scaleLinear().domain([12,0]).range([chartHeight, 0]);

	var chart = d3.select('#chart')
								.attr("width", chartWidth+margin.left+margin.right)
								.attr("height", chartHeight+margin.top+margin.bottom)
								.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  /* 
		Renders the x-axis of the graph with label.
	*/
	function buildXAxis(x) {
		chart.append("g")
				 .attr("transform", "translate(0," + chartHeight + ")")
				 .call(d3.axisBottom(x));

		chart.append("text")
				 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight+50) + ")")
				 .attr("class", "axisLabel")
				 .text("Years");
	}


  /*
		Renders the y-axis of the graph with label.
	*/
	function buildYAxis(y) {
		chart.append("g")
				 .attr("transform", "translate(0,0)")
				 .call(d3.axisLeft(y)
				 				 .ticks(16)
								 .tickSize(16,0)
								 .tickFormat(function(d) {
									 return monthNames[d];
								 }));

		chart.append("text")
				 .attr("transform", "rotate(-90)")
				 .attr("y", -125)
				 .attr("x", chartHeight/-2+50)
				 .attr("class", "axisLabel")
				 .attr("dy", "2em")
				 .text("Months");
	}

	/* 
		Returns the CSS class used to fill out a cell on the heatmap. CSS class depends on temp variable passed.
	*/
	function getGridColor(temp) {

		if (temp <= 0) 					{ return "gradient11"; }
		else if (temp <= 2.7) 	{ return "gradient10"; }
		else if (temp <= 3.9) 	{ return "gradient9"; }
		else if (temp <= 5) 		{ return "gradient8"; }
		else if (temp <= 6.1) 	{ return "gradient7"; }
		else if (temp <= 7.2) 	{ return "gradient6"; }
		else if (temp <= 8.3) 	{ return "gradient5"; }
		else if (temp <= 9.4) 	{ return "gradient4"; }
		else if (temp <= 10.5) 	{ return "gradient3"; }
		else if (temp <= 11.6) 	{ return "gradient2"; }
		else 										{ return "gradient1"; }
	}

	d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(error, heatData) {
		if (error) throw error;

		x.domain(d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );
		//console.log("Range: " + d3.extent(heatData.monthlyVariance, function(d) { return d.year; }) );

		console.log("Number of cells: " + heatData.monthlyVariance.length);
		var baseTemp = heatData.baseTemperature;
		var numYears = Math.ceil(heatData.monthlyVariance.length/12);
		console.log("Years: " + numYears);
		var cellWidth = (chartWidth)/numYears;
		var cellHeight = (chartHeight)/12;
		console.log("chartWidth: " + (chartWidth));
		console.log("cell width: "+ cellWidth);
		console.log("chart height: " + (chartHeight));
		console.log("cell height: "+ cellHeight);
		
		var cards = chart.selectAll("g")
									 	 .data(heatData.monthlyVariance)
									 	 .enter().append("rect")
									 	 .attr("title", function(d) { return `${d.year} ${d.month}`; })
									 	 .attr("x", function(d) { return x(d.year); })
									 	 .attr("y", function(d) { return y(d.month-1); })
									 	 .attr("height", cellHeight)
									 	 .attr("class", function(d) { return getGridColor(baseTemp + d.variance); })
									 	 .attr("width", cellWidth)
									 	 .on("mouseover", function() {
												console.log(d3.select(this).datum());
												var cellData = d3.select(this).datum();
												d3.select(this).attr('class', 'highlight');

												var xPos = parseFloat(d3.select(this).attr("x"));
												var yPos = parseFloat(d3.select(this).attr("y"));
												var width = parseFloat(d3.select(this).attr("width"));
												var height = parseFloat(d3.select(this).attr("height"));
												console.log("x: " + xPos + " y: " + yPos + " width: " + width + " height: " + height);

												chart.append('rect')
													.attr('class', 'tip')
													.attr('x', xPos - 90)
													.attr('y', yPos - 60)
													.attr('rx', 3)
													.attr('ry', 3)
													.attr('width', 150)
													.attr('height', 75)
													.style({
														'fill': 'rgba(0,0,0,0.9)',
														'border': '2px solid #fff'
													});
												chart.append('text')
													.attr('class','tip')
													.html(
														"<tspan x=" + (xPos-80) + " y=" + (yPos-30) + " class=\"tooltipDate\">" + cellData.year + " - " + monthNames[cellData.month-1] + "</tspan>"
														+ "<tspan x=" + (xPos-80) + " y=" + (yPos-5) + " class=\"tooltipTemperature\">" 
															+ (baseTemp + cellData.variance).toFixed(3) + "&deg;C&nbsp;&nbsp;( " + 
															+ cellData.variance.toFixed(3)
														+ " )</tspan>")
													.attr('x', xPos - 85)
													.attr('y', yPos - 30)
													.style({
														fill: "#fff",
														'font-weight': 'bold',
														'font-size': '1.2em'
													});

									 	 })
										 .on('mouseout', function(d) {
											 chart.selectAll('.tip').remove();
										   d3.select(this).attr('class', function(d) { return getGridColor(baseTemp + d.variance); });
										 });

		buildXAxis(x);
		buildYAxis(y);

	});
});
