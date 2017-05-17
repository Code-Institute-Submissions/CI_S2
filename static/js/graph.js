queue()
   .defer(d3.json, "/regfemicidios/project")
   .defer(d3.json, "static/geojson/argeo.json")
   .await(makeGraphs);
 
function makeGraphs(error, projectsJson) {

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


   //Grupos
   var all = ndx.groupAll();
   var dateGroup = dateDim.group();
   var genderTypeGroup = genderTypeDim.group();
   var agressionTypeGroup = agressionTypeDim.group();
   var victimTypeGroup = victimTypeDim.group();
   var stateGroup = stateDim.group();
   var total = ndx.groupAll().reduceSum(function(d) {return d["numero"];});
   var ageGroup = ageDim.group();
   var year_total = yearDim.group();



   var minDate = dateDim.bottom(1)[0]["fecha_hecho"];
   var maxDate = dateDim.top(1)[0]["fecha_hecho"];


   //Graficos
   var totalND = dc.numberDisplay("#total");
   var genderTypeChart = dc.pieChart("#gender-type-pie-chart");
   var timeChart = dc.lineChart("#time-chart");
   var selectField = dc.selectMenu('#menu-select');
   var agressionTypeChart = dc.rowChart("#agression-type-row-chart");
   var victimTypeChart = dc.pieChart("#victim-type-pie-chart");
   var ageChart = dc.barChart("#age-Chart");
   var stateChart = dc.rowChart("#state-chart");


totalND
    .formatNumber(d3.format("d"))
    .valueAccessor(function (d) { return d;})
    .group(all)
    .formatNumber(d3.format(".0"));


genderTypeChart
   .ordinalColors(["#26547C", "#EF476F", "#FFD166", "#06D6A0"])
   .width(400)
   .height(250)
   .dimension(genderTypeDim)
   .group(genderTypeGroup)
   .renderLabel(false)
   .legend(dc.legend().x(-5).y(1).itemHeight(13).gap(5))
   .transitionDuration(500);


timeChart
   .ordinalColors(["#ffb725"])
   .width(800)
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


selectField
   .dimension(yearDim)
   .group(year_total);


agressionTypeChart
   .ordinalColors(["#644536", "#B2675E", "#C4A381", "#BBD686", "#EDF28E"])
   .width(370)
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
   .width(350)
   .height(350)
   .dimension(victimTypeDim)
   .group(victimTypeGroup)
   .innerRadius(70)
   .renderLabel(false)
   .legend(dc.legend().x(140).y(155).itemHeight(13).gap(5))
   .transitionDuration(300);


stateChart
    .ordinalColors(["#C6C5B9", "#62929E"])
    .width(300)
    .height(800)
    .dimension(stateDim)
    .group(stateGroup)
    .xAxis()
    .ticks(6);


ageChart
    .width(800)
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

//
   dc.renderAll();
}