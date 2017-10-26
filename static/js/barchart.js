/*
1. http://blog.infographics.tw/2016/02/data-restructure-with-d3js/
2. https://github.com/d3/d3-scale#scaleBand
3. http://www.oxxostudio.tw/articles/201411/svg-d3-04-axis.html
4. https://bl.ocks.org/biovisualize/9c0d30d0539914ecdb15
*/
// Must be unique
var unique_q_yr = ["1-1", "1-2", "1-3", "1-4",
                         "2-1", "2-2", "2-3", "2-4",
                         "3-1", "3-2", "3-3", "3-4",
                         "4-1", "4-2", "4-3"];
var data_arr = [1, 3.12, 4.65, 6.17,
                 1.34, 3.19, 5.38, 8.63,
                 2.53, 5.48, 9.07, 12.57,
                 3.28, 7.06, 10.56];

if (typeof(json_dataArray) !== 'undefined') {
    console.log("json_dataArray Exists")
    // Use front-end environment to preprocess data array
    var main_keys = Object.keys(json_dataArray[0]);
    var eps_yr = [];
    var acc_eps_arr = [];
    var q_arr = [];
    for (var idx = 0; idx < json_dataArray.length; idx++) {
        for (key in json_dataArray[idx]) {
            if (key === 'eps') {
                for (q_key in json_dataArray[idx][key]) {
                    q_arr.push(idx + q_key);
                    var tmp = parseFloat(json_dataArray[idx][key][q_key]);
                    if (isNaN(tmp)) {
                        acc_eps_arr.push(0);
                    } else {
                        acc_eps_arr.push(tmp);
                    }
                }
            } else if (key === 'year') {
                eps_yr.push(parseInt(json_dataArray[idx][key]));
            }
        }
    }
    data_arr = acc_eps_arr;
    unique_q_yr = q_arr;
} else {
    console.log("json_dataArray DO NOT Exist")
}

var num_data = data_arr.length,
    data_scale = 10,
    data_x_shift = 10,
    bar_width = 10,
    bar_spacing = 20;

var max_data = d3.max(data_arr);
var margin = {top: 20, right: 20, bottom: 40, left: 40};

// Define svg element with atributes
var svg = d3.select("body").append("svg")
            .attr("height", (data_scale * max_data + margin.top + margin.bottom))
            .attr("width", data_x_shift + bar_spacing * num_data + margin.left + margin.right);

// Define the margin object with properties for the four sides (clockwise from the top, as in css)
var graph_width = +svg.attr("width") - margin.left - margin.right,
    graph_height = +svg.attr("height") - margin.top - margin.bottom;

// Define a g element in svg that translates the orgin to the top-left corner of the graph area
var graph = svg.append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

graph.selectAll("rect")
        .data(data_arr)
        .enter().append("rect")
        // Named it as "bar" to be controled by CSS
        .attr("class", "bar")
        .attr("height", function(d, i) {return (d * data_scale)})
        .attr("width", bar_width)
        .attr("x", function(d, i) {return (i * bar_spacing) + data_x_shift;})
        .attr("y", function(d, i) {return graph_height - (d * data_scale);});
        // Decide by you to style shapes in css or js
        //.attr("stroke", "black");


// Add the x Axis
/*
var x_extent = d3.extent(data_arr, function(i) {return (i)});
var x_scale = d3.scaleLinear()
                .domain(x_extent)
                .range([0, graph_width + margin.right]);
*/
var x_scale = d3.scaleBand()
            .domain(unique_q_yr)
            .rangeRound([0, graph_width]);
            //.paddingInner([0.1]);
var quarter_x_axis = d3.axisBottom(x_scale)
            .tickValues(unique_q_yr)
            .tickFormat(function(d) {return "Q" + d.slice(-1);});
var x_axis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + ", " + (svg.attr("height") - margin.bottom) + ")")
                .call(quarter_x_axis);
// Add the y Axis
var y_extent = d3.extent(data_arr, function(d) {return (d);});
var y_scale = d3.scaleLinear()
                .domain(y_extent)
                .range([graph_height, 0]);
var eps_y_axis = d3.axisLeft(y_scale);
var y_axis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(eps_y_axis);

// Add the y Axis grid
var eps_y_grid = eps_y_axis
                        .tickFormat("")
                        .tickSize(-graph_width, 0);
var y_axis_grid = svg.append("g")
                .attr("class", "y axis grid")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .style("fill", "none")
                .style("stroke", "lightgrey")
                .call(eps_y_grid);

y_axis.append("text")
        //.attr("class", "y_axis_name")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (graph_height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("EPS");

