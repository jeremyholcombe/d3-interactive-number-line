function log(text) {
  if (console && console.log) console.log(text);
  return text;
}

var t = d3.transition()
    .duration(200);

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    lineDistance = 50;

// add scales
var x = d3.scaleLinear().rangeRound([0, width]);

// add chart
var chart = svg.append("g")
    .attr("transform", "translate("+margin.left+","+margin.top+")");

// DATA-DRIVEN CODE ------------------------
d3.csv("number_line.csv", function(d) {
  d.vehicle_age = +d.vehicle_age; // coerce to number
  return d;
}, function(error, data) {
  if (error) throw error;

  // set domains
  x.domain(d3.extent(data, function(d) { return d.vehicle_age; }));

  // add line/label to mark date selected by user
  chart.append("line")
      .attr("class", "number-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height - lineDistance)
      .attr("y2", height - lineDistance);

  // x-axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  chart.append("text") // label
      .attr("class", "axis-label")
      .attr("x", width/2)
      .attr("y", height)
      .attr("dy", 30)
      .attr("text-anchor", "middle")
      .text("Days from Today");

  // create group to hold all lines
  var lineGroup = chart.append("g")
      .attr("id", "lineGroup")
      .attr("transform", "translate(0,"+(height-lineDistance)+")");

  //
  lineGroup.selectAll(".line-marker")
      .data(data)
    .enter().append("rect")
    .attr("class", "line-marker")
    .attr("x", function(d) { return x(d.vehicle_age); })
    .attr("y", -10)
    .attr("width", 0.5)
    .attr("height", 20)
    .attr("stroke-width", "2px")
    .attr("fill", "white");

  // create tooltip
  var tooltip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return "<b>Trim: </b>" + d.vehicle_trim + "<br>" +
        "<b>Color: </b>" + d.vehicle_color + "<br>" +
        "<b>Entry Date: </b>" + d.entry_date + "<br>" +
        "<b>Days in Inventory: </b>" + d.vehicle_age;
      });

  chart.call(tooltip);

  // TOOLTIPS ----------------------
  d3.selectAll(".line-marker")
    .on("mouseover", function(d) {
      // show tooltip
      tooltip.show(d);
      // set border of tooltip to line color
      var lineColor = d3.select(this).attr("stroke");
      tooltip.style("border-color", lineColor);
      // increase stroke width for line
      d3.select(this)
          .attr("stroke-width", "3px");
      // purely so CSS triangle can inherit lineColor
      tooltip.style("border-top-color", lineColor);
    })
    .on("mouseout", function(d) {
      // hide tooltip
      tooltip.hide(d);
      // reset stroke width for circle
      d3.select(this)
          .attr("stroke-width", "2px");
    });

}); // END DATA-DRIVEN CODE
