/*
1. CSV, https://bl.ocks.org/mbostock/3886208
2. CSV, https://bl.ocks.org/DimsumPanda/689368252f55179e12185e13c5ed1fee
3. json, https://bl.ocks.org/caravinden/8979a6c1063a4022cbd738b4498a0ba6
4. slice(), https://www.w3schools.com/jsref/jsref_slice_array.asp
 */
//var json_dataArray = [{all: 10, self_np: 5}, {all: 15, self_np: 7}, {all: 14, self_np: 8}];
years = ["2013", "2014", "2015"];
json_dataArray = [
    {'year': '2013', 'all': 3095969, 'self_np': 371827},
    {'year': '2014', 'all': 5052080, 'self_np': 562161},
    {'year': '2015', 'all': 11056658, 'self_np': 865701},
];
var main_keys = Object.keys(json_dataArray[0]),
    sub_keys = Object.keys(json_dataArray[0][main_keys[1]]);

sub_keys = main_keys.slice(1,3);

var svg = d3.select("body").append("svg")
            .attr("height", "500")
            .attr("width", "960")
            .style("background-color", "white");

var margin = {top: 20, right: 20, bottom: 40, left: 40},
    graph_width = +svg.attr("width") - margin.left - margin.right,
    graph_height = +svg.attr("height") - margin.top - margin.bottom;

var graph = svg.append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var x_scale = d3.scaleBand()
            .domain(years)
            .rangeRound([0, graph_width]);
var func_x_axis = d3.axisBottom(x_scale)
                    .tickValues(years)
                    .tickFormat(function(d) {return (d)});

var y_scale = d3.scaleLinear()
            .rangeRound([graph_height, 0]);
var func_y_axis = d3.axisLeft(y_scale);

var color = d3.scaleOrdinal(d3.schemeCategory20);
        // .range(["#98abc5", "#8a89a6", "#7b6888"]);

var stack = d3.stack()
                .keys(sub_keys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

var layers = stack(json_dataArray);
y_scale.domain([0, d3.max(layers[layers.length - 1], function(d) {return d[0] + d[1];})]).nice();

var layer = svg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function(d, i) { return color(i); });

          layer.selectAll("rect")
              .data(function(d) { return d; })
            .enter().append("rect")
              .attr("x", function(d) { return x_scale(d.year); })
              .attr("y", function(d) { return y_scale(d[1]); })
              .attr("height", function(d) { return y_scale(d[0]) - y_scale(d[1]); })
              .attr("width", x_scale.bandwidth());

