/*
1. CSV, https://bl.ocks.org/mbostock/3886208
2. CSV, https://bl.ocks.org/DimsumPanda/689368252f55179e12185e13c5ed1fee
3. json, https://bl.ocks.org/caravinden/8979a6c1063a4022cbd738b4498a0ba6
4. slice(), https://www.w3schools.com/jsref/jsref_slice_array.asp
5. https://github.com/d3/d3-shape/blob/master/README.md#stack
 */
//var json_dataArray = [{'year': '2013', 'revenue': {'all': '3,095,969', 'self_np': '371,827'}}, {'year': '2014', 'revenue': {'all': '5,052,080', 'self_np': '562,161'}}, {'year': '2015', 'revenue': {'all': '11,056,658', 'self_np': '865,701'}}, {'year': '2016', 'revenue': {'all': '14,471,649', 'self_np': '1,022,743'}}, {'year': '2017', 'revenue': {}}]

var years = [],
    main_keys = [],
    stack_keys = [];


if (typeof(json_dataArray) !== 'undefined') {
    /*
     * Use front-end environment to preprocess data array
     * before turning it into visualization
     */
    console.log("json_dataArray Exists")
    /* Notice that key order depends on the json_dataArray object */
    main_keys = Object.keys(json_dataArray[0]),
    /* The order of stacked_keys is used to generate series (layers) */
    stack_keys = json_dataArray[0][main_keys[2]];
    var len = json_dataArray.length;
    for (var idx = 0; idx < len; idx++) {
        /* Pop out the last member in json_dataArray */
        var tmp_obj = json_dataArray.pop();
        /* Do nothing if the value of main_keys[1] (i.e., "revenue") is {} */
        if (Object.keys(tmp_obj[main_keys[1]]).length !== 0) {
            /* Get the value of main_keys[1] */
            var tmp_reorg_obj = tmp_obj[main_keys[1]];
            /* Regular expression to parse string number to integer */
            for (key in tmp_reorg_obj) {
                tmp_reorg_obj[key] = parseInt(tmp_reorg_obj[key].replace(/[^0-9.]/g, ""));
            }
            /* Revenue subtract others */
            for (key in tmp_reorg_obj) {
                if (key !== stack_keys[stack_keys.length-1]) {
                    tmp_reorg_obj[stack_keys[stack_keys.length-1]] -= tmp_reorg_obj[key];
                }
            }
            /* Insert the main_keys[0] into the reorg object */
            tmp_reorg_obj[main_keys[0]] = tmp_obj[main_keys[0]];
            /* Push in front of original data array */
            json_dataArray.unshift(tmp_reorg_obj);
            years.unshift(tmp_obj[main_keys[0]]);
        }
    }
} else {
    console.log("json_dataArray DO NOT Exist")
    json_dataArray = [
        {'year': '2013', 'all': 3095969, 'self_np': 371827},
        {'year': '2014', 'all': 5052080, 'self_np': 562161},
        {'year': '2015', 'all': 11056658, 'self_np': 865701},
    ];
    years = ["2013", "2014", "2015"],
    main_keys = Object.keys(json_dataArray[0]),
    stack_keys = main_keys.slice(1, 3);
}


/*
// Map data into stacked color domain
stk_layer_color.domain(d3.keys(json_dataArray[0]).filter(function(key) {return key !== "year";}));
json_dataArray.forEach(function (d) {
    var y0 = 0;
    d.revenue = stk_layer_color.domain().map(function (name) { return {name: name, y0: y0, y1: y0 += +d[name] }; });
    d.total_revenue = d.revenue[d.revenue.length - 1].y1;
});
*/
var stk_layer_color = d3.scaleOrdinal()
                        .range(["darkred", "steelblue", "#7b6888"]);
                        //d3.scaleOrdinal(d3.schemeCategory20);
var stack = d3.stack()
                .keys(stack_keys)
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);
var stk_layers = stack(json_dataArray);

// Create a svg
var svg = d3.select("body").append("svg")
            .attr("height", "200")
            .attr("width", "250")
            .style("background-color", "white");

var margin = {top: 20, right: 20, bottom: 40, left: 80},
    graph_width = +svg.attr("width") - margin.left - margin.right,
    graph_height = +svg.attr("height") - margin.top - margin.bottom;

/* Set x axis */
var x_scale = d3.scaleBand()
            .domain(years)
            .rangeRound([0, graph_width])
            .padding(0.1);
var func_x_axis = d3.axisBottom(x_scale)
                    .tickValues(years)
                    .tickFormat(function(d) {return (d)});
var x_axis = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + ", " + (svg.attr("height") - margin.bottom) + ")")
                .call(func_x_axis);
x_axis.append("text")
        .attr("y", margin.bottom/2)
        .attr("x", graph_width/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("stroke", "black")
        .style("fill", "black")
        .text("REVENUE/NET PROFIT OVER YEAR");

/* Set y axis */
var y_scale = d3.scaleLinear()
                .domain([0, d3.max(stk_layers[stk_layers.length - 1], function(d) {return d[0] + d[1];})]).nice()
                .rangeRound([graph_height, 0]);
var func_y_axis = d3.axisLeft(y_scale);
var y_axis = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(func_y_axis);

y_axis.append("text")
        .attr("y", 0 - margin.top)
        .attr("x", 0 - margin.left/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("stroke", "black")
        .style("fill", "black")
        .text("$TWD K");

/* Draw graphs with stk_layers input data */
var graph = svg.selectAll(".layer")
                .data(stk_layers)
                .enter().append("g")
                    .attr("class", "layer")
                    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                    .style("fill", function(d, i) { return stk_layer_color(i); });
/* Draw stacked bars with stk_layers input data */
graph.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return x_scale(d.data.year); })
            .attr("y", function(d) { return y_scale(d[1]); })
            .attr("height", function(d) { return y_scale(d[0]) - y_scale(d[1]); })
            .attr("width", x_scale.bandwidth());

