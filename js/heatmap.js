
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HEAT_RANGE = [0, 2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6];

const MARGIN = {top: 20, right: 30, bottom: 30, left: 40}
const CHART_WIDTH = 1270 - MARGIN.left - MARGIN.right;
const CHART_HEIGHT = 650 - MARGIN.top - MARGIN.bottom;

let x = d3.scaleLinear().range([0, CHART_WIDTH]);
let y = d3.scaleLinear().domain([12,0]).range([CHART_HEIGHT, 0]);

let chart = d3.select("#chart")
              .attr("width", CHART_WIDTH + MARGIN.left + MARGIN.right)
              .attr("height", CHART_HEIGHT + MARGIN.top + MARGIN.bottom)
              .append("g")
              .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);


/* 
  Renders the x-axis of the graph with label.
*/
const buildXAxis = (x, minYear, maxYear) => {

  chart.append("g")
       .attr("transform", `translate(0,${CHART_HEIGHT})`)
       .call(d3.axisBottom(x)
               .tickArguments([(maxYear - minYear)/10, "d"]));

  chart.append("text")
       .attr("transform", "translate(" + (CHART_WIDTH/2) + "," + (CHART_HEIGHT+50) + ")")
       .attr("transform", `translate(${CHART_WIDTH/2},${CHART_HEIGHT+50})`)
       .attr("class", "axis-label")
       .text("Years");
}


/*
  Renders the y-axis of the graph with label.
*/
const buildYAxis = (y) => {

  chart.append("g")
       .attr("transform", "translate(0,0)")
       .call(d3.axisLeft(y)
               .ticks(16)
               .tickSize(16,0)
               .tickFormat(d => MONTH_NAMES[d]));

  chart.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -125)
       .attr("x", CHART_HEIGHT/-2+50)
       .attr("class", "axis-label")
       .attr("dy", "2em")
       .text("Months");
}


/*
  Renders the legend for the map.
*/
const buildLegend = () => {

  const LEGEND_ELEM_HEIGHT = 20;
  const LEGEND_ELEM_WIDTH = 55;
  const LEGEND_ELEM_TEXT_MARGIN_TOP = 35;
  const LEGEND_ELEM_TEXT_MARGIN_LEFT = 5;

  let legend = chart.append("g")
                    .attr("transform", "translate(650,75)")
                    .selectAll(".legend")
                    .data(HEAT_RANGE).enter();

  legend.append("rect")
        .attr("x", (d, i) => LEGEND_ELEM_WIDTH*i)
        .attr("y", CHART_HEIGHT)
        .attr("width", LEGEND_ELEM_WIDTH)
        .attr("height", LEGEND_ELEM_HEIGHT)
        .attr("class", d => getGridColor(d));

  legend.append("text")
        .text(d => ">= " + d)
        .attr("class", "legend-text")
        .attr("x", (d, i) => (LEGEND_ELEM_WIDTH * i) + LEGEND_ELEM_TEXT_MARGIN_LEFT)
        .attr("y", CHART_HEIGHT + LEGEND_ELEM_TEXT_MARGIN_TOP);
}


/*
  Returns the CSS class used to fill out a cell on the heatmap. CSS class depends on temp variable passed.
*/
const getGridColor = (temp) => {

  if (temp <= 0)          { return "gradient11"; }
  else if (temp <= 2.7)   { return "gradient10"; }
  else if (temp <= 3.9)   { return "gradient9"; }
  else if (temp <= 5)     { return "gradient8"; }
  else if (temp <= 6.1)   { return "gradient7"; }
  else if (temp <= 7.2)   { return "gradient6"; }
  else if (temp <= 8.3)   { return "gradient5"; }
  else if (temp <= 9.4)   { return "gradient4"; }
  else if (temp <= 10.5)  { return "gradient3"; }
  else if (temp <= 11.6)  { return "gradient2"; }
  else                    { return "gradient1"; }
}


d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(error, heatData) {
  if (error) throw error;

  var minYear = d3.min(heatData.monthlyVariance, d => d.year);
  var maxYear = d3.max(heatData.monthlyVariance, d => d.year);
  x.domain([minYear, maxYear+1]);

  var baseTemp = heatData.baseTemperature;
  var numYears = Math.ceil(heatData.monthlyVariance.length/12);
  var cellWidth = (CHART_WIDTH)/numYears;
  var cellHeight = (CHART_HEIGHT)/12;

  var cards = chart.selectAll("g")
                   .data(heatData.monthlyVariance)
                   .enter().append("rect")
                   .attr("title", d => `${d.year} ${d.month}`)
                   .attr("x", d => x(d.year))
                   .attr("y", d => y(d.month-1))
                   .attr("height", cellHeight)
                   .attr("class", d => getGridColor(baseTemp + d.variance))
                   .attr("width", cellWidth)
                   .on("mouseover", function() {
                      let cellData = d3.select(this).datum();
                      d3.select(this).attr('class', 'highlight');

                      let xPos = parseFloat(d3.select(this).attr("x"));
                      let yPos = parseFloat(d3.select(this).attr("y"));
                      let width = parseFloat(d3.select(this).attr("width"));
                      let height = parseFloat(d3.select(this).attr("height"));

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
                             `<tspan x=${xPos-80} y=${yPos-30} class="tooltip-date"> ${cellData.year} - ${MONTH_NAMES[cellData.month-1]}</tspan>`
                             + `<tspan x=${xPos-80} y=${yPos-5} class="tooltip-temperature">` 
                             + (baseTemp + cellData.variance).toFixed(3) + "&deg;C&nbsp;&nbsp;( "
                             + cellData.variance.toFixed(3)
                             + " )</tspan>")
                           .attr('x', xPos - 85)
                           .attr('y', yPos - 30)
                           .style({
                             fill: "#fff",
                             'font-size': '1.2em',
                             'font-weight': 'bold'
                           });
                       })
                       .on('mouseout', function(d) {
                         chart.selectAll('.tip').remove();
                         d3.select(this).attr('class', (d) => getGridColor(baseTemp + d.variance));
                       });

  buildXAxis(x, minYear, maxYear);
  buildYAxis(y);
  buildLegend();

});
