/*
1. https://bl.ocks.org/mbostock/3887235
2. https://stackoverflow.com/questions/37119881/modifying-d3-js-donut-chart-to-read-from-json-array
3. http://bl.ocks.org/tjaensch/ee2685d323bde1a6cb0574de15d7d47b
4. http://bl.ocks.org/mbostock/5100636
5. Arc Tween, http://bl.ocks.org/mbostock/5100636
*/
// Samples
//
tmp_arr = json_dataArray[0].shares;

/*var json_dataArray = [
{"age": "<5", "population": 2704659},
{"age": "5-13", "population": 4499890},
{"age": "14-17", "population": 2159981},
{"age": "18-24", "population": 3853788},
{"age": "25-44", "population": 14106543},
{"age": "45-64", "population": 8819342},
{"age": "≥65", "population": 612463}
];
*/
json_dataArray = [{'age': Object.keys(tmp_arr[1])[0], 'population': parseFloat((tmp_arr[1][Object.keys(tmp_arr[1])][1]).replace(/[^0-9]/g, ""))}];

//tmp_arr = tmp_arr.map(function(key1){return {'age': key1, 'population': parseFloat((tmp_arr[key1][1]).replace(/[^0-9]/g, ""))}});

json_dataArray = [];
tmp_arr.forEach(function(key1, val){
    json_dataArray.push({'age': Object.keys(key1)[0], 'population': parseFloat(Object.values(key1)[0][1].replace(/[^0-9]/g, ''))});
});

//json_dataArray = 
//replace(/[^0-9.]/g, "")};});
var width = 250,
    height = 250,
    radius = Math.min(width, height)/2;

var pie_color = d3.scaleOrdinal(d3.schemeCategory20);
                  //.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

/* Create svg element */
var svg = d3.select("body")
            .append("svg")
            .attr("height", height)
            .attr("width", width);

var graph_width = +svg.attr("width")/2,
    graph_height = +svg.attr("height")/2;

var graph = svg.append("g")
            .attr("transform", "translate(" + graph_width + "," + graph_height + ")");

var pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.population;
            });
var path = d3.arc()
                .outerRadius(radius - 40)
                .innerRadius(radius - 60);
var txt_label = d3.arc()
            .outerRadius(radius - 20)
            .innerRadius(radius - 40);

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
            return "translate(" + txt_label.centroid(d) + ")";
        })
        .attr("dy", ".25em")
        /* Anchor to middle */
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.age;
        });

