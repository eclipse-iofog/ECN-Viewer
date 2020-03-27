import React from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { makeStyles } from '@material-ui/core/styles'

const { FILE } = NativeTypes

const useStyles = makeStyles(theme => ({
  dropZone: {
    width: '100%',
    border: '1px dashed',
    height: '120px',
    padding: '1rem',
    textAlign: 'center',
    borderRadius: '4px',
    borderColor: theme.colors.carbon,
    color: theme.colors.carbon
  },
  active: {
    backgroundColor: 'white',
    fontWeight: 'bold'
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

  return (
    <div className={className} ref={drop}>
      {active ? 'Release to drop' : props.children}
    </div>
  )
}
