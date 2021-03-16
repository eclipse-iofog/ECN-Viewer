import React from 'react'
import L from 'leaflet'
import { useState, useEffect } from 'react'
// import { TileLayer } from './TileLayer'
// import { Height } from '@material-ui/icons'
const mymapcss = {
  height: "100vh"
}
export function MapContainer(props) {
  // const [posation,setPosation] = useState([]);
  const [initFlag, setInitFlag] = useState(true)
  const flag = React.useRef(null)
  const [newlayer, setNewlayer] = useState(0)
  //props camefrom  the father component
  console.log(props)
  //this useEffect replace componentDidUpdate
  console.log(props.position)
  React.useEffect(() => {
    if (!flag.current) {
      flag.current = true
    } else {
      if (!initFlag) {
      }
    }
  })
  //this useEffect replace componentDidmount
  useEffect(() => {

    //change map document link https://leafletjs.com/examples/layers-control/
    console.log('!!!!!!')
    var container = L.DomUtil.get('map')
    if (container != null) {
      container._leaflet_id = null;
    }
    var container = L.DomUtil.get('map')
    var allcity = props.position.map(a => {
      return L.marker(a)
    })
    var cities = L.layerGroup(...allcity);
    var grayscale = L.tileLayer("//mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}", { id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: "Google" });
    var Geoq = L.tileLayer("//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}", { id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: "Geoq" });
    var streets = L.tileLayer("//{s}.tile.osm.org/{z}/{x}/{y}.png", { id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: "osm" });
    var map = L.map('map', {
      center: props.center,
      zoom: props.zoom,
      layers: [grayscale, cities]
    });
    var baseMaps = {
      "Google": grayscale,
      "OSM": streets,
      "Geoq":Geoq
    };
    var overlayMaps = {
      "Cities": cities
    };
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    var baseMaps = {
      "<span style='color: gray'>Grayscale</span>": grayscale,
      "Streets": streets
    };
    props.getfun(map)
    props.mcstate(true)
    setInitFlag(false)
  }, [])
  return (
    <div id='map' style={mymapcss}>
      {props.children}
    </div>
  )
}
