import React from 'react'
import { Modal, Paper, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  modalTitle: {
    backgroundColor: '#002E43',
    color: 'white',
    padding: '5px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  modal: {
    width: '60%',
    top: '15%',
    left: '20%',
    position: 'absolute'
  },
  modalContent: {
    maxHeight: '600px',
    overflowY: 'scroll',
    padding: '15px'
  }
})

export default function Config (props) {
  const classes = useStyles()
  const { title, open, onClose } = props
  return (
    <Modal
      aria-labelledby={`${title} modal`}
      {...{
        open,
        onClose
      }}
    >
      <Paper className={classes.modal}>
        <div className={classes.modalTitle}>
          <Typography variant='h5'>{title}</Typography>
          <CloseIcon style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        <div className={classes.modalContent}>
          {props.children}
        </div>
      </Paper>
    </Modal>
  )
}
