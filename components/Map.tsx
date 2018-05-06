import * as React from "react";

import { geoMercator, geoPath, geoCentroid, geoCircle } from "d3-geo";
import { select, mouse, event } from "d3-selection";
import { zoom } from "d3-zoom";
import { hsl } from "d3-color";
import "d3-transition";
import { feature } from "topojson";
//@ts-ignore
import topoData from "../geodata/*.topo.json";

import MapInfo from "./MapInfo";

const center: [number, number] = [-71.080913, 42.367843];
const width = window.innerWidth;
const height = window.innerHeight;

const description = `

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dignissim ipsum nec nisl ultrices faucibus. Maecenas auctor elementum varius. Praesent non maximus risus, at eleifend ex. Pellentesque et sodales elit, in iaculis nisl. Nulla accumsan, ex sit amet scelerisque posuere, enim quam finibus ex, ut posuere ex ligula sed mi. Mauris quis facilisis ipsum. Donec tincidunt mi sed pretium dapibus. Nulla finibus lorem in auctor laoreet. Etiam at mauris id ante luctus blandit quis in dolor. Cras eu fermentum ante.

Donec auctor leo cursus elementum aliquam. Pellentesque enim enim, fermentum et bibendum vitae, luctus a ante. Pellentesque sit amet molestie quam. Suspendisse tincidunt et tellus quis elementum. Praesent id efficitur orci. Donec non est et nisl aliquet euismod id at purus. Cras placerat ultrices tristique. Donec placerat tempus lorem, sit amet luctus mauris fermentum non. Ut sed ligula venenatis, tincidunt urna nec, aliquam odio. Donec in mollis diam.

Donec mattis porta nisi id venenatis. Etiam mauris sapien, consequat at lacus eu, feugiat tristique sem. Nunc malesuada nulla eros, et ullamcorper ex luctus non. Mauris quis ultricies nisl, sit amet fringilla nisl. Mauris pretium metus a tellus congue, consequat semper eros pretium. Nunc nibh velit, pretium non aliquam eget, vestibulum quis risus. Mauris a turpis augue. Maecenas nulla quam, egestas vitae posuere pellentesque, condimentum sed nunc. Sed ullamcorper metus ut tristique scelerisque. Maecenas eleifend finibus justo, ac molestie diam vehicula nec. Curabitur sagittis ac orci ut vestibulum. Quisque rhoncus lorem efficitur felis aliquam volutpat at ut quam. Morbi eu condimentum nunc. Etiam et ex sit amet ex aliquam tincidunt vitae in mauris. Pellentesque at tempor libero.

Sed a posuere purus. Cras elit ante, fringilla sed dignissim sed, eleifend id metus. In hac habitasse platea dictumst. Nulla eu viverra augue. Integer ut accumsan lectus, nec hendrerit purus. Proin sollicitudin pellentesque mi a consectetur. Etiam quis hendrerit orci. Aliquam ligula urna, pellentesque et arcu in, efficitur auctor arcu. Cras sit amet risus fringilla, ullamcorper ex at, ullamcorper purus. Donec vehicula lobortis metus, sit amet volutpat orci. In eu pellentesque massa. In hac habitasse platea dictumst. Pellentesque placerat, eros et convallis mollis, lorem velit dictum eros, quis varius ligula massa ac orci. Pellentesque placerat, nibh eget molestie condimentum, purus tortor dictum elit, eu feugiat risus urna non lacus. Maecenas vel turpis diam.

Praesent felis nunc, venenatis quis erat sit amet, ultricies tristique ex. Maecenas pretium non est vel iaculis. Praesent consectetur gravida eleifend. Aenean lobortis augue ut pulvinar vehicula. Donec eget ullamcorper nibh. Nunc eu leo vel diam pulvinar eleifend. Fusce vehicula ac lorem in commodo. Etiam ultrices accumsan est, non pretium diam convallis ac. Nunc nec lacinia ipsum. Proin ac sem ac nibh hendrerit suscipit ac ac mi. `;

class Map extends React.Component {
  mapRef = null;
  width = 0;
  height = 0;
  state = {
    info: {
      name: ""
    }
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    const createMap = () => {
      const bbox: ClientRect = this.mapRef.current.getBoundingClientRect();
      this.height = bbox.height;
      this.width = bbox.width;

      this.drawMap(this.mapRef.current);
    };

    window.addEventListener("resize", createMap);
    createMap();
  }

  drawMap(ref) {
    const projection = geoMercator()
      .scale(450000)
      .center(center)
      .translate([this.width / 2, this.height / 2]);

    const path = geoPath().projection(projection);

    const map = select(ref)
      .attr("width", this.width)
      .attr("height", this.height);

    function zoomed() {
      const { x, y, k } = event.transform;
      map.attr("transform", `translate(${x}, ${y})scale(${k})`);
    }

    const zoomBehavior = zoom()
      .scaleExtent([1, 4])
      .on("zoom", zoomed);

    console.log(zoomBehavior);

    map.call(zoomBehavior);

    this.drawMapLayer(map, path);
    this.drawWaterLayer(map, path);
    this.drawRoadLayer(map, path);
    this.drawTransportLayer(map, path, projection);
    this.drawPoiLayer(map, path, projection);
  }

  drawMapLayer(map, path) {
    const mapLayer = map.append("g").classed("map-layer", true);
    mapLayer
      .selectAll("path")
      .data(
        feature(topoData.massPoly, topoData.massPoly.objects.massPoly).features
      )
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#777")
      .style("stroke-width", 1)
      .attr("vector-effect", "non-scaling-stroke")
      .style("fill", "#ddd");
  }

  drawWaterLayer(map, path) {
    const waterLayer = map.append("g").classed("water-layer", true);
    waterLayer
      .selectAll("path")
      .data(
        feature(topoData.massWater, topoData.massWater.objects.massWater)
          .features
      )
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "#78b");
  }

  drawRoadLayer(map, path) {
    const roadLayer = map.append("g").classed("road-layer", true);
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
  }

  // Draw subway lines
  drawTransportLayer(map, path, projection) {
    const transportLayer = map.append("g").classed("transport-layer", true);
    transportLayer
      .selectAll("path")
      .data(
        feature(topoData.mbtaLines, topoData.mbtaLines.objects.mbtaLines)
          .features
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
        feature(
          topoData.mbtaStations,
          topoData.mbtaStations.objects.mbtaStations
        ).features
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
      .on("click", d => {
        console.log(d);
        this.setState({
          info: {
            name: d.properties.STATION,
            description,
            coords: d.geometry.coordinates
          }
        });
      });
  }

  drawPoiLayer(map, path, projection) {
    const poiLayer = map.append("g").classed("poi-layer", true);
  }

  render() {
    return [
      <svg className="map" ref={this.mapRef} />,
      <MapInfo info={this.state.info} />
    ];
  }
}

export default Map;
