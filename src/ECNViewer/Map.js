import React from 'react'
import { isFinite, get } from 'lodash'

import GoogleMapReact from 'google-map-react'
import { fitBounds } from 'google-map-react/utils'

import { Badge, Avatar } from '@material-ui/core'

import MemoryIcon from '@material-ui/icons/Memory'
import CtrlIcon from '@material-ui/icons/DeveloperBoard'

import { makeStyles } from '@material-ui/styles'

import { statusColor, msvcStatusColor } from './utils'

const useStyles = makeStyles({
  mapMarkerTransform: {
    transform: 'translate(-50%, -100%)',
    position: 'absolute'
  },
  msvcBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: 'var(--color, #5064EC)'
    }
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
  return isFinite(coordinates[0]) && isFinite(coordinates[1])
}

export default function Map (props) {
  const classes = useStyles()
  const DomElementRef = React.useRef()
  const { controller, agent, setAgent, msvcsPerAgent, map, autozoom } = props

  const setMap = () => {
    const bounds = new window.google.maps.LatLngBounds() // need handler incase `google` not yet available

    const agents = (controller.agents || []).filter(a => hasValidCoordinates([a.latitude, a.longitude]))

    if (!agents.length) {
      map.center = [get(controller, 'info.location.lat', 0), get(controller, 'info.location.lon', 0)]
      map.zoom = 9
      return
    }

    agents.forEach(marker => {
      bounds.extend(new window.google.maps.LatLng(get(marker, 'latitude', 0), get(marker, 'longitude', 0)))
    })

    bounds.extend(new window.google.maps.LatLng(get(controller, 'info.location.lat', 0), get(controller, 'info.location.lon', 0)))

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
      width: get(DomElementRef, 'current.offsetWidth', 600),
      height: get(DomElementRef, 'current.offsetHeight', 800)
    }

    const { center, zoom } = fitBounds(newBounds, size)
    map.center = center
    map.zoom = zoom
  }

  if (autozoom && window.google) {
    setMap()
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
            <Badge color='primary' style={{ '--color': msvcStatusColor[a.daemonStatus] }} badgeContent={(msvcsPerAgent[a.uuid] || []).filter(m => m.flowActive).length} invisible={a.uuid !== agent.uuid} className={`${classes.msvcBadge}`}>
              <Avatar
                style={{ '--markerColor': statusColor[a.daemonStatus] }}
                className={classes.mapMarker}>
                <MemoryIcon />
              </Avatar>
            </Badge>
          </div>
        )}
        {controller.info && hasValidCoordinates([controller.info.location.lat, controller.info.location.lon]) && <Avatar
          lat={controller.info.location.lat}
          lng={controller.info.location.lon}
          style={{ '--markerColor': '#7A3BFF' }}
          className={classes.mapMarker}>
          <CtrlIcon />
        </Avatar>}
      </GoogleMapReact>
    </div>
  )
}
