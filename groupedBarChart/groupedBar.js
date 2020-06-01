(function () {

    activate();

    function calculateMargin() {
        return {top: 125, right: 20, bottom: 55, left: 100};
    }

    function calculateWidthHeight() {
        const margin = calculateMargin();
        return {
            "width": 960 - margin.left - margin.right,
            "height": 500 - margin.top - margin.bottom
        };
    }

    function parseData(svg, data) {

        var margin = calculateMargin(),
            width = calculateWidthHeight().width,
            height = calculateWidthHeight().height;

        var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x0)
            .tickSize(0)
            .orient("bottom");

        maxY = d3.max(data, function (hour) {
            return d3.max(hour.values, function (d) {
                return d.value;
            });
        });

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(-width)

            .outerTickSize(0)
            .tickValues(d3.range(0, Math.round(maxY) + 2, 1))

            .tickFormat(d => d + "%")
            .orient("left");

        var color = d3.scale.ordinal()
            .range(["purple", "orange"]);

        var categoriesNames = data.map(function (d) {
            return d.hour;
        });
        var rateNames = data[0].values.map(function (d) {
            return d.supply;
        });

        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()], 0.1);
        y.domain([0, d3.max(data, function (hour) {
            return d3.max(hour.values, function (d) {
                return d.value;
            });
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

//            .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity', '0')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left / 2)
            .attr("x", -margin.top / 2)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight', 'bold')
            .style("font-size", "14px")
            .style("fill-opactiy", "1")
            .text("Percent of Total")
        ;

        svg.select('.y')
            .style('opacity', '1');

        var slice = svg.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.hour) + ",0)";
            });

        slice.selectAll("rect")
            .data(function (d) {
                return d.values;
            })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) {
                return x1(d.supply);
            })
            .style("fill", function (d) {
                return color(d.supply)
            })
            .attr("y", function (d) {
                return y(0);
            })

            .attr("height", function (d) {
                return height - y(0);
            });

        slice.selectAll("rect")
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            });

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", length - margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill-opactiy", "1")
            .style("font-weight", "bold")
            .text("Sector Volume Percentage Comparison");

        //Legend

        var legend = svg.selectAll(".legend")
            .data(data[0].values.map(function (d) {
                return d.supply;
            }).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .style("opacity", "0");

        legend.append("rect")
            //        .attr("x", width - 18)
            .attr("x", width)
            .attr("y", length - margin.top / 1.5)

            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) {
                return color(d);
            });

        legend.append("text")
            //        .attr("x", width - 24)
            //        .attr("y", 9)
            .attr("x", width - 5)
            .attr("y", length - margin.top / 2 - 10)

            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        legend
            .style("opacity", "1");

    }

    function activate() {

        var margin = calculateMargin(),
            width = calculateWidthHeight().width,
            height = calculateWidthHeight().height;

        var svgShift = d3.select('body').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const parsedStreamJson = (d) => JSON.parse(d);
        d3.text("rawData/barChartData.txt",
                (e, d) => parseData(svgShift, parsedStreamJson(d)));

    };

})();
