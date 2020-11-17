import React from 'react'

// import GoogleMapReact from 'google-map-react'
import { Map as Bmap, APILoader } from '@uiw/react-baidu-map';

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
      <APILoader akay="49esR3pMIKNz2no4Io15KFWh0P7GSLug">
        <Bmap />
      </APILoader>
    </div>
  )
}
