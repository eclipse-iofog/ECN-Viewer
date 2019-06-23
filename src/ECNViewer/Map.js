import React from 'react'
import _ from 'lodash'

import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'

import { Badge, Avatar } from '@material-ui/core'

import MemoryIcon from '@material-ui/icons/Memory'
import CtrlIcon from '@material-ui/icons/DeveloperBoard'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  mapMarkerTransform: {
    transform: 'translate(-50%, -100%)',
    position: 'absolute'
  },
  mapMarker: {
    backgroundColor: 'var(--markerColor, #00C0A9)',
    borderRadius: '50% 50% 50% 0 !important',
    border: '2px solid var(--markerColor, #00C0A9)',
    transform: 'rotate(-45deg)',
    '& .MuiSvgIcon-root': {
      transform: 'rotate(-45deg)'
    }
  },
  mapWrapper: {
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    width: '100%',
    height: '100%',
    maxHeight: '700px',
    position: 'sticky',
    top: '25px',
    borderColor: '#ACB5C6',
    '& div': {
      borderRadius: '4px',
      '& div': {
        borderRadius: '4px'
      }
    }
  }
})

const hasValidCoordinates = (coordinates) => {
  return _.isFinite(coordinates[0]) && _.isFinite(coordinates[1])
}

export default function Map (props) {
  const classes = useStyles()
  const DomElementRef = React.useRef()
  const { controller, agent, setAgent, msvcsPerAgent, map, autozoom } = props

  if (autozoom && window.google) {
    const bounds = new window.google.maps.LatLngBounds() // need handler incase `google` not yet available

    const agents = controller.agents || []
    agents.forEach(marker => {
      bounds.extend(new window.google.maps.LatLng(marker.latitude, marker.longitude))
    })

    bounds.extend(new window.google.maps.LatLng(controller.info.lat, controller.info.lon))

    const newBounds = {
      ne: {
        lat: bounds.getNorthEast().lat(),
        lng: bounds.getNorthEast().lng()
      },
      sw: {
        lat: bounds.getSouthWest().lat(),
        lng: bounds.getSouthWest().lng()
      }
    }

    const size = {
      width: DomElementRef.current.offsetWidth,
      height: DomElementRef.current.offsetHeight
    }

    const { center, zoom } = fitBounds(newBounds, size)
    map.center = center
    map.zoom = zoom
  }

  return (
    <div className={classes.mapWrapper} ref={DomElementRef}>
      <GoogleMapReact
        {...map}
        bootstrapURLKeys={{
          key: 'AIzaSyChp_fUXiK05ulRl_ewRGKWsQ1k0ULIFkA'
        }}
      >
        {controller.agents.filter(a => hasValidCoordinates([a.latitude, a.longitude])).map(a =>
          <div
            key={a.uuid}
            lat={a.latitude} lng={a.longitude}
            className={classes.mapMarkerTransform}
            onClick={() => setAgent(a)}
          >
            <Badge color='primary' badgeContent={(msvcsPerAgent[a.uuid] || []).length} invisible={a.uuid !== agent.uuid} className={classes.margin}>
              <Avatar
                style={a.uuid === agent.uuid ? { '--markerColor': '#00C0A9' } : {}}
                className={classes.mapMarker}>
                <MemoryIcon />
              </Avatar>
            </Badge>
          </div>
        )}
        {controller.info && hasValidCoordinates([controller.info.lat, controller.info.lon]) && <Avatar
          lat={controller.info.lat}
          lng={controller.info.lon}
          style={{ '--markerColor': '#7A3BFF' }}
          className={classes.mapMarker}>
          <CtrlIcon />
        </Avatar>}
      </GoogleMapReact>
    </div>
  )
}
