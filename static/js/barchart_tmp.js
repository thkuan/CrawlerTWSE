var dataArray = [3.12, 4.65, 6.17, 1.34, 3.19, 5.38, 8.63, 2.53, 5.48, 9.07, 12.57, 3.28, 7.06, 10.56, 14.01, 2.43, 6.17];

var svg = d3.select("body").append("svg")
            .attr("height", "100%")
            .attr("width", "100%")
            .style("background-color", "white");

svg.selectAll("rect")
    .data(dataArray)
    .enter().append("rect")
            // Name it as "bar" to be reference used by CSS
            .attr("class", "bar")
            .attr("height", function(d, i) {return (d * 10)})
            .attr("width", "10")
            .attr("x", function(d, i) {return (i * 20) + 10})
            .attr("y", function(d, i) {return 200 - (d * 10)})
            // Decide by you to style shapes in css or js
            .attr("stroke", "black");
