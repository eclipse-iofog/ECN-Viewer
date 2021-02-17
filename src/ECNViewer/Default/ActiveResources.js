import React from 'react'

import { Paper } from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'
import { useData } from '../../providers/Data'
const useStyles = makeStyles(theme => ({
  summary: {
    marginTop: '15px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridColumnGap: '15px',
    textAlign: 'center'
  },
  container: {
    display: 'flex',
    height: '100px'
  },
  mainNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '2 1 0px',
    fontWeight: '400',
    fontSize: '4rem'
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
    flex: '4 1 0px',
    textAlign: 'left'
  },
  unitType: {
    fontSize: '1rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  detailsText: {
    fontSize: '0.8rem',
    color: `var(--color, ${theme.colors.carbon})`,
    textTransform: 'uppercase'
  },
  errorText: {
    color: theme.colors.error
  }
}))

export default function ActiveResources () {
  const classes = useStyles()
  const { data } = useData()
  const { controller, loading } = data
  const { agents, applications, microservices } = controller
  const applicationCount = applications.reduce((acc, app) => {
    if (app.isActivated) { acc.running += 1 } else { acc.stopped += 1 }
    // TODO: HAndle errored app
    return acc
  }, {
    running: 0,
    stopped: 0,
    error: 0
  })
  const agentCount = agents.reduce((acc, a) => {
    if (a.daemonStatus === 'RUNNING') { acc.running += 1 } else { acc.unknown += 1 }
    // TODO: HAndle errored app
    return acc
  }, {
    running: 0,
    unknown: 0,
    alert: 0
  })
  const microserviceCount = microservices.reduce((acc, a) => {
    if (a.status.status === 'RUNNING') {
      acc.running += 1
    } else if (a.status.status === 'FAILED') {
      acc.error += 1
    } else {
      acc.stopped += 1
    }
    return acc
  }, {
    running: 0,
    stopped: 0,
    error: 0
  })
  return (
    <div>
      <div className={classes.summary}>
        <Paper className={classes.container}>
          <div className={classes.mainNumber}>
            <div>{loading ? 0 : agents.length}</div>
          </div>
          <div className={classes.detailsContainer}>
            <div className={classes.unitType}>Agents</div>
            <div className={classes.detailsText}>{agentCount.running} running &bull; {agentCount.unknown} unknown</div>
            <div className={[classes.detailsText, classes.errorText].join(' ')}>{agentCount.alert} alerts</div>
          </div>
        </Paper>
        <Paper className={classes.container}>
          <div className={classes.mainNumber}>
            <div>{loading ? 0 : applications.length}</div>
          </div>
          <div className={classes.detailsContainer}>
            <div className={classes.unitType}>Applications</div>
            <div className={classes.detailsText}>{applicationCount.running} running &bull; {applicationCount.stopped} stopped</div>
            <div className={[classes.detailsText, classes.errorText].join(' ')}>{applicationCount.error} errors</div>
          </div>
        </Paper>
        <Paper className={classes.container}>
          <div className={classes.mainNumber}>
            <div>{loading ? 0 : microservices.length}</div>
          </div>
          <div className={classes.detailsContainer}>
            <div className={classes.unitType}>Microservices</div>
            <div className={classes.detailsText}>{microserviceCount.running} running &bull; {microserviceCount.stopped} stopped</div>
            <div className={[classes.detailsText, classes.errorText].join(' ')}>{microserviceCount.error} errors</div>
          </div>
        </Paper>
      </div>
    </div>
  )
}
