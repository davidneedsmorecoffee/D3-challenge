// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var margin = {
  top: 30,
  right: 40,
  bottom: 100,
  left: 100
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(healthData) {
    console.log(healthData)
    
    // parse data + convert data to numbers
    healthData.forEach(function(i) {  
        i.poverty = +i.poverty;
        i.healthcare = +i.healthcare;
    });
  
    // Create x scale function 
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.poverty) * 0.8, 
            d3.max(healthData, d => d.poverty) * 1.11])
        .range([0, width]);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)*1.1])
        .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    chartGroup.append("g")
        .style("font-size", "15px")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
    // append y axis
    chartGroup.append("g")
        .style("font-size", "15px")
        .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "blue")
        .attr("opacity", ".20");

    // append labels in circles
    var circleText = chartGroup.selectAll("text_circles")
        .data(healthData)
        .enter()
        .append("text")
        .attr("class", "text_circles")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",5)
        .attr("text-anchor","middle")
        .attr("font-size","12px")
        .attr("opacity", ".7");

=    // Create axes labels
    // http://www.d3noob.org/2012/12/adding-axis-labels-to-d3js-graph.html

    // y-axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
      
    // x-axis
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
    
    }).catch(function(error) {
        console.log(error);
});