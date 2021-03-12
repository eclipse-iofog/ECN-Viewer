import React from 'react'
import { Button, Divider, Grid } from '@material-ui/core'

import Modal from './Modal'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles(theme => ({
  divider: {
    margin: '5px'
  }
}))

export default function Confirm (props) {
  const classes = useStyles()
  const { open, onClose, title, onConfirm } = props
  return (
    <Modal
      {...{
        title,
        open,
        onClose
      }}
    >
      {props.children}
      <Divider className={classes.divider} />
      <Grid container justify='flex-end' spacing={2}>
        <Grid item>
          <Button onClick={onClose}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' onClick={onConfirm}>
            Confirm
          </Button>
        </Grid>
      </Grid>

    </Modal>
  )
}
