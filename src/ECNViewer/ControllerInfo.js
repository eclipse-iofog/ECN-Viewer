import React from 'react'

import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

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
  }
})

export default function ControllerInfo (props) {
  const classes = useStyles()
  const controller = props.controller
  return (
    <div className={classes.controllerInfo}>
      <Typography variant='h5'>Controller</Typography>
      <List>
        <ListItem>
          <ListItemIcon><LocationCityIcon /></ListItemIcon>
          <ListItemText primary={`${controller.info.city}, ${controller.info.country}`} />
        </ListItem>
        <ListItem>
          <ListItemIcon><GPSFixedIcon /></ListItemIcon>
          <ListItemText primary={`${controller.info.lat}, ${controller.info.lon}`} />
        </ListItem>
        <ListItem>
          <ListItemIcon><IPIcon /></ListItemIcon>
          <ListItemText primary={controller.info.query} />
        </ListItem>
      </List>
    </div>
  )
}
