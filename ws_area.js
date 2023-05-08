
// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("ws_area")
    .append("svg2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("work-stoppages-annual-clean.csv",

    // When reading the csv, I must format variables:
    function (d) {
        return { year: d3.timeParse("%Y")(d.year), work_stoppage_in_effect: d.work_stoppage_in_effect }
    }).then(

        // Now I can use this dataset:
        function (data) {

            // Add X axis --> it is a date format
            const x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return d.year; }))
                .range([4, width]);
            svg2.append("g")
                .attr("class", "grid")
                .attr("transform", `translate(0, ${height + 5})`)
                .call(d3.axisBottom(x)
                    .tickSize(-height, 0)
                    //.tickFormat("")
                    //.tickPadding(10)
                );

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return +d.work_stoppage_in_effect; })])
                .range([height, 0]);
            svg2.append("g")
                .call(d3.axisLeft(y));


            // Add the area
            svg2.append("path")
                .datum(data)
                .attr("fill", "#5ec962")
                .attr("fill-opacity", 0.05)
                .attr("stroke", "#none")
                .attr("d", d3.area()
                    //.curve(d3.curveCardinal)
                    .x(function (d) { return x(d.year) })
                    .y0(y(0))
                    .y1(function (d) { return y(d.work_stoppage_in_effect) })
                )

            svg2.append("text")
                .attr("text-anchor", "end")
                .attr("x", -margin.top - 125)
                .attr("y", -margin.left + 20)
                .attr("transform", "rotate(-90)")
                .attr("fill", "black")
                .attr("class", "label")
                .text("Number of Work Stoppages");

            // Add the line
            svg2.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#5ec962")
                .attr("stroke-width", 3)
                .attr("d", d3.line()
                    .x(d => x(d.year))
                    .y(d => y(d.work_stoppage_in_effect))
                )

        })