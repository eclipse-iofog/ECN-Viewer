import React from 'react'

import { Typography, Paper } from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridColumnGap: '15px',
    textAlign: 'center'
  }
})

export default function ActiveResources (props) {
  const classes = useStyles()
  const { activeFlows, activeAgents, activeMsvcs } = props
  return (
    <div>
      <Typography variant='h5'>Active resources</Typography>
      <br />
      <div className={classes.summary}>
        <Paper>
          <Typography variant='h3'>{activeFlows.length}</Typography>
          <Typography variant='subtitle1'>Flows</Typography>
        </Paper>
        <Paper>
          <Typography variant='h3'>{activeAgents.length}</Typography>
          <Typography variant='subtitle1'>Agents</Typography>
        </Paper>
        <Paper>
          <Typography variant='h3'>{activeMsvcs.length}</Typography>
          <Typography variant='subtitle1'>Microservices</Typography>
        </Paper>
      </div>
    </div>
  )
}
