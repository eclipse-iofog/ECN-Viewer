import React from 'react'

import ReactJson from 'react-json-view'
import { Paper, Typography, makeStyles, Icon, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core'

import { useData } from '../../providers/Data'
import { dateFormat, MiBFactor, fogTypes, icons, prettyBytes } from '../utils'

import getSharedStyle from '../sharedStyles'

import moment from 'moment'
import { useFeedback } from '../../Utils/FeedbackContext'

import MicroservicesTable from '../MicroservicesTable'
import Status from '../../Utils/Status'
import Modal from '../../Utils/Modal'
import EdgeResourceDetails from './EdgeResourceDetails'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))

export default function AgentDetails ({ agent: selectedAgent, selectApplication, selectMicroservice, back }) {
  const { data, deleteAgent: _deleteAgent, toggleApplication: _toggleApplication, deleteApplication: _deleteApplication } = useData()
  const { pushFeedback } = useFeedback()
  const [openDeleteAgentDialog, setOpenDeleteAgentDialog] = React.useState(false)
  const [openDeleteApplicationDialog, setOpenDeleteApplicationDialog] = React.useState(false)
  const [selectedApplication, setSelectedApplication] = React.useState({})
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false)
  const [selectedER, setSelectedER] = React.useState({})
  const classes = useStyles()

  const { msvcsPerAgent, controller, applications } = data
  const agent = (controller.agents || []).find(a => selectedAgent.uuid === a.uuid) || selectedAgent // Get live updates from data
  const applicationsByName = React.useMemo(() => {
    return (msvcsPerAgent[agent.uuid] || []).reduce((acc, m) => {
      if (acc[m.application]) { acc[m.application].microservices.push(m) } else {
        acc[m.application] = {
          microservices: [m],
          application: applications.find(a => a.name === m.application)
        }
      }
      return acc
    }, {})
  }, [msvcsPerAgent, agent])

  const deleteAgent = async () => {
    try {
      const response = await _deleteAgent(selectedAgent)
      if (response.ok) {
        pushFeedback({ type: 'success', message: 'Agent deleted!' })
        back()
      } else {
        pushFeedback({ type: 'error', message: response.status })
      }
    } catch (e) {
      pushFeedback({ type: 'error', message: e.message || e.status })
    }
  }

  const toggleApplication = async (app) => {
    try {
      const response = await _toggleApplication(app)
      if (response.ok) {
        app.isActivated = !app.isActivated
        pushFeedback({ type: 'success', message: `Application ${app.isActivated ? 'Started' : 'Stopped'}!` })
      } else {
        pushFeedback({ type: 'error', message: response.status })
      }
    } catch (e) {
      pushFeedback({ type: 'error', message: e.message || e.status })
    }
  }

  const restartApplication = async (app) => {
    await toggleApplication(app)
    await toggleApplication(app)
  }

  const deleteApplication = async (app) => {
    try {
      const response = await _deleteApplication(app)
      if (response.ok) {
        pushFeedback({ type: 'success', message: 'Application Deleted!' })
        setOpenDeleteApplicationDialog(false)
        setSelectedApplication({})
      } else {
        pushFeedback({ type: 'error', message: response.status })
      }
    } catch (e) {
      pushFeedback({ type: 'error', message: e.message || e.status })
    }
  }

  const _getSeeDetailsMessage = (application) => {
    if (application.application.microservices.lenght === application.microservices.lenght) {
      return 'See application details >'
    }
    if (application.application.microservices.lenght < 2) {
      return 'See application details >'
    }
    return `See all ${application.application.microservices.lenght} Msvcs for this app >`
  }
  return (
    <>
      <Paper className={`section first ${classes.multiSections}`}>
        <div className={[classes.section, 'paper-container-left'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Status</Typography>
          <span className={classes.subTitle} style={{ display: 'flex', alignItems: 'center' }}><Status status={agent.daemonStatus} style={{ marginRight: '5px' }} />{agent.daemonStatus}</span>
          <span className={classes.subTitle} style={{ marginTop: '15px' }}>Last Active: <span className={classes.text}>{agent.lastStatusTime ? moment(agent.lastStatusTime).format(dateFormat) : '--'}</span></span>
        </div>
        <div className={[classes.section, 'paper-container-right'].join(' ')} style={{ flex: '2 1 0px' }}>
          <Typography variant='subtitle2' className={classes.title}>
            <span>Description</span>
            <div className={classes.actions}>
              <icons.DeleteIcon onClick={() => setOpenDeleteAgentDialog(true)} className={classes.action} title='Delete application' />
            </div>
          </Typography>
          <span className={classes.text}>{agent.description}</span>
        </div>
      </Paper>
      <Paper className={`section ${classes.multiSections}`}>
        <div className={[classes.section, 'paper-container-left'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Agent Details</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Version</span>
            <span className={classes.text}>{agent.version}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Type</span>
            <span className={classes.text}>{fogTypes[agent.fogTypeId]}</span>
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
            <span className={classes.subTitle}>Created</span>
            <span className={classes.text}>{moment(agent.createdAt).format(dateFormat)}</span>
          </div>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Resource Utilization</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>CPU Usage</span>
            <span className={classes.text}>{(agent.cpuUsage * 1).toFixed(2) + '%'}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Memory Usage</span>
            <span className={classes.text}>{`${prettyBytes((agent.memoryUsage * MiBFactor))} / ${prettyBytes((agent.systemAvailableMemory))} (${((agent.memoryUsage * MiBFactor / agent.systemAvailableMemory * 100) || 0).toFixed(2)}%)`}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Disk Usage</span>
            <span className={classes.text}>{`${prettyBytes((agent.diskUsage * MiBFactor))} / ${prettyBytes((agent.systemAvailableDisk))} (${((agent.diskUsage * MiBFactor / agent.systemAvailableDisk * 100) || 0).toFixed(2)}%)`}</span>
          </div>
        </div>
        <div className={[classes.section, 'paper-container-right'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Edge Resources</Typography>
          {agent.edgeResources.map(er => (
            <div key={`${er.name}_${er.version}`} className={classes.edgeResource}>
              <div className={classes.erIconContainer} style={{ '--color': 'white' }}>
                {er.display && er.display.icon && <Icon title={er.display.name || er.name} className={classes.erIcon}>{er.display.icon}</Icon>}
              </div>
              <div className={`${classes.subTitle} ${classes.action}`} onClick={() => { setSelectedER(er); setOpenDetailsModal(true) }} style={{ marginLeft: '5px' }}>{(er.display && er.display.name) || er.name} {er.version}</div>
            </div>
          ))}
        </div>
      </Paper>
      {Object.keys(applicationsByName).map(applicationName => (
        <Paper key={applicationName} className='section'>
          <div className={[classes.section, 'paper-container-left', 'paper-container-right'].join(' ')}>
            <Typography variant='subtitle2' className={classes.title}>
              <span>{applicationName}</span>
              <div className={classes.actions} style={{ minWidth: '100px' }}>
                <icons.DeleteIcon className={classes.action} title='Delete application' onClick={() => { setSelectedApplication(applicationsByName[applicationName].application); setOpenDeleteApplicationDialog(true) }} />
                {applicationsByName[applicationName].application.isActivated
                  ? <icons.RestartIcon className={classes.action} onClick={() => restartApplication(applicationsByName[applicationName].application)} title='Restart application' />
                  : <icons.RestartIcon className={classes.disabledAction} title='Restart application' />}
                {applicationsByName[applicationName].application.isActivated
                  ? <icons.StopIcon className={classes.action} onClick={() => toggleApplication(applicationsByName[applicationName].application)} title='Stop application' />
                  : <icons.PlayIcon className={classes.action} onClick={() => toggleApplication(applicationsByName[applicationName].application)} title='Start application' />}
              </div>
            </Typography>
          </div>
          <MicroservicesTable
            application={applicationsByName[applicationName]}
            selectMicroservice={selectMicroservice}
          />
          <div
            style={{
              width: '100%',
              textAlign: 'right',
              fontSize: '12px',
              paddingTop: '15px'
            }}
            className='paper-container-right'
          >
            <span className={classes.action} onClick={() => selectApplication(applicationsByName[applicationName].application)}>{_getSeeDetailsMessage(applicationsByName[applicationName])}</span>
          </div>
        </Paper>
      ))}
      <Paper className='section'>
        <div className={[classes.section, 'paper-container-left', 'paper-container-right'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Agent JSON</Typography>
          <ReactJson title='Agent' src={agent} name={false} collapsed />
        </div>
      </Paper>
      <Dialog
        open={openDeleteAgentDialog}
        onClose={() => { setOpenDeleteAgentDialog(false) }}
      >
        <DialogTitle id='alert-dialog-title'>Delete {agent.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span>Deleting an agent will delete all its microservices.</span><br />
            <span>This is not reversible.</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAgentDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => deleteAgent()} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteApplicationDialog}
        onClose={() => { setOpenDeleteApplicationDialog(false) }}
      >
        <DialogTitle id='alert-dialog-title'>Delete {selectedApplication.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span>Deleting an Application will delete all its microservices.</span><br />
            <span>This is not reversible.</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteApplicationDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => deleteApplication(selectApplication)} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        {...{
          open: openDetailsModal,
          title: `${selectedER.name} details`,
          onClose: () => setOpenDetailsModal(false),
          size: 'lg'
        }}
      >
        <EdgeResourceDetails edgeResource={selectedER} />
      </Modal>
    </>
  )
}
