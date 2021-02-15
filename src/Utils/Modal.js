import React from 'react'
import { Modal, Paper, Typography, Button } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles(theme => ({
  modalTitle: {
    // backgroundColor: theme.colors.carbon,
    borderRadius: '4px 4px 0 0',
    // color: 'white',
    padding: '25px 50px',
    display: 'flex',
    justifyContent: 'space-between',
    textTransform: 'uppercase'
  },
  modal: {
    position: 'relative',
    margin: 'auto',
    top: '15%',
    borderRadius: '4pxpx',
    '&:focus': {
      outline: 'none'
    }
  },
  lg: {
    width: '60%'
  },
  sm: {
    width: '40%'
  },
  xl: {
    width: '80%'
  },
  modalContent: {
    maxHeight: '600px',
    overflowY: 'auto',
    padding: '50px',
    paddingTop: '0px',
    paddingBottom: '25px'
  },
  modalActions: {
    display: 'flex',
    backgroundColor: theme.colors.silver,
    alignItems: 'flex-end'
  },
  modalAction: {
    marginLeft: '5px'
  }
}))

export default function _Modal (props) {
  const classes = useStyles()
  const { title, open, onClose } = props
  const classNames = [classes.modal, classes[props.size] || classes.sm].join(' ')
  return (
    <Modal
      aria-labelledby={`${title} modal`}
      {...{
        open,
        onClose
      }}
    >
      <Paper className={classNames}>
        <div className={classes.modalTitle}>
          <Typography variant='h5'>{title}</Typography>
          <CloseIcon style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        <div className={classes.modalContent}>
          {props.children}
        </div>
        {props.actions && !!props.actions.length &&
          <div className={classes.modalActions}>
            {props.actions.map(a => <Button key={a.text} className={`${a.className} ${classes.modalAction}`} {...{ variant: a.variant, onClick: a.onClick }}>{a.text}</Button>)}
          </div>}
      </Paper>
    </Modal>
  )
}
