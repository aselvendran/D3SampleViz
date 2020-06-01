(function () {

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


    var circleLegend = function() {
        'use strict';

        var scale,
            orient = 'left',
            tickPadding = 3,
            tickExtend = 5,
            tickArguments_ = [10],
            tickValues = null,
            tickFormat_,
            ε = 1e-6;


        function key(selection) {
            selection.each(function() {
                var g = d3.select(this);

                g.attr('class', 'circle-legend');

                // Stash a snapshot of the new scale, and retrieve the old snapshot.
                var scale0 = this.__chart__ || scale,
                    scale1 = this.__chart__ = scale.copy();

                // Ticks, or domain values for ordinal scales.
                var ticks = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments_) : scale.domain()) : tickValues,
                    ticks = ticks.slice().filter(function(d) { return d > 0 }).sort(d3.descending),
                    tickFormat = tickFormat_ == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments_) : String) : tickFormat_,
                    tick = g.selectAll('.tick').data(ticks, scale1),
                    tickEnter = tick.enter().insert('g', '.tick').attr('class', 'tick').style('opacity', ε),
                    tickExit = d3.transition(tick.exit()).style('opacity', ε).remove(),
                    tickUpdate = d3.transition(tick.order()).style('opacity', 1),
                    tickTransform;


                tickEnter.each(function(tick) {
                    var gg = d3.select(this);

                    var tickText = tickFormat(tick);

                    if (!tickText) return;

                    gg.append('circle')
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .attr('r', scale(tick));

                    gg.append('line')
                        .attr('y1', 0)
                        .attr('y2', 0)
                        .attr('stroke', '#000')
                        .text(tick);

                    gg.append('text')
                        .attr('dy', '.35em')
                        .style('text-anchor', 'left' == orient ? 'end' : 'start')
                        .text(tickText);

                });
                tickEnter.call(d3_svg_legend, scale0);
                tickUpdate.call(d3_svg_legend, scale1);
                tickExit.call(d3_svg_legend, scale1);



                function d3_svg_legend(selection, scale) {
                    selection.select('circle')
                        .attr('r', scale);

                    var x2 = scale(ticks[0]) + tickExtend;
                    var sign = 'left' == orient ? -1 : 1;

                    selection.select('text')
                        .attr('transform', 'translate(' + (x2 + tickPadding) * sign + ', 0)');

                    selection.select('line')
                        .attr('x1', function(d) { return scale(d) * sign })
                        .attr('x2', x2 * sign);

                    selection.attr('transform', function(d) { return 'translate(0,' + -scale(d) + ')'; });
                }

            });
        }

        key.scale = function(value) {
            if (!arguments.length) return scale;
            scale = value;
            return key;
        };

        key.orient = function(value) {
            if (!arguments.length) return orient;
            orient = value;
            return key;
        };

        key.ticks = function() {
            if (!arguments.length) return tickArguments_;
            tickArguments_ = arguments;
            return key;
        };



        key.tickFormat = function(x) {
            if (!arguments.length) return tickFormat_;
            tickFormat_ = x;
            return key;
        };

        key.tickValues = function(x) {
            if (!arguments.length) return tickValues;
            tickValues = x;
            return key;
        };

        key.tickPadding = function(x) {
            if (!arguments.length) return tickPadding;
            tickPadding = +x;
            return key;
        };

        key.tickExtend = function(x) {
            if (!arguments.length) return tickExtend;
            tickExtend = +x;
            return key;
        };

        key.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return key;
        };

        key.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return key;
        };

        return key;
    };




    activate();



    function activate() {



        var scale = d3.scale.sqrt()
            .domain([0, 1000000])
            .range([0, 100]);



        var formatCurrencySI = function(d) {


            if(d ===250000){
                return "10th Quantile"
            }else if(d === 150000) {

                return "5th Quantile"
            }else if(d === 70000){

                return "1rd Quantile"
            }else{
                null
            }

        };

        var circleKey = circleLegend()
            .scale(scale)
            .tickValues([70000, 150000,250000])
            .tickFormat(formatCurrencySI);




        var width = 2000,
            height = 1000,
            padding = .5, // separation between same-color nodes
            clusterPadding = 15, // separation between different-color nodes
            maxRadius = 12;





        var colors  = [
            
            "#F04E98",
            "#6ACEB9",
            "#E3E934",
            "#A438A8",
            "#000000",
            "#53585F"
        ];


        var color = d3.scale.ordinal()
            .range(colors);

        d3.text("wordCountData.csv", function(error, text) {


                    if (error) throw error;
            var colNames = "text,size,group\n" + text;
            var data = d3.csv.parse(colNames);

            data.forEach(function(d) {
                d.size = +d.size;
            });


//unique cluster/group id's
            var cs = [];
            data.forEach(function(d){
                if(!cs.contains(d.group)) {
                    cs.push(d.group);
                }
            });

            var n = data.length, // total number of nodes
                m = cs.length; // number of distinct clusters

//create clusters and nodes
            var clusters = new Array(m);
            var nodes = [];
            for (var i = 0; i<n; i++){
                nodes.push(create_nodes(data,i));
            }


                    var max = d3.max(nodes, function(d) { return d.radius });
                    var min = d3.min(nodes, function(d) { return d.radius });






            var force = d3.layout.force()
                .nodes(nodes)
                .size([width, height])
                .gravity(.02)
                .charge(0)
                .on("tick", tick)
                .start();


            var svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height);



            var node = svg.selectAll("circle")
                .data(nodes)
                .enter().append("g").call(force.drag);


            node.append("circle")
                .style("fill", function (d) {

                    {console.log(d)}

                    return color(d.cluster);
                })
                .attr("r", function(d){return d.radius});


//            Athavan Edit



                    svg.selectAll("circle")
                        .filter(function(d) { return d.radius === max; })
                        .classed("max", true)
                        .attr("data-legend", (d) => d.text);



                    svg.selectAll("circle")
                        .filter(function(d) { return d.radius != max; })
                        .classed("max", true)
                        .attr('fill-opacity', 0.75);




                    svg.selectAll("circle")
                        .filter(function(d) { return d.radius === min; })
                        .classed("max", true)

//                        .style("fill", "#a72f79");



                    node.append("text").filter(function(d) { return d.radius != max; })
                        .attr("class", "athavana")
                        .text(function(d) {
                            return (d.text.split(' ').shift())
                        })
                        .attr("dy", ".3em")
                        .style("text-anchor", "middle");





                    node.append("text").filter(function(d) { return d.radius != max; })
                        .attr("class", "athavana")
                        .text(function(d) {
                        if(d.text.split(' ').length > 1){
                            return (d.text.split(' ').pop())

                        } else{
                            return null
                        }
                        })
                        .attr("dy", "1.3em")
                        .style("text-anchor", "middle");



                    node.append("text")
                        .filter(function(d) { return d.radius === max; })
                        .attr("class", "athavana_max")
                        .attr("dy", ".3em")
                        .style("text-anchor", "middle")
                        .text(function(d) {
                            return (d.text.toUpperCase().split(' ').shift())
                        });



                    node.append("text")
                        .filter(function(d) { return d.radius === max; })
                        .attr("class", "athavana_max")
                        .text(function(d) {
                            if(d.text.split(' ').length > 1){
                                return (d.text.toUpperCase().split(' ').pop())

                            } else{
                                return null
                            }
                        })
                        .style("text-anchor", "middle")
                        .attr("dy", "1.3em");




                    svg.append('g')
                        .attr("class","circle-legend")
                        .attr('transform', 'translate(150, 450)')
                        .call(circleKey);

                    legend = svg.append("g")
                        .attr("class","legend")
                        .attr("transform","translate(50,30)")
                        .style("font-size","12px")

                        .call(d3legend);


                    function create_nodes(data,node_counter) {
                var i = cs.indexOf(data[node_counter].group),
                    r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
                    d = {
                        cluster: i,
                        radius: data[node_counter].size*4.5,
                        text: data[node_counter].text,
                        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
                    };
                if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                return d;
            };



            function tick(e) {
                node.each(cluster(10 * e.alpha * e.alpha))
                    .each(collide(.5))
                    .attr("transform", function (d) {
                        var k = "translate(" + d.x + "," + d.y + ")";
                        return k;
                    })

            }

// Move d to be adjacent to the cluster node.
            function cluster(alpha) {
                return function (d) {
                    var cluster = clusters[d.cluster];
                    if (cluster === d) return;
                    var x = d.x - cluster.x,
                        y = d.y - cluster.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + cluster.radius;
                    if (l != r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        cluster.x += x;
                        cluster.y += y;
                    }
                };
            }

// Resolves collisions between d and all other circles.
            function collide(alpha) {
                var quadtree = d3.geom.quadtree(nodes);
                return function (d) {
                    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                        nx1 = d.x - r,
                        nx2 = d.x + r,
                        ny1 = d.y - r,
                        ny2 = d.y + r;
                    quadtree.visit(function (quad, x1, y1, x2, y2) {
                        if (quad.point && (quad.point !== d)) {
                            var x = d.x - quad.point.x,
                                y = d.y - quad.point.y,
                                l = Math.sqrt(x * x + y * y),
                                r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                            if (l < r) {
                                l = (l - r) / l * alpha;
                                d.x -= x *= l;
                                d.y -= y *= l;
                                quad.point.x += x;
                                quad.point.y += y;
                            }
                        }
                        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                    });
                };
            }
        }


        );

        Array.prototype.contains = function(v) {
            for(var i = 0; i < this.length; i++) {
                if(this[i] === v) return true;
            }
            return false;
        };




    }


})();
