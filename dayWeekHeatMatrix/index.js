(function () {

    activate();

    function activate() {
        const margin = {top: 50, right: 0, bottom: 100, left: 70};
        const widthHeight = calculateWidthHeight();
        const width = widthHeight.width;
        const height = widthHeight.height;

        const gridSize = calculateGridSize();

        datasets = ["data.tsv"];

        const rootElem = d3.select("#chart");
        const svgElem = rootElem.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const shiftedElem = svgElem
            .append("g")
            // transform translate apply the respective transformations to the coordinate system
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const parsedStreamJson = (d) => d.split("\n").filter(s => s.length>0).map((s) => JSON.parse(s))
        d3.text("heat_map_data.json",(e, d) => parseData(shiftedElem, parsedStreamJson(d)));

    }

    function distinctArray(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }

        return arr.reduce(
            (distinct, curVal) => distinct.indexOf(curVal) === -1
                ? distinct.concat([curVal])
                : distinct,
            []
        );
    }

    function mapIntDayToString(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }


        const intDayToString = [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"
        ];


        return arr.map((d) => intDayToString[(+d) - 1]);
    }

    function mapIntHourToString(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }


        const intDayToString = [
            "12 A.M.", "1 A.M.", "2 A.M.", "3 A.M.", "4 A.M.", "5 A.M.", "6 A.M.", "7 A.M.", "8 A.M",
            "9 A.M.", "10 A.M.", "11 A.M.", "12 P.M.", "1 P.M", "2 P.M.", "3 P.M.", "4 P.M.",
            "5 P.M.", "6 P.M.", "7 P.M.", "8 P.M.", "9 P.M.", "10 P.M.", "11 P.M."
        ];

//        return arr.map((d) => intDayToString[(+d) - 1]);
        return arr.map((d) => intDayToString[(+d)]);

    }

    function buildDataFromTSV(tsvRow) {

        return {
            "day": +tsvRow.day,
            "hour": +tsvRow.hour,
            "value": +tsvRow.value
        }
    }



    function buildDataFromJSON(data) {



        data.forEach(function(d) {
            d.day = d.day;
            d.hour = d.hour;
            d.value = +d.value;
        });
        return data
    }

    function calculateGridSize() {
        const width = calculateWidthHeight().width;
        return Math.floor(width / 24);
    }

    function calculateWidthHeight() {
        const margin = calculateMargin();
        return {
            "width": 960 - margin.left - margin.right,
            "height": 430 - margin.top - margin.bottom
        };
    }

    function calculateMargin() {
        return {top: 50, right: 0, bottom: 100, left: 70};
    }

    function drawYAxisLabels(svg, labelData) {
        const dataMultIndex = (d, i) => i * gridSize;

        const gridSize = calculateGridSize();
//root element. Select every child elmenet that has the class DayLabel
        // issue is that dayLabel does not exist yet.

        svg.selectAll()
            .data(labelData)
            .enter()
            .append("text")
            .text(((d) => d))
            .attr("x", 0)
            .attr("y", dataMultIndex)
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", "dayLabel mono axis axis-workweek");
    }

    function drawXAxisLabels(svg, labelData) {

        const dataMultIndex = (d, i) => i * gridSize;

        const widthHeight = calculateWidthHeight();
        const width = widthHeight.width;
        const height = widthHeight.height;

        const gridSize = calculateGridSize();

        svg
            .selectAll()
            .data(labelData)
            .enter().append("text")
            .text(((d) => d))
            .attr("x", dataMultIndex)
            .attr("y", height)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            //            .attr("transform", "rotate(0.5)")
            .attr("class", "timeLabel mono axis axis-workweek");

    }

    function parseData(svg, data) {



        const distinctIntDays = distinctArray(data.map((d) => d.day).sort());


        const sundayFirst = distinctIntDays;




        const distinctIntHours = distinctArray(data.map((d) => d.hour).sort((function (a, b) {
            return a - b
        })));


        const SixAMFirst = distinctIntHours.slice(6, distinctIntHours.length)
            .concat(distinctIntHours.slice(0, 6));

        const widthHeight = calculateWidthHeight();
        const width = widthHeight.width;
        const height = widthHeight.height;
        drawYAxisLabels(svg, mapIntDayToString(sundayFirst));
        drawXAxisLabels(svg, mapIntHourToString(SixAMFirst));

        const gridSize = calculateGridSize();

        const legendElementWidth = gridSize * 2,


        colors  = ["#fffff3","#f3f3ff","#c0c0ff","#ffc0c0","#7fcdbb","#7fb8cd","#F1B2DB","#4175c4"]



        var colorScale = d3.scale.threshold()

            .domain([0, 75, 150, 225, 300, 375,450,600])



            .range(colors);


        rangetest = [0, 75, 150, 225, 300, 375,450,600];



        const tip = d3.tip()
            .attr('class', 'd3-tip')
            .style("visibility", "visible")
            .offset([-20, 0])
            .html(function (d) {
                return "Market Volume:  <span style='color:blueviolet'>" + d.value
                    ;
            });

        tip(svg.append("g"));

        const cards = svg
            .selectAll()
            .data(data, (d) => d.day + ':' + d.hour);

        cards.append("title");

        cards.enter().append("rect")
            .attr("x", (d) => SixAMFirst.indexOf(d.hour) * gridSize)
            .attr("y", (d) => (sundayFirst.indexOf(d.day) * gridSize))
            .attr("rx", 1)
            .attr("ry", 1)
            .attr("class", "hour bordered")
//                        .attr("class", "square")

//            .attr("class", "hour dashed")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0])
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        cards.transition().duration(1000)
            .style("fill", (d) =>colorScale(d.value));

        cards.select("title").text((d) => d.value);

        cards.exit().remove();



        var legend = svg.selectAll(".legend")
            .data(colors)//pass the lgend data
            .enter().append("g")
            .attr("class", "legend")


        legend.append("rect")
            .attr("x",  (d, i) => legendElementWidth * i + 100)
            .attr("y", height + 25)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", (d, i) => colors[i])



        legend.append("text").data(rangetest)
                .attr("class", "mono")
                //                        .text((d) => "≥ " + Math.round(d))
                .text(function(d,i) {
                    if(i === 0){
                        return "Equals 0"
                    } else if (i === 7) {
                        return "Greater than 450"
                    } else if (i === 1) {
                        return "> " + Math.round(d)
                    }
                    else {
                       return "≥ " + Math.round(d)
                    }
                }
                )


            .attr("x", (d, i) => legendElementWidth * i + 100)
            .attr("y", height + gridSize + 25)
            ;

    }

})();




