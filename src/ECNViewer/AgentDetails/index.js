import React from 'react'

import ReactJson from 'react-json-view'
import { Paper, Typography, makeStyles } from '@material-ui/core'

import { useData } from '../../providers/Data'

import moment from 'moment'

const useStyles = makeStyles(theme => ({
  title: {
    paddingBottom: '10px',
    paddingTop: '10px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 2,
    textTransform: 'uppercase'
  },
  multiSections: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  section: {
    flex: '1 1 0px',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '15px'
  },
  subTitle: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  subSection: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '5px'
  },
  text: {
    fontSize: '14px',
    fontWeight: 'normal'
  }
}))

const _fogTypes = {
  0: 'auto-detect',
  1: 'x86',
  2: 'ARM'
}

const dateFormat = 'YYYY/MM/DD hh:mm:ss a'

export default function AgentDetails ({ views, setView, agent: selectedAgent }) {
  const { data } = useData()
  const classes = useStyles()

  const { msvcsPerAgent, controller } = data
  const agent = (controller.agents || []).find(a => selectedAgent.uuid === a.uuid) || selectedAgent // Get live updates from data
  return (
    <>
      <Paper className={`section first ${classes.multiSections}`}>
        <div className={classes.section} style={{ flex: '2 1 0px' }}>
          <Typography variant='subtitle2' className={classes.title}>Description</Typography>
          <span className={classes.text}>{agent.description}</span>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Info</Typography>
          <span className={classes.subTitle}>Status: <span className={classes.text}>{agent.daemonStatus}</span></span>
          <span className={classes.subTitle}>Type: <span className={classes.text}>{_fogTypes[agent.fogTypeId]}</span></span>
          <span className={classes.subTitle}>Version: <span className={classes.text}>{agent.version}</span></span>
        </div>
      </Paper>
      <Paper className={`section ${classes.multiSections}`}>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Agent Details</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Last Active</span>
            <span className={classes.text}>{moment(agent.lastActive).format(dateFormat)}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>IP Address</span>
            <span className={classes.text}>{agent.ipAddressExternal}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Processed Messages</span>
            <span className={classes.text}>{agent.processedMessages}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Created at</span>
            <span className={classes.text}>{moment(agent.createdAt).format(dateFormat)}</span>
          </div>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Resource Utilization</Typography>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Edge Resources</Typography>
        </div>
      </Paper>
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Agent JSON</Typography>
          <ReactJson title='Agent' src={agent} name={false} collapsed />
        </div>
      </Paper>
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Microservices JSON</Typography>
          <ReactJson title='Microservices' src={msvcsPerAgent[agent.uuid]} name={false} collapsed />
        </div>
      </Paper>
    </>
  )
}
