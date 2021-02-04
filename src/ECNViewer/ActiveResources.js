import React from 'react'

import { Typography, Paper } from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  summary: {
    marginTop: '15px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridColumnGap: '15px',
    textAlign: 'center'
  }
})

export default function ActiveResources (props) {
  const classes = useStyles()
  const { applications, activeAgents, activeMsvcs, loading } = props
  return (
    <div>
      <div className={classes.summary}>
        <Paper>
          <Typography variant='h3'>{loading ? 0 : applications.length}</Typography>
          <Typography variant='subtitle1'>Applications</Typography>
        </Paper>
        <Paper>
          <Typography variant='h3'>{loading ? 0 : activeAgents.length}</Typography>
          <Typography variant='subtitle1'>Agents</Typography>
        </Paper>
        <Paper>
          <Typography variant='h3'>{loading ? 0 : activeMsvcs.length}</Typography>
          <Typography variant='subtitle1'>Microservices</Typography>
        </Paper>
      </div>
    </div>
  )
}
