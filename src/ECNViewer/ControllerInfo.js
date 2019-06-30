import React from 'react'
import Skeleton from 'react-loading-skeleton'

import { Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Tooltip } from '@material-ui/core'

import LocationCityIcon from '@material-ui/icons/LocationCity'
import GPSFixedIcon from '@material-ui/icons/GpsFixed'
import IPIcon from '@material-ui/icons/WifiTethering'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  controllerInfo: {
    paddingTop: '0px',
    '& .paper': {
      padding: '5px'
    }
  },
  warningChip: {
    backgroundColor: 'var(--color, #F5A623)',
    color: 'white'
  },
  controllerTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    textEmphasis: 'bold'
  }
})

export default function ControllerInfo (props) {
  const classes = useStyles()
  const { controller, loading } = props
  const { city, country, lat, lon, query } = controller.info.location || {}
  return (
    <div className={classes.controllerInfo}>
      <div className={classes.controllerTitle}>
        <Typography variant='h5'>Controller</Typography>
        {controller.info.error &&
          <Tooltip title={controller.info.error.message} aria-label='Error'>
            <Chip label={'The controller is not reachable'} style={{ '--color': '#F5A623' }} className={classes.warningChip} />
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
