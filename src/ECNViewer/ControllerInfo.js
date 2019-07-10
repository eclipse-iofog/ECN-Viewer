import React from 'react'
import Skeleton from 'react-loading-skeleton'

import { Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Tooltip } from '@material-ui/core'

import LocationCityIcon from '@material-ui/icons/LocationCity'
import GPSFixedIcon from '@material-ui/icons/GpsFixed'
import IPIcon from '@material-ui/icons/WifiTethering'

import { makeStyles, useTheme } from '@material-ui/styles'
const useStyles = makeStyles(theme => ({
  controllerInfo: {
    paddingTop: '0px',
    '& .paper': {
      padding: '5px'
    }
  },
  warningChip: {
    backgroundColor: `var(--color, ${theme.colors.danger})`,
    color: 'white'
  },
  controllerTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    textEmphasis: 'bold'
  }
}))

export default function ControllerInfo (props) {
  const classes = useStyles()
  const theme = useTheme()
  const { controller, loading } = props
  const { city, country, lat, lon, query } = controller.location || {}
  return (
    <div className={classes.controllerInfo}>
      <div className={classes.controllerTitle}>
        <Typography variant='h5'>Controller</Typography>
        {controller.error &&
          <Tooltip title={controller.error.message} aria-label='Error'>
            <Chip label={'The controller is not reachable'} style={{ '--color': theme.colors.gold }} className={classes.warningChip} />
          </Tooltip>
        }
      </div>
      <List>
        <ListItem>
          <ListItemIcon><LocationCityIcon /></ListItemIcon>
          { loading ? <ListItemText><Skeleton /></ListItemText> : <ListItemText primary={`${city}, ${country}`} /> }
        </ListItem>
        <ListItem style={{ cursor: 'pointer' }} onClick={() => props.selectController()} >
          <ListItemIcon><GPSFixedIcon /></ListItemIcon>
          { loading ? <ListItemText><Skeleton /></ListItemText> : <ListItemText primary={`${lat}, ${lon}`} /> }
        </ListItem>
        <ListItem>
          <ListItemIcon><IPIcon /></ListItemIcon>
          { loading ? <ListItemText><Skeleton /></ListItemText> : <ListItemText primary={query} /> }
        </ListItem>
      </List>
    </div>
  )
}
