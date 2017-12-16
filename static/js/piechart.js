/*
1. https://bl.ocks.org/mbostock/3887235
2. https://stackoverflow.com/questions/37119881/modifying-d3-js-donut-chart-to-read-from-json-array
3. http://bl.ocks.org/tjaensch/ee2685d323bde1a6cb0574de15d7d47b
4. http://bl.ocks.org/mbostock/5100636
5. Arc Tween, http://bl.ocks.org/mbostock/5100636
*/
// Samples
//

var draw_single_piechart = function(param){
    var this_year = param.year;
    var annual_sharesholdings = param.dat;
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
                    return d.shares;
                });
    var path = d3.arc()
                    .outerRadius(radius - 40)
                    .innerRadius(radius - 60);
    var txt_label = d3.arc()
                .outerRadius(radius - 20)
                .innerRadius(radius - 40);

    var arc = graph.selectAll(".arc")
                    .data(pie(annual_sharesholdings))
                    .enter().append("g")
                    .attr("class", "arc");


    arc.append("path")
            .attr("d", path)
            .style("fill", function (d) {
                return pie_color(d.data.owner);
            });

    arc.append("text")
            .attr("transform", function (d) {
                return "translate(" + txt_label.centroid(d) + ")";
            })
            .attr("dy", ".25em")
            /* Anchor to middle */
            .style("text-anchor", "middle")
            .text(function (d) {
                return d.data.owner;
            });
        graph.append('g').append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("text-decoration", "underline")
        .text(this_year);


}
var dispatch_annual_piechart = function (ele, idx) {
    annual_shares = ele.shares.map(function (share, sidx) {
        trim_share = Object.values(share)[0][1];
        trim_share = trim_share.replace(/[^0-9.]/g, "");
        trim_share = parseFloat(trim_share);
        owner_name = Object.keys(share)[0];
        return {owner : owner_name, shares : trim_share};
    });
    draw_single_piechart({year: ele.year, dat : annual_shares});
}
json_dataArray.map(dispatch_annual_piechart);
