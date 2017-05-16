queue()
   .defer(d3.json, "/regfemicidios/project")
   .defer(d3.json, "static/geojson/argeo.json")
   .await(makeGraphs);
 
function makeGraphs(error, projectsJson, statesJson) {

   //projectsJson
   var femicidios = projectsJson;
   var dateFormat = d3.time.format("%d/%m/%Y");
   femicidios.forEach(function (d) {
       d["fecha_hecho"] = dateFormat.parse(d["fecha_hecho"]);
       d["fecha_hecho"].setDate(1);
       d["numero"] = +d["numero"];
   });

   var ndx = crossfilter(femicidios);


 
   //Dimenciones
   var dateDim = ndx.dimension(function (d) {
       return d["fecha_hecho"];
   });
   var genderTypeDim = ndx.dimension(function (d) {
       return d["identidad_genero"];
   });
   var agressionTypeDim = ndx.dimension(function (d) {
       return d["modalidad_comisiva"];
   });
   var victimTypeDim = ndx.dimension(function (d) {
       return d["tipo_victima"];
   });
   var stateDim = ndx.dimension(function (d) {
       return d["lugar_hecho"];
   });
    var ageDim = ndx.dimension(function (d) {
    return d["edad"];
    });

   var yearDim  = ndx.dimension(function(d) {return +d["fecha_hecho"].getFullYear();});



   var all = ndx.groupAll();
   var dateGroup = dateDim.group();
   var genderTypeGroup = genderTypeDim.group();
   var agressionTypeGroup = agressionTypeDim.group();
   var victimTypeGroup = victimTypeDim.group();
   var stateGroup = stateDim.group();
   var total = ndx.groupAll().reduceSum(function(d) {return d["numero"];});
   var totalByState = stateDim.group().reduceSum(function (d) {return d["numero"];});
   var ageGroup = ageDim.group();
   var year_total = yearDim.group();





   //Define values (to be used in charts)
   var minDate = dateDim.bottom(1)[0]["fecha_hecho"];
   var maxDate = dateDim.top(1)[0]["fecha_hecho"];
   // var maxState = totalByState.top(1)[0].value;
   //




   //Graficos
   var totalND = dc.numberDisplay("#total");
   var genderTypeChart = dc.pieChart("#gender-type-pie-chart");
   var timeChart = dc.lineChart("#time-chart");
   var agressionTypeChart = dc.rowChart("#agression-type-row-chart");
   var victimTypeChart = dc.pieChart("#victim-type-pie-chart");
   var ageChart = dc.barChart("#age-Chart");

   // var mapChart = dc.geoChoroplethChart("#map-chart");
   var stateChart = dc.rowChart("#state-chart");
   var datatable = dc.dataTable("#data-table");



totalND
    .formatNumber(d3.format("d"))
    .valueAccessor(function (d) { return d;})
    .group(all)
    .formatNumber(d3.format(".0"));


genderTypeChart
   .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
   .width(450)
   .height(250)
   .dimension(genderTypeDim)
   .group(genderTypeGroup)
   .renderLabel(false)
   .legend(dc.legend().x(0).y(1).itemHeight(13).gap(5))
   .transitionDuration(500);


timeChart
   .ordinalColors(["#ff2d17"])
   .width(900)
   .height(250)
   .margins({top: 10, right: 50, bottom: 30, left: 50})
   .dimension(dateDim)
   .group(dateGroup)
   .renderArea(true)
   .renderHorizontalGridLines(true)
   .renderVerticalGridLines(true)
   .transitionDuration(500)
   .elasticX(true)
   .elasticY(true)
   .x(d3.time.scale().domain([minDate, maxDate]))
   .round(d3.time.month.round)
   .xUnits(d3.time.months)
   .brushOn(false)
   .xAxisLabel("Fecha")
   .yAxisLabel("Denuncias")
   .xAxis().tickFormat(function(v) {return dateFormat(v)});


selectField = dc.selectMenu('#menu-select')
   .dimension(yearDim)
   .group(year_total);


agressionTypeChart
   .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
   .width(410)
   .height(300)
   .dimension(agressionTypeDim)
   .group(agressionTypeGroup)
   .renderLabel(true)
    .title(function(d){return d.value;})
    .elasticX(true)
   .data(function(d) {return d.top(5);})
   .xAxis().ticks(4);


victimTypeChart
   .ordinalColors(["#42FF76", "#FFB725"])
   .width(300)
   .height(300)
   .dimension(victimTypeDim)
   .group(victimTypeGroup)
   .innerRadius(60)
   .renderLabel(false)
   .legend(dc.legend().x(125).y(135).itemHeight(13).gap(5))
   .transitionDuration(300);

// mapChart
//     .width(500)
//     .height(800)
//     .dimension(stateDim)
//     .group(stateGroup)
//     .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
//     // .colorDomain([0, maxState])
//     .overlayGeoJson(statesJson["features"], "state", function (d) {
//         return d.properties.name;
//     })
//     .projection(d3.geo.mercator().scale(10).center([-60, -35])
//     .translate([340, 150]));


stateChart
    .ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
    .width(300)
    .height(500)
    .dimension(stateDim)
    .group(stateGroup)
    .xAxis()
    .ticks(4);
    // .width(800)
    // .height(180)
    // .margins({top: 10, right: 50, bottom: 30, left: 40})
    // .dimension(stateDim)
    // .group(stateGroup)
    // .elasticY(true)
    // .centerBar(true)
    // .gap(1)
    // .round(dc.round.floor)
    // .alwaysUseRounding(true)
    // .x(d3.scale.linear().domain([-25, 25]))
    // .renderHorizontalGridLines(true);
    // .filterPrinter(function (filters) {
    //         var filter = filters[0], s = '';
    //         s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
    //         return s;
    //     })
    // .xAxis().tickFormat(
    //     function (v) { return v + '%'; })
    // .yAxis().ticks(5);


ageChart
    .width(900)
    .height(200)
    .margins({top: 10, right: 50, bottom: 30, left: 40})
    .dimension(ageDim)
    .group(ageGroup)
    .elasticY(true)
    .centerBar(true)
    .brushOn(true)
    .round(dc.round.floor)
    .alwaysUseRounding(true)
    .x(d3.scale.linear().domain([0,90]))
    .renderHorizontalGridLines(true)
    .xAxisLabel("Edad")
    .xAxis().ticks(50);

datatable
    .dimension(total)
    .group(totalByState);
// create the columns dynamically
//     .columns([
//         function (d) {
//                 return d["State"];
//         },
//         function (d) {
//                 return d["edad"];
//         },
//         function (d) {
//                 return d["modalidad_comisiva"];
//         },
//     ]);



//
   dc.renderAll();
}