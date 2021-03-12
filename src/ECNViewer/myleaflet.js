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
  let layer = {}
  const mc = document.createElement('div')
  //mymap is leaflet example
  let mymap = L.map(mc, {
    center: props.center,
    zoom: props.zoom,
    zoomDelta: 0.5,
    fullscreenControl: false,
    zoomControl: true,
    attributionControl: false
  });
  // setPosation(props.posation)
  //this useEffect replace componentDidUpdate
  React.useEffect(() => {
    if (!flag.current) {
      flag.current = true
    } else {
      if (!initFlag) {
        let mpurl = props.mymapurl.filter(a => {
          if (a != undefined) {
            console.error(a)
            return a
          }
        })
        console.log(mpurl[0])
        // console.log(newlayer)
        mymap.removeLayer(newlayer);
        mymap.eachLayer(function (layer) {
          console.log(layer)
        });
        L.tileLayer(mpurl[0].url, {
          attribution: 'OSM',
          subdomains: mpurl[0].subdomains
        }).addTo(mymap);
        mymap.invalidateSize()
        mymap.eachLayer(function (layer) {
          console.log(layer)
        });
      }
    }
  })
  //this useEffect replace componentDidmount
  useEffect(() => {
    document.querySelector('#mapid').append(mc)
    console.log('!!!!!!')
    layer = L.tileLayer("//mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}", {
      attribution: 'OSM',
      subdomains: ['a', 'b', 'c']
    })
    layer.addTo(mymap);
    mymap.invalidateSize()
    setNewlayer(layer)
    if (!initFlag) {
      console.error('myleaft')
      console.error(props.position)
    }
    setInitFlag(false)
    // L.marker(props.position,{icon: iconInstance}).addTo(mymap);
    // L.marker(props.position[0]).addTo(mymap);
    props.getfun(mymap)
    props.mcstate(true)
  }, [])
  return (
    <div id='mapid' style={mymapcss}>
      {props.children}
    </div>
  )
}
