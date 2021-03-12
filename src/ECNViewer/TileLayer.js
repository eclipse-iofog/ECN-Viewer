import L from 'leaflet'
export  function TileLayer(props) {
    console.error("!!!!!!!!")
    console.log(props)
   const NewtileLayer= L.tileLayer(props.url, {
          attribution:props.key,
          maxZoom: 15,
          minZoom: 10,
          subdomains:props.subdomains
        }).addTo(props.mInstances);
        return null
}

