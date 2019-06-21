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
    backgroundColor: 'var(--markerColor, #ACB5C6)',
    borderRadius: '50% 50% 50% 0',
    border: '4px solid var(--markerColor, #ACB5C6)',
    transform: 'rotate(-45deg)',
    '& .MuiSvgIcon-root': {
      transform: 'rotate(-45deg)'
    }
  }
})

export default function Map (props) {
  const classes = useStyles()
  const { controller, agent, setAgent, msvcsPerAgent, map } = props
  return (
    <GoogleMapReact
      {...map}
      bootstrapURLKeys={{
        key: 'AIzaSyChp_fUXiK05ulRl_ewRGKWsQ1k0ULIFkA'
      }}
    >
      {controller.agents.filter(a => (_.isFinite(a.latitude) && _.isFinite(a.longitude))).map(a =>
        <div
          lat={a.latitude} lng={a.longitude}
          className={classes.mapMarkerTransform}
          onClick={() => setAgent(a)}
        >
          <Badge color='primary' badgeContent={(msvcsPerAgent[a.uuid] || []).length} invisible={a.uuid !== agent.uuid} className={classes.margin}>
            <Avatar
              style={a.uuid === agent.uuid ? { '--markerColor': '#5064EC' } : {}}
              className={classes.mapMarker}>
              <MemoryIcon />
            </Avatar>
          </Badge>
        </div>
      )}
      <Avatar
        lat={controller.info.lat}
        lng={controller.info.lon}
        style={{ '--markerColor': '#7A3BFF' }}
        className={classes.mapMarker}>
        <CtrlIcon />
      </Avatar>
    </GoogleMapReact>
  )
}
