
var dataArray = [1, 3.12, 4.65, 6.17, 1.34, 3.19, 5.38, 8.63, 2.53, 5.48, 9.07, 12.57, 3.28, 7.06, 10.56, 14.01, 2.43, 6.17];

var data_scale = 10,
    bar_width = 10,
    bar_x_padding = 10,
    bar_spacing = 20;

var max_data = d3.max(dataArray);
var margin = {top: 20, right: 20, bottom: 40, left: 40};

// Define svg element with atributes
var svg = d3.select("body").append("svg")
            .attr("height", (data_scale * max_data + margin.top + margin.bottom))
            .attr("width", "400");
            //.style("background-color", "yellow"); // <TODO>: Remove HL

// Define the margin object with properties for the four sides (clockwise from the top, as in css)
var graph_width = +svg.attr("width") - margin.left - margin.right,
    graph_height = +svg.attr("height") - margin.top - margin.bottom;

// Define a g element in svg that translates the orgin to the top-left corner of the graph area
var graph = svg.append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

graph.selectAll("rect")
        .data(dataArray)
        .enter().append("rect")
        // Name it as "bar" to be reference used by CSS
        .attr("class", "bar")
        .attr("height", function(d, i) {return (d * data_scale)})
        .attr("width", bar_width)
        .attr("x", function(d, i) {return (i * bar_spacing) + bar_x_padding})
        .attr("y", function(d, i) {return graph_height - (d * data_scale)}) //<TODO> fix 130
        // Decide by you to style shapes in css or js
        .attr("stroke", "black");


// Add the x Axis
var x_extent = d3.extent(dataArray, function(i) {return (i)});
var x_scale = d3.scaleLinear()
                .domain(x_extent)
                .range([0, graph_width]);
var quarter_x_axis = d3.axisBottom(x_scale)
                        .ticks(); //<TODO> fix ticks
var x_axis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + ", " + (svg.attr("height") - margin.bottom) + ")")
                .call(quarter_x_axis);
// Add the y Axis
var y_extent = d3.extent(dataArray, function(d) {return (d)});
var y_scale = d3.scaleLinear()
                .domain(y_extent)
                .range([graph_height, 0]);
var eps_y_axis = d3.axisLeft(y_scale);
var y_axis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(eps_y_axis);

y_axis.append("text")
        //.attr("class", "y_axis_name")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (graph_height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("EPS");
