import React from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'

const { FILE } = NativeTypes

const useStyles = makeStyles(theme => ({
  dropZone: {
    width: '100%',
    border: '1px dashed',
    height: '50px',
    // padding: '1rem',
    textAlign: 'center',
    verticalAlign: 'center',
    borderRadius: '4px',
    background: 'aliceblue',
    color: theme.colors.carbon,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  active: {
    backgroundColor: '#d8dfe5'
    // border: '1px solid'
  }
}))

export default function FileDrop (props) {
  const classes = useStyles()
  const [collectedProps, drop] = useDrop({
    accept: FILE,
    drop: props.onDrop,
    collect: (monitor) => ({
      highlighted: monitor.canDrop(),
      hovered: monitor.isOver()
    })
  })

  const active = collectedProps.hovered && collectedProps.highlighted
  const className = [
    classes.dropZone,
    (collectedProps.hovered ? classes.hovered : ''),
    (collectedProps.highlighted ? classes.highlighted : ''),
    (active ? classes.active : '')
  ].join(' ')

  return props.loading
    ? (
      <div className={className}><CircularProgress size={24} /></div>
    )
    : (
      <div className={className} ref={drop}>
        {active ? 'Release to drop' : props.children}
      </div>
    )
}
