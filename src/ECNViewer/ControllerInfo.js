import React from 'react'

import { Typography, Chip, Tooltip, Input } from '@material-ui/core'

import { makeStyles, useTheme } from '@material-ui/styles'

const CONTROLLER_NAME_KEY = 'ControllerName'
const DEFAULT_CONTROLLER_NAME = 'Controller'

const useStyles = makeStyles(theme => ({
  controllerInfo: {
    paddingTop: '0px',
    '& .paper': {
      padding: '5px'
    }
  },
  controllerName: {
    fontSize: '1.5rem',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1.33,
    letterSpacing: '0em',
    width: '100%',
    '&::before': {
      borderBottom: 'none !important'
    }
  },
  warningChip: {
    backgroundColor: `var(--color, ${theme.colors.danger})`,
    color: 'white'
  },
  controllerTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textEmphasis: 'bold',
    height: '60px',
    '& input': {
      textTransform: 'uppercase !important'
      // color: 'white'
    }
  }
}))

export default function ControllerInfo (props) {
  const classes = useStyles()
  const theme = useTheme()
  const { controller, error } = props

  const controllerError = error || controller.error || null
  const [controllerName, setControllerName] = React.useState(() => {
    return window.localStorage.getItem(CONTROLLER_NAME_KEY) || DEFAULT_CONTROLLER_NAME
  })

  const loseFocus = (e) => {
    const { key, target } = e
    if (key === 'Enter') {
      target.blur()
    }
  }

  const updateControllerName = (e) => {
    const name = e.target.value
    window.localStorage.setItem(CONTROLLER_NAME_KEY, name)
    setControllerName(name)
  }

  React.useEffect(() => {
    if (controllerName === DEFAULT_CONTROLLER_NAME) {
      window.document.title = 'ECN Viewer'
      return
    }
    window.document.title = controllerName
  }, [controllerName])

  return (
    <div className={classes.controllerInfo}>
      <div className={classes.controllerTitle}>
        <Typography style={{ width: '100%' }} variant='h5'>
          <Input className={classes.controllerName} value={controllerName} onChange={updateControllerName} onKeyDown={loseFocus} />
        </Typography>
        {controllerError &&
          <Tooltip title={controllerError.message} aria-label='Error'>
            <Chip label='The controller is not reachable' style={{ '--color': theme.colors.gold }} className={classes.warningChip} />
          </Tooltip>}
      </div>
    </div>
  )
}
