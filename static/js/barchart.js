/*
1. http://blog.infographics.tw/2016/02/data-restructure-with-d3js/
2. Band Illustration: https://github.com/d3/d3-scale#scaleBand
3. http://www.oxxostudio.tw/articles/201411/svg-d3-04-axis.html
4. Band Sclae: https://bl.ocks.org/biovisualize/9c0d30d0539914ecdb15
5. Grouped Bar Chart: https://bl.ocks.org/TheBiro/4559617c0ff283e786aea95b194d1fd2
6. Tooltips on the bar: http://bl.ocks.org/Caged/6476579
7. v4 tip: http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
8. https://github.com/Caged/d3-tip
*/
// Must be unique
var unique_q_yr = ["1-1", "1-2", "1-3", "1-4",
                         "2-1", "2-2", "2-3", "2-4",
                         "3-1", "3-2", "3-3", "3-4",
                         "4-1", "4-2", "4-3"];
var all_yrs = [2013, 2014, 2015, 2016, 2017];
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
    all_yrs = eps_yr;
    all_yrs.push(d3.max(eps_yr) + 1);
    console.log(all_yrs);
} else {
    console.log("json_dataArray DO NOT Exist")
}

var num_data = data_arr.length,
    data_scale = 10,
    data_x_shift = 10,
    bar_width = 10,
    bar_spacing = 20,
    scale_factor = 5; // Fix y scale of data_arr that EPS < 5

var max_data = d3.max(data_arr);
var margin = {top: 20, right: 20, bottom: 60, left: 40};

// Define svg element with atributes
var svg = d3.select("body")
            .append("svg")
                .attr("height", (data_scale * ((max_data > scale_factor) ? max_data : scale_factor * max_data) + margin.top + margin.bottom))
                .attr("width", data_x_shift + bar_spacing * num_data + margin.left + margin.right);

// Define the margin object with properties for the four sides (clockwise from the top, as in css)
var graph_width = +svg.attr("width") - margin.left - margin.right,
    graph_height = +svg.attr("height") - margin.top - margin.bottom;

/* [Tips]:
 * 1. Draw the axes ealier than main chart to make layers in an order
 * 2. Draw y axis and grid of y axis first in order not to overlap
 *    the base (i.e., path class) of x axis
 */

/*
 * Add the y axis
 */
var y_extent = d3.extent(data_arr);
var y_scale = d3.scaleLinear()
                .domain(y_extent)
                .range([graph_height, 0]);
var func_y_axis = d3.axisLeft(y_scale);
var y_axis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(func_y_axis);

/*
 * Add the y axis grid
 */
var func_y_grid = func_y_axis.tickFormat("")
                            .tickSize(-graph_width, 0);

var y_axis_grid = svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .style("fill", "none")
                .call(func_y_grid);

/*
 * Style the y axis grid in grey
 */
y_axis_grid.selectAll(".tick line")
            .style("stroke", "lightgrey")
            .style("opacity", "0.5");
            //.style("stroke-dasharray", "10,1");

/*
 * Turn off the base of y axis grid
 */
y_axis_grid.select("path")
            .style("opacity", "0");

y_axis.append("text")
        //.attr("class", "y_axis_name")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (graph_height/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("stroke", "black")
        .text("EPS");

/*
 * Add the quarter x axis
 */
var x_scale_q = d3.scaleBand()
                .domain(unique_q_yr)
                .rangeRound([0, graph_width]);
                //.paddingInner([0.1]);
var func_x_axis_q = d3.axisBottom(x_scale_q)
                    .tickValues(unique_q_yr)
                    .tickFormat(function(d) {return "Q" + d.slice(-1);});
var x_axis_q = svg.append("g")
                    .attr("class", "x axis q")
                    .attr("transform", "translate(" + margin.left + ", " + (svg.attr("height") - margin.bottom) + ")")
                    .call(func_x_axis_q);

/*
 * Add the year x axis
 */
var x_extent_yr = d3.extent(all_yrs);
var x_scale_yr = d3.scaleTime()
                    .domain(x_extent_yr)
                    .rangeRound([0, graph_width]);
var func_x_axis_yr = d3.axisBottom(x_scale_yr)
                        // Turn off visibility of ticks
                        .tickSize(0)
                        .tickValues(all_yrs)
                        .tickPadding(margin.bottom/3)
                        .tickFormat(function(d) {return (d)});
var x_axis_yr = svg.append("g")
                    .attr("class", "x axis yr")
                    .attr("transform", "translate(" + margin.left + ", " + (svg.attr("height") - margin.bottom) + ")")
                    .call(func_x_axis_yr);

/*
 * Turn of the base of year x axis
 */
x_axis_yr.select("path")
            .style("opacity", "0");

x_axis_q.append("text")
        //.attr("class", "y_axis_name")
        .attr("y", margin.bottom/2)
        .attr("x", graph_width/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("stroke", "black")
        .text("QUARTERS OVER YEAR");

/*
 * Define a g element in svg as the main graph that translates
 * the orgin to the top-left corner of the graph area
 */
var graph = svg.append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) { return d; });
graph.call(tip);

graph.selectAll("rect")
        .data(data_arr)
        .enter().append("rect")
        // Named it as "bar" to be controled by CSS
        .attr("class", "bar")
        .attr("height", function(d, i) {return (d * data_scale)})
        .attr("width", bar_width)
        .attr("x", function(d, i) {return (i * bar_spacing) + data_x_shift;})
        .attr("y", function(d, i) {return graph_height - (d * data_scale);})
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
