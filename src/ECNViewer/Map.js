import React from 'react'
import _ from 'lodash'

import GoogleMapReact from 'google-map-react'

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
    borderRadius: '50% 50% 50% 0',
    border: '2px solid var(--markerColor, #00C0A9)',
    transform: 'rotate(-45deg)',
    '& .MuiSvgIcon-root': {
      transform: 'rotate(-45deg)'
    }
  },
  mapWrapper: {
    border: '1px',
    width: '100%',
    height: '100%',
    borderColor: '#ACB5C6'
  }
})

const hasValidCoordinates = (coordinates) => {
  return _.isFinite(coordinates[0]) && _.isFinite(coordinates[1])
}

export default function Map (props) {
  const classes = useStyles()
  const { controller, agent, setAgent, msvcsPerAgent, map } = props
  return (
    <div className={classes.mapWrapper}>
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
