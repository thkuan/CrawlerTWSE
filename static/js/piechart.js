/*
1. https://bl.ocks.org/mbostock/3887235
2. https://stackoverflow.com/questions/37119881/modifying-d3-js-donut-chart-to-read-from-json-array
3. http://bl.ocks.org/tjaensch/ee2685d323bde1a6cb0574de15d7d47b
4. http://bl.ocks.org/mbostock/5100636
5. Arc Tween, http://bl.ocks.org/mbostock/5100636
*/
// Samples
var json_dataArray = [
{"age": "<5", "population": 2704659},
{"age": "5-13", "population": 4499890},
{"age": "14-17", "population": 2159981},
{"age": "18-24", "population": 3853788},
{"age": "25-44", "population": 14106543},
{"age": "45-64", "population": 8819342},
{"age": "≥65", "population": 612463}
];

var width = 250,
    height = 250,
    radius = Math.min(width, height)/2;

var pie_color = d3.scaleOrdinal(d3.schemeCategory20);
                  //.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

/* Create svg element */
var svg = d3.select("body")
            .append("svg")
            .attr("height", "250")
            .attr("width", "250")

var graph = svg.append("g")
                .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

var pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.population;
            });
var path = d3.arc()
                .outerRadius(radius - 40)
                .innerRadius(radius - 60);
var label = d3.arc()
            .outerRadius(radius - 50)
            .innerRadius(radius - 50);

var arc = graph.selectAll(".arc")
                .data(pie(json_dataArray))
                .enter().append("g")
                .attr("class", "arc");

arc.append("path")
        .attr("d", path)
        .style("fill", function (d) {
            return pie_color(d.data.age);
        });

arc.append("text")
        .attr("transform", function (d) {
            return "translate(" + label.centroid(d) + ")";
        })
        //.attr("x", ".35em")
        //.attr("y", ".35em")
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.age;
        });

