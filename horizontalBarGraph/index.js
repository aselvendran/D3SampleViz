(function () {

    activate();

    document.getElementById('demo').addEventListener('click', myFunction);

    function myFunction() {

        exportImg('png', 'testing', 'test')
    }

    function getScaledCanvasForNode(node, scale) {
        let canvas = document.createElement('canvas');
        let w = node.offsetWidth;
        let h = node.offsetHeight;

        canvas.width = w * scale;
        canvas.height = h * scale;
        canvas.style.width = w * 2 + 'px';
        canvas.style.height = h * 2 + 'px';

        let ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);

        return canvas;
    }

    function redirect(div, extension, file_name) {

        let node = div[0];

        console.log(node);

        html2canvas(node, {
            useCORS: true,
            allowTaint: true,
            logging: false,
            canvas: getScaledCanvasForNode(node, 2),
            windowWidth: node.offsetWidth,
            windowHeight: node.offsetHeight,
            // cannot handle x4 res for pdf
            scale: extension == "pdf" ? 2 : 4,
        }).then((canvas) => {

            if (navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.match(
                    /Trident.*rv\:11\./)) {
                window.navigator.msSaveBlob(canvas.msToBlob(), file_name);
                console.log("IE detected. Try to use a real browser");
            }

            if (extension == "pdf") {

                let doc = new jspdf("l", 'mm', [canvas.width, canvas.height]);
                doc.addImage(canvas.toDataURL("image/jpeg;charset=utf-8", 4.0), 'JPEG', 0, 0,
                             canvas.width, canvas.height);
                doc.save(file_name);
                return;
            }

            else {

//                figure out simulate download button in jquery.

                $('#down').attr('href', canvas.toDataURL("image/" + extension, 4.0));
                $('#down').attr('download', file_name);

                console.log("down");
                console.log($("#down"));

                $('#down')[0].click();
            }
        });
    }

    function exportImg(extension, fileName, id, type, graph_name) {
        // get div element

//        const div = getDiv(id);
        const div = $("#" + id);

        console.log("div");
        console.log(div);

        let file_name = `${fileName}.${extension}`;

        if (type === "graph") {
            let node = div.find('svg')[0];
            let can = document.createElement('canvas');
            let ctx = can.getContext("2d");
            let scale = (extension != "pdf") ? 2 : 1.5;
            let url = svgToUrl(node);
            let img = new Image();

            img.onload = function () {
                ctx.canvas.width = 1200;
                ctx.canvas.height = 1200;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, 1200, 1200);
                ctx.scale(scale, scale);
                ctx.font = '18px helvetica';
                ctx.drawImage(img, 0, 0);
                ctx.fillStyle = "black";
                ctx.fillText(graph_name, 20, 30);

                if (extension == "pdf") {
                    let pdfService = new PDF();
                    pdfService.addImage(can.toDataURL("image/jpg"), 'JPEG', 10, 10, 250, 220);
                    pdfService.save(file_name);
                    return;
                }

                $('#down').attr('href', can.toDataURL("image/" + extension, 1.0));
                $('#down').attr('download', file_name);
                $('#down')[0].click();
            };
            img.src = url;
        }

        else {
            redirect(div, extension, file_name);
        }

    }

    function parseData(data) {

        var axisMargin = 20,
            margin = 40,
            valueMargin = 35,

            width = parseInt(d3.select("#test").style('width'), 10),

            height = 550,

            barHeight = (height - axisMargin - margin * 2) * .5 / data.length,
            barPadding = (height - axisMargin - margin * 2) * .8 / data.length,
            data, bar, svg, scale, xAxis, labelWidth = 0;

        console.log("width");
        console.log(width);

        max = d3.max(data, function (d) {
            return d.Index;
        });

//        d3.select('body')
        svg = d3.select("#test")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        bar = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");

        bar.attr("class", "bar")
            .attr("cx", 0)
            .attr("transform", function (d, i) {
//                return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding)
                return "translate(" + margin + "," + (i * (barPadding) + barPadding * 1.5) + ")";
            });

        bar.append("text")
            .attr("class", "label")
            .style("text-anchor", "end")
            .attr("dx", "11em")

            .attr("y", barHeight / 2)
            .attr("dy", ".35em") //vertical align middle
            .text(function (d) {
                return d.category;
            }).each(function () {
            labelWidth = Math.ceil(Math.max(labelWidth + 2, this.getBBox().width));

        });
//
        scale = d3.scale.linear()
            .domain([0, max])
            //            //            .range([0, width + margin * 1.5 - labelWidth]);
            .range([0, width * .75 - labelWidth]);

        xAxis = d3.svg.axis()
            .scale(scale)
            .tickSize(-375)
            .tickValues(d3.range(0, max + 10, 50))
            .orient("bottom");

        bar.append("rect")
            .attr("transform", "translate(" + labelWidth + ", 0)")
            .attr("height", barHeight)
            .attr("width", function (d) {
                return scale(d.Index);
            });

        svg.insert("g", ":first-child")
            .attr("class", "axisHorizontal")
            .attr("transform", "translate(" + (margin + labelWidth) + "," + (height -
                                                                             axisMargin - margin
                                                                             * 3.5) + ")")
            .call(xAxis);

        d3.selectAll('g.tick.text')
            .attr("dy", ".35em")
            .attr("x", function (d) {
                return -3;
            });

        d3.selectAll('g.tick')
            .filter(function (d) {
                return d === 100;
            })
            .select('line') //grab the tick line
            .attr('class', 'quadrantBorder') //style with a custom class and CSS
            .style('stroke-width', 2.5)
            .style('stroke', 'orange');

        bar.append("text")
            .attr("class", "value")
            .attr("y", barHeight / 2)
            .attr("transform", "translate(" + labelWidth + ", 0)")

            .attr("dx", function (d) {
                return scale(d.Index) - 15;
            })
            .attr("dy", ".35em") //vertical align middle
            .attr("text-anchor", "middle")
            .text(function (d) {
                return (d.Index);
            });


        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", margin / 3)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill-opactiy", "1")
            .style("font-weight", "bold")
            .text("Sector Market Caps");

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height * .75)
            .text("Market Cap");

    }

    function activate() {

        const parsedStreamJson = (d) => d.split("\n").filter(s => s.length > 0)
            .map((s) => JSON.parse(s));

        d3.text("categoryIndexData/categoryIndexData.txt",
                (d) => parseData(parsedStreamJson(d)));

    };
})();
