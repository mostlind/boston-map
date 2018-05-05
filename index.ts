import { geoMercator, geoPath, geoCentroid, geoCircle } from "d3-geo";
import { select, mouse } from "d3-selection";
import { hsl } from "d3-color";
import "d3-transition";
import { feature } from "topojson";
//@ts-ignore
import topoData from "./geodata/*.topo.json";
//@ts-ignore
// import geoData from "./geodata/*.geo.json";

console.log(topoData);

const center: [number, number] = [-71.080913, 42.367843];
const width = window.innerWidth;
const height = window.innerHeight;

const projection = geoMercator()
  .scale(450000)
  .center(center)
  .translate([width / 2, height / 2]);

const path = geoPath().projection(projection);

const map = select("svg")
  .attr("width", width)
  .attr("height", height);

const mapLayer = map.append("g").classed("map-layer", true);
const waterLayer = map.append("g").classed("water-layer", true);
const roadLayer = map.append("g").classed("road-layer", true);
const transportLayer = map.append("g").classed("transport-layer", true);
const poiLayer = map.append("g").classed("poi-layer", true);

mapLayer
  .selectAll("path")
  .data(feature(topoData.massPoly, topoData.massPoly.objects.massPoly).features)
  .enter()
  .append("path")
  .attr("d", path)
  .style("stroke", "#777")
  .style("stroke-width", 1)
  .attr("vector-effect", "non-scaling-stroke")
  .style("fill", "#ddd");

waterLayer
  .selectAll("path")
  .data(
    feature(topoData.massWater, topoData.massWater.objects.massWater).features
  )
  .enter()
  .append("path")
  .attr("d", path)
  .style("fill", "#78b");

roadLayer
  .selectAll("path")
  .data(
    feature(
      topoData.massRoadsMajor,
      topoData.massRoadsMajor.objects.massRoadsMajor
    ).features
  )
  .enter()
  .append("path")
  .attr("d", path)
  .attr("stroke", "#999")
  .attr("stroke-width", 1)
  .attr("vector-effect", "non-scaling-stroke")
  .attr("fill", "transparent");

// Draw subway lines
transportLayer
  .selectAll("path")
  .data(
    feature(topoData.mbtaLines, topoData.mbtaLines.objects.mbtaLines).features
  )
  .enter()
  .append("path")
  .attr("d", path)
  .attr("stroke", d => d.properties.LINE)
  .attr("stroke-width", 5)
  .attr("stroke-opacity", 0.6)
  .attr("stroke-dasharray", 10)
  .attr("vector-effect", "non-scaling-stroke")
  .attr("fill", "transparent");

transportLayer
  .selectAll("circle")
  .data(
    feature(topoData.mbtaStations, topoData.mbtaStations.objects.mbtaStations)
      .features
  )
  .enter()
  .append("circle")
  .attr("cx", d => projection(d.geometry.coordinates)[0])
  .attr("cy", d => projection(d.geometry.coordinates)[1])
  .attr("r", "6px")
  .attr("fill", d => d.properties.LINE)
  .attr("stroke", "#333")
  .attr("stroke-width", 3)
  .style("cursor", "pointer")
  .on("click", function(d) {
    console.log(d);
    const mousePos = mouse(this);
    select(".tooltip")
      .style(
        "transform",
        `translate(${mousePos[0] + 20}px, ${mousePos[1] + 20}px)`
      )
      .style("border", `5px solid ${d.properties.LINE}`)
      .html(
        `
        <h3>Station: ${d.properties.STATION}</h3>
        <p>Route: ${d.properties.ROUTE}</p>
      `
      )
      .on("click", () => {
        select(".tooltip")
          .style("pointer-events", "none")
          .transition()
          .duration(200)
          .style("opacity", 0);
      });
    select(".tooltip")
      .style("pointer-events", "initial")
      .transition()
      .duration(200)
      .style("opacity", 1);
  });
