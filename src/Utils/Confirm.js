import React from 'react'
import { Button, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog } from '@material-ui/core'

export default function Confirm (props) {
  const { open, onClose, title, onConfirm, description } = props
  return (

    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle id='alert-dialog-title'>{title}?</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {description || props.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
        Cancel
        </Button>
        <Button onClick={onConfirm} color='primary' autoFocus>
        Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
