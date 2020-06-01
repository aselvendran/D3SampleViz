(function () {

    activate();

    function calculateMargin() {
        return {top: 50, right: 0, bottom: 100, left: 70};
    }

    function calculateWidthHeight() {
        return {
            "width": 850,
            "height": 400,
            "margin": 70
        };
    }

    function distinctArray(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }

        return arr.reduce(
            (distinct, curVal) => distinct.indexOf(curVal) === -1 ? distinct.concat([curVal]) : distinct, []);
    }

    function mapIntHourToString(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }
        const intDayToString = [
            "1 A.M.", "2 A.M.", "3 A.M.", "4 A.M.", "5 A.M.", "6 A.M.", "7 A.M.", "8 A.M",
            "9 A.M.", "10 A.M.", "11 A.M.", "12 P.M.", "1 P.M", "2 P.M.", "3 P.M.", "4 P.M.",
            "5 P.M.", "6 P.M.", "7 P.M.", "8 P.M.", "9 P.M.", "10 P.M.", "11 P.M.", "12 A.M."
        ];
        return arr.map((d) => intDayToString[(+d) - 1]);
    }

    function mapCategoryToString(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }
        const intCategoryToString = [
            "Communication Services", "Consumer Discretionary", "Consumer Staples", "Energy", "Financials", "Health Care", "Industrials", "Information Technology", "Materials",
            "Real Estate"
        ];

        return arr.map((d) => intCategoryToString[(+d) - 1]);
    }

    function mapSizeToString(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }
        const intSizeToString = [
            "100-150", "150-200", "200-250", "250-300", "300-350", "350-400", "400 and above"
        ];

        return arr.map((d) => intSizeToString[(+d)]);
    }

    function fade(svg, c, opacity) {
        console.log('foo');
        svg.selectAll("circle")
//            .filter("."+c)
            .filter(function (d) {
                return d.c != c;
            })
            .transition()
            .style("opacity", opacity);
    }

    function fadeOut(svg, opacity) {
        svg.selectAll("circle")
            .transition()
            .style("opacity", function (d) {
                opacity(d.size);
            });
    }

    function d3legend(g) {
        g.each(function () {

            var g = d3.select(this),
                items = {},
                svg = d3.select(g.property("nearestViewportElement")),
                legendPadding = g.attr("data-style-padding") || 5,
                lb = g.selectAll(".legend-box").data([true]),
                li = g.selectAll(".legend-items").data([true]);

            lb.enter().append("rect").classed("legend-box", true);
            li.enter().append("g").classed("legend-items", true);

            svg.selectAll("[data-legend]").each(function () {
                var self = d3.select(this);
                items[self.attr("data-legend")] = {
                    pos: self.attr("data-legend-pos") || this.getBBox().y,
                    color: self.attr("data-legend-color") != undefined ? self.attr(
                        "data-legend-color") : self.style("fill") != 'none' ? self.style("fill")
                               : self.style("stroke"),
                    icon: self.attr("data-legend-icon") || "circle"
                }
            });

            items = d3.entries(items).sort(function (a, b) {
                return a.value.pos - b.value.pos
            });

            li.selectAll("text")
                .data(items, function (d) {
                    return d.key
                })
                .call(function (d) {
                    d.enter().append("text")
                })
                .call(function (d) {
                    d.exit().remove()
                })
                .attr("y", function (d, i) {
                    return i + "em"
                })
                .attr("x", "1em")
                .text(function (d) {
                    ;
                    return d.key
                })
            ;

            li.selectAll("circle")
                .data(items.filter(function (item, index) {
                          // save original index
                          item.value.index = index;
                          return item.value.icon == 'circle'
                      }),
                      function (d) {
                          return d.key
                      })
                .call(function (d) {
                    d.enter().append("circle")
                })
                .call(function (d) {
                    d.exit().remove()
                })
                .attr("cy", function (d) {
                    return (d.value.index - 0.25) + "em"
                })
                .attr("cx", 0)
                .attr("r", "0.4em")
                .style("fill", function (d) {
                    return d.value.color
                })

            ;

            li.selectAll("line")
                .data(items.filter(function (item, index) {
                          // save original index
                          item.value.index = index;
                          return item.value.icon == 'line'
                      }),
                      function (d) {
                          return d.key
                      })
                .call(function (d) {
                    d.enter().append("line")
                })
                .call(function (d) {
                    d.exit().remove()
                })
                .attr("x1", "-0.4em")
                .attr("x2", "0.4em")
                .attr("y1", function (d) {
                    return (d.value.index - 0.4) + "em"
                })
                .attr("y2", function (d) {
                    return (d.value.index - 0.4) + "em"
                })
                .attr("stroke-width", 2)
                .attr("stroke", function (d) {
                    return d.value.color
                });

            // Reposition and resize the box
            var lbbox = li[0][0].getBBox();
            lb.attr("x", (lbbox.x - legendPadding))
                .attr("y", (lbbox.y - legendPadding))
                .attr("height", (lbbox.height + 2 * legendPadding))
                .attr("width", (lbbox.width + 2 * legendPadding))
        });
        return g
    }

    function XAxisGridandName(xaxis, height) {

        var xAxis = d3.svg.axis().scale(xaxis)
            .innerTickSize(-height);

        var labelX = 'Time';

        return {
            xAxis,
            labelX
        }

    }

    function YAxisGridandName(yaxis, width) {

        var yAxis = d3.svg.axis().scale(yaxis)
            .orient("left")
            .innerTickSize(-width);

        var labelY = 'Categories';

        return {
            yAxis,
            labelY
        }

    }

    function buildData() {
        const data = [];

        var xitems = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                           21, 22, 23, 24);
        var xitem = xitems[Math.floor(Math.random() * xitems.length)];

        var yitems = Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        var yitem = yitems[Math.floor(Math.random() * yitems.length)];

        for (var i = 0; i < 50; i++) {
            data.push({
//                          x: Math.random() * 400,
                          x: xitems[Math.floor(Math.random() * xitems.length)],
//                          y: Math.random() * 100,
                          y: yitems[Math.floor(Math.random() * yitems.length)],
                          c: Math.round(Math.random() * 6),
                          size: Math.random() * 200,
                      });
        }

        return data

    }

    function activate() {

        var height = calculateWidthHeight().height;
        var width = calculateWidthHeight().width;
        var margin = calculateWidthHeight().margin;

        const data = buildData();
        console.log(data);

        dataNest = d3.nest()
            .key(function (d) {
                return d.c;
            })
            .entries(data);

        console.log(dataNest);

        var legendSpace = width / height;

        var svg = d3.select('.chart')
            .append('svg')
            .attr('class', 'chart')
            .attr("width", width + margin + margin + 150)
            .attr("height", height + margin + margin)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");



        const intDayToString = [
            "", "1 A.M.", "2 A.M.", "3 A.M.", "4 A.M.", "5 A.M.", "6 A.M.", "7 A.M.", "8 A.M",
            "9 A.M.", "10 A.M.", "11 A.M.", "12 P.M.", "1 P.M", "2 P.M.", "3 P.M.", "4 P.M.",
            "5 P.M.", "6 P.M.", "7 P.M.", "8 P.M.", "9 P.M.", "10 P.M.", "11 P.M.", "12 A.M."
        ];

        var x = d3.scale.ordinal()
            .domain(intDayToString)
            .rangePoints([0, width]);

        const intCategoryToString = [
            " ",   "Communication Services", "Consumer Discretionary", "Consumer Staples", "Energy", "Financials", "Health Care", "Industrials", "Information Technology", "Materials",
            "Real Estate"
        ];

        var y = d3.scale.ordinal()
            .domain(intCategoryToString)
            .rangePoints([height, 0]);



        var scale = d3.scale.sqrt()
            .domain([d3.min(data, (d) => d.size), d3.max(data, (d) => d.size)])
            .range([1, 20]);

        var opacity = d3.scale.sqrt()
            .domain([d3.min(data, (d) => d.size), d3.max(data, (d) => d.size)])
            .range([1, .5]);

        var color = d3.scale.category20();

        var labelX = XAxisGridandName(x, height).labelX;
        var xAxis = XAxisGridandName(x, height).xAxis;

        var yAxis = YAxisGridandName(y, width).yAxis;
        var labelY = YAxisGridandName(y, width).labelY;



        const tip = d3.tip()
            .attr('class', 'd3-tip')
            .style("visibility", "visible")
            .offset([-20, 0])
            .html(function (d) {
                return "Impressions:  <span style='color:blueviolet'>"
                       + d.x * d.y * 10
            });


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .style("text-anchor", "end")
            .attr("x", width + 20)
            .attr("y", margin - 40)
            .attr("dy", ".71em")
            .attr("dx", "-.8em")
            .text(labelX);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 20)
            .attr("y", -margin + 20)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(labelY);



        tip(svg.append("g"));

        svg.selectAll("circle")
            .data(data)
            .enter()
            .insert("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("data-legend", (d) => d.c)
            .attr("data-legend", (d) => {
                return (mapSizeToString([(d.c)]).toString())
            })

            .attr("data-legend-icon", "circle")

            .attr("opacity", (d) => opacity(d.size))
            .attr("r", (d) => scale(d.size))
            .style("fill", (d) => color(d.c))
            .attr("class",   function(d){
                var colorhex = color(d.c);
                var chophash = colorhex.substr(1);
                return chophash;
            })

            .on('mouseover', function (d, i) {

                {console.log(d.c)}
                {console.log(color(d.c))}

                tip.show(d, i);

                var colorhex = color(d.c);
                var chophash = colorhex.substr(1);

            })

            .on('mouseout', function (d, i) {
                tip.hide(d, i);
            })

            .transition()

            .attr("cx", (d) => {
                return x(mapIntHourToString([(d.x)]).toString())
            })

            .attr("cy", (d) => {
                return y(mapCategoryToString([(d.y)]).toString())
            })
            .ease("bounce");
//
        legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(875,30)")
            .style("font-size", "10px")
            .call(d3legend);


        var margin2 = {top: 20, right: 80, bottom: 80, left: 50},
            width2 = 960 - margin2.left - margin2.right,
            height2 = 350 - margin2.top - margin2.bottom;

        legendSpace = width2 / dataNest.length; // space for legend

        dataNest.forEach(function (d, i) {

            svg.append("path")
                .data(data)
                .style("stroke", function () {
                    return d.color = color(d.key);
                })
                .attr("id", 'tag' + d.key.replace(/\s+/g, '')) // assign ID
                //                .attr("d", maleLine(d.values))
                .attr("d", (d) => d.size)

            // Add the legend
            svg.append("text")
                .attr("x", (legendSpace / 2) + i * legendSpace) // spacing
                .attr("y", height + 50)
                .attr("class", "legend")  // style the legend
                .style("fill", function () {
                    return d.color = color(d.key);
                })
                .on("click", function () {


                    // Determine if current line is visable
                    var active = d.active ? false : true,
                        newOpacity = active ? 1 : 0;
                    // Hide or show the elements based on the ID
                    d3.selectAll("#tag" + d.key.replace(/\s+/g, ''))
                        .transition().duration(100)
                        .style("opacity", newOpacity);
                    d3.select(this)
                        .style("font-size", function () {
                            if (active) {
                                {fade(svg, d.key, .1);}
                                return "25px"
                            } else{
                                fadeOut(svg,opacity);
                            }
                        })
                    // Update whether or not the elements are active
                    var colorhex = color(d.key);
                    d.active = active


                })

                .on("mouseover", function () {

                    if (d.active != true) {
                        d3.selectAll(".chart" + d.key.replace(/\s+/g, ''))
                            .transition()
                            .duration(50)
                            .style("opacity", 1)
                        d3.select(this)
                            .transition()
                            .duration(50)
                            .style("font-size", function () {
                                if (d.active != true) {
                                    return "25px"
                                }
                            });

                    }
                })

                .on("mouseout", function () {

                    console.log("Robert");


                    if (d.active != true) {
                            d3.selectAll(".chart" + d.key.replace(/\s+/g, ''))
                                .transition()
                                .duration(1000)
                                .style("opacity", 0)
                            d3.select(this)
                                .transition()
                                .duration(100)
                                .style("font-size", function () {
                                           return "16px"
                                       }
                                )
                        }

                    }
                )



                .text(mapSizeToString([(d.key)]).toString());

        });

    }

})();

