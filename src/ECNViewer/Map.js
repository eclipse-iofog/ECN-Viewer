import React from 'react'

import GoogleMapReact from 'google-map-react'

import { Avatar } from '@material-ui/core'

import CtrlIcon from '@material-ui/icons/DeveloperBoard'
import Icon from '@material-ui/core/Icon'

import { makeStyles, useTheme } from '@material-ui/styles'

import { statusColor, tagColor } from './utils'
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
    },
    width: '50px',
    height: '50px',
    fontSize: 24
  },
  mapWrapper: {
    width: '172%',
    height: '100%',
    position: 'fixed',
    top: 0,
    '@media (min-width: 1200px)': {
      width: '155%'
    }
  },
  selectedMarker: {
    zIndex: 2,
    fontSize: 32,
    width: '80px',
    height: '80px'
  },
  selectedMarkerTransform: {
    zIndex: 2,
    '& $erContainer': {
      width: '30px',
      height: '30px',
      '& .MuiIcon-root': {
        fontSize: 16
      }
    }
  },
  erContainer: {
    backgroundColor: tagColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2px',
    padding: '4px',
    borderRadius: '100%',
    zIndex: 3,
    width: '20px',
    height: '20px',
    '& .MuiIcon-root': {
      fontSize: 14
    },
    color: 'white'
  }
}))

export default function Map (props) {
  const classes = useStyles()
  const theme = useTheme()
  const { controller, setAgent, loading, agent: selectedAgent } = props
  const { map, mapRef, hasValidCoordinates } = useMap()

  return (
    <div className={[classes.mapWrapper, 'mui-fixed'].join(' ')} ref={mapRef}>
      <GoogleMapReact
        {...map}
        bootstrapURLKeys={{
          key: 'AIzaSyChp_fUXiK05ulRl_ewRGKWsQ1k0ULIFkA'
        }}
      >
        {(loading ? [] : controller.agents).filter(a => hasValidCoordinates([a.latitude, a.longitude])).map(a =>
          <div
            id={a.name}
            key={a.uuid}
            lat={a.latitude} lng={a.longitude}
            className={[classes.mapMarkerTransform, selectedAgent && a.uuid === selectedAgent.uuid ? classes.selectedMarkerTransform : ''].join(' ')}
            onClick={() => setAgent(a)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                style={{ '--markerColor': statusColor[a.daemonStatus] }}
                className={[classes.mapMarker, selectedAgent && a.uuid === selectedAgent.uuid ? classes.selectedMarker : ''].join(' ')}
              >
                {/* <MemoryIcon style={{ fontSize: 32 }} /> */}
                <div style={{ transform: 'rotate(45deg)' }}>{[...a.name.split('-').map(e => e[0])].join('').toUpperCase()}</div>
              </Avatar>
              <div style={{ display: 'flex', position: 'absolute', bottom: -8 }}>
                {a.tags && a.edgeResources.map(t => t.display ? (t.display.icon ? <div key={`${t.name}${t.version}`} className={classes.erContainer}><Icon title={t.display.name || t.name} key={t.display.name || t.name}>{t.display.icon}</Icon></div> : null) : null)}
              </div>

            </div>
          </div>
        )}
        {!loading && controller.info && hasValidCoordinates([controller.info.location.lat, controller.info.location.lon]) &&
          <Avatar
            lat={controller.info.location.lat}
            lng={controller.info.location.lon}
            style={{ '--markerColor': theme.colors.purple }}
            className={classes.mapMarker}
          >
            <CtrlIcon style={{ fontSize: 32 }} />
          </Avatar>}
      </GoogleMapReact>
    </div>
  )
}
