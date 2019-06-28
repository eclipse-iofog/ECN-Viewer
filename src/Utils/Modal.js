import React from 'react'
import { Modal, Paper, Typography, Button } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  modalTitle: {
    backgroundColor: '#002E43',
    borderRadius: '4px 4px 0 0',
    color: 'white',
    padding: '5px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  modal: {
    width: '60%',
    top: '15%',
    left: '20%',
    position: 'absolute',
    borderRadius: '4px'
  },
  modalContent: {
    maxHeight: '600px',
    overflowY: 'scroll',
    padding: '15px'
  },
  modalActions: {
    display: 'flex',
    backgroundColor: '#FAFCFF',
    alignItems: 'flex-end'
  },
  modalAction: {
    marginLeft: '5px'
  }
})

export default function _Modal (props) {
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
        {props.actions && !!props.actions.length && <div className={classes.modalActions}>
          {props.actions.map(a => <Button className={`${a.className} ${classes.modalAction}`} variant={a.variant} onClick={a.onClick}>{a.text}</Button>)}
        </div>}
      </Paper>
    </Modal>
  )
}
