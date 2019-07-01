import React from 'react'
import { Button, Divider, Grid } from '@material-ui/core'

import Modal from './Modal'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  confirm: {
    backgroundColor: 'var(--color, #5064EC)',
    color: 'white'
  }
})

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
      <Grid container justify='flex-end'>
        <Grid item>
          <Button onClick={onClose}>
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button variant='contained' className={classes.confirm} onClick={onConfirm}>
            Confirm
          </Button>
        </Grid>
      </Grid>

    </Modal>
  )
}
