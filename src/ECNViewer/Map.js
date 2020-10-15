import React from 'react'

import GoogleMapReact from 'google-map-react'

import { Badge, Avatar } from '@material-ui/core'

import MemoryIcon from '@material-ui/icons/Memory'
import CtrlIcon from '@material-ui/icons/DeveloperBoard'
import Icon from '@material-ui/core/Icon'

import { makeStyles, useTheme } from '@material-ui/styles'

import { statusColor, msvcStatusColor, tagColor } from './utils'
import { useConfig } from '../providers/Config'
import { useMap } from '../providers/Map'

const useStyles = makeStyles(theme => ({
  mapMarkerTransform: {
    transform: 'translate(-50%, -100%)',
    position: 'absolute'
  },
  msvcBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: `var(--color, ${theme.colors.cobalt})`
    }
  },
  mapMarker: {
    backgroundColor: `var(--markerColor, ${theme.colors.success})`,
    borderRadius: '50% 50% 50% 0 !important',
    border: `2px solid var(--markerColor, ${theme.colors.success})`,
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
    borderColor: theme.colors.aluminium,
    '& div': {
      borderRadius: '4px',
      '& div': {
        borderRadius: '4px'
      }
    }
  }
}))

export default function Map (props) {
  const { getTagDisplayInfo } = useConfig()
  const classes = useStyles()
  const theme = useTheme()
  const { controller, agent, setAgent, msvcsPerAgent, loading } = props
  const { map, mapRef, hasValidCoordinates } = useMap()

  return (
    <div className={classes.mapWrapper} ref={mapRef}>
      <GoogleMapReact
        {...map}
        bootstrapURLKeys={{
          key: 'AIzaSyChp_fUXiK05ulRl_ewRGKWsQ1k0ULIFkA'
        }}
      >
        {(loading ? [] : controller.agents).filter(a => hasValidCoordinates([a.latitude, a.longitude])).map(a =>
          <div
            key={a.uuid}
            lat={a.latitude} lng={a.longitude}
            className={classes.mapMarkerTransform}
            onClick={() => setAgent(a)}
          >
            <Badge color='primary' style={{ '--color': msvcStatusColor[a.daemonStatus] }} badgeContent={(msvcsPerAgent[a.uuid] || []).filter(m => m.flowActive && m.status.status === 'RUNNING').length} invisible={a.uuid !== agent.uuid} className={`${classes.msvcBadge}`}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  style={{ '--markerColor': statusColor[a.daemonStatus] }}
                  className={classes.mapMarker}
                >
                  <MemoryIcon />
                </Avatar>
                <div style={{ display: 'flex', position: 'absolute', bottom: -15 }}>
                  {a.tags && a.tags.map(getTagDisplayInfo).map(t => t.icon ? <div style={{ backgroundColor: t.color || tagColor, margin: '2px', padding: '4px', borderRadius: '100%' }}><Icon key={t.name} style={{ fontSize: 16, color: 'white', marginBottom: -3 }}>{t.icon}</Icon></div> : null)}
                </div>

              </div>
            </Badge>
          </div>
        )}
        {!loading && controller.info && hasValidCoordinates([controller.info.location.lat, controller.info.location.lon]) &&
          <Avatar
            lat={controller.info.location.lat}
            lng={controller.info.location.lon}
            style={{ '--markerColor': theme.colors.argon }}
            className={classes.mapMarker}
          >
            <CtrlIcon />
          </Avatar>}
      </GoogleMapReact>
    </div>
  )
}
