(function () {


    activate2();



    function calculateMargin() {
        return {top: 50, right: 120, bottom: 50, left: 150};
    }

    function calculateWidthHeight() {
        const margin = calculateMargin();
        return {
            "width": 960 - margin.left - margin.right,
            "height": 500 - margin.top - margin.bottom
        };
    }

    function distinctArray(arr) {
        if (!Array.isArray(arr)) {
            return [];
        }

        return arr.reduce(
            (distinct, curVal) => distinct.indexOf(curVal) === -1 ? distinct.concat([curVal])
                : distinct, []);
    }

    function mapIntHourToString(arr) {

        console.log("This is the Array");
        console.log(arr);

        if (!Array.isArray(arr)) {
            return [];
        }

        const intDayToString = [
            "1 A.M.", "2 A.M.", "3 A.M.", "4 A.M.", "5 A.M.", "6 A.M.", "7 A.M.", "8 A.M",
            "9 A.M.", "10 A.M.", "11 A.M.", "12 P.M.", "1 P.M", "2 P.M.", "3 P.M.", "4 P.M.",
            "5 P.M.", "6 P.M.", "7 P.M.", "8 P.M.", "9 P.M.", "10 P.M.", "11 P.M.", "12 A.M."
        ];

        console.log("This is the mapedIntHour");
        console.log(arr.map((d) => intDayToString[(+d) - 1]));

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

    function parseData(data) {

        max = d3.max(data, function (d) {
            return d.Index;
        });

        console.log("This is max");
        console.log(max);

        console.log("This is domainTest");
        const aaa = distinctArray(data.map((d) => d.category));
        console.log(aaa);

        var height = calculateWidthHeight().height;
        var width = calculateWidthHeight().width;
        var margin = calculateMargin();

        var svg = d3.select('.chart')
            .append('svg')
            .attr('class', 'chart')
            .attr("width", width + calculateMargin().left + calculateMargin().right)
            .attr("height", height + calculateMargin().top + calculateMargin().bottom)
            .append("g")
            .attr("transform",
                "translate(" + calculateMargin().left + "," + calculateMargin().top + ")");

        var hours = data.map((d) => d.hour);
        hours = ["", ...hours];

        var x = d3.scale.ordinal().domain(hours)
            .rangeRoundBands([0, width + 25], 0);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0)
            .innerTickSize(-height + 50)
            .outerTickSize(0)
            .orient("bottom");

//        var y = d3.scale.linear().domain([0, d3.max(data, (d) => d.total)])
//            .rangeRound([height, 0]);

        var distinctCategories = distinctArray(data.map((d) => d.category)).reverse();
        distinctCategories = ["", ...distinctCategories];

        var y = d3.scale.ordinal()
            .domain(distinctCategories)
            .rangePoints([height, 50]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0)
            .outerTickSize(0)
            .innerTickSize(-width + 20)
            .orient("left");

        var opacity = d3.scale.sqrt()
            .domain([d3.min(data, (d) => d.Index), d3.max(data, (d) => d.Index)])
            .range([0.8, .8]);

//        var color = d3.scale.category20();

        var color = d3.scale.ordinal()
            .range(["#000000", "#F04E98", "#E3E934", "#A438A8", "#6ACEB9"]);

        const indexValues = [
            0, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5
        ];

        const indexRadius = [
            0, 3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 20.0, 24.0
        ];

        const indexName = [
            "Below 100", "100 -150", "150 -200", "200 -250", "250 -300", "300 -350",
            "350 -400", "400 -450", "450 -500", "Above 500"
        ];


        var radiusScale = d3.scale.ordinal()
            .domain(indexValues)
            .range(indexRadius);

        var indexNameScale = d3.scale.ordinal()
            .domain(indexValues)
            .range(indexName);

        const tip = d3.tip()
            .attr('class', 'd3-tip')
            .style("visibility", "visible")
            .offset([-20, 0])
            .html(function (d) {
                return "Index Value:  <span style='color:blueviolet'>"
                       + d.Index
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(-23," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", margin.top / 2.5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill-opactiy", "1")
            .style("font-weight", "bold")
            .text("Industry Market-Volume Index");

        tip(svg.append("g"));

        svg.selectAll("circle")
            .data(data)
            .enter()
            .insert("circle")
            .attr("opacity", (d) => opacity(d.Index))
            .attr("r", (d) => radiusScale(d.Index) *1.5)
            .style("fill", (d) => color((d.category)))
            .on('mouseover', function (d, i) {

                tip.show(d, i);

                var colorhex = color(d.Index);
                var chophash = colorhex.substr(1);

            })

            .on('mouseout', function (d, i) {
                tip.hide(d, i);
            })

            .transition()
            .attr("cx", (d) => {
                return (x(d.hour) - 5).toString()
            })
            .attr("cy", (d) => {
                return y(d.category).toString()
            })
            .ease("bounce");

        var legend = svg.append('g')
            .attr("class", "legend")
            .attr("transform", "translate(725,70)");

        var legendRect = legend
            .selectAll('g')
            .data(indexValues.filter(s => s !== 0));

        legendRect.enter()
            .append("g")
            .append("text")
            .text("Index Values")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .attr("transform", 'translate(0, -20)');

        var legendRectE = legendRect.enter()
            .append("g")
            .attr("transform", function (d, i) {
                return 'translate(0, ' + (i * 35) + ')';
            });

        legendRectE
            .insert("circle")
            .attr("r", function (d) {
                return radiusScale(d) * .75;
            })
            .style("fill", function (d) {
                return "#d3d3d3";
            });

        legendRectE
            .append("text")
            .attr("x", 25)
            .attr("y", 5)
            .text(d => indexNameScale(d));

    }

    function activate2() {

        const parsedStreamJson = (d) => d.split("\n").filter(s => s.length > 0)
            .map((s) => JSON.parse(s));


        d3.text("bubbleChartData/bubbleMatrixData.txt", (d) => parseData(parsedStreamJson(d)));

    }

})();

