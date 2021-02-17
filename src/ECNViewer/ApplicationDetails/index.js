import React from 'react'

import ReactJson from 'react-json-view'
import { Paper, Typography, makeStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@material-ui/core'

import { useData } from '../../providers/Data'

import getSharedStyle from '../sharedStyles'
import { dateFormat, icons } from '../utils'

import moment from 'moment'
import MicroservicesTable from '../MicroservicesTable'
import yaml from 'js-yaml'
import AceEditor from 'react-ace'
import { useFeedback } from '../../Utils/FeedbackContext'
import { MsvcStatus as Status } from '../../Utils/Status'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))
export default function ApplicationDetails ({ application: selectedApplication, selectApplication, selectMicroservice, back }) {
  const { data, toggleApplication: _toggleApplication, deleteApplication: _deleteApplication } = useData()
  const classes = useStyles()
  const { pushFeedback } = useFeedback()
  const [openDeleteApplicationDialog, setOpenDeleteApplicationDialog] = React.useState(false)

  const { applications, reducedAgents } = data
  const application = (applications || []).find(a => selectedApplication.name === a.name) || selectedApplication // Get live updates from data
  const runningMsvcs = application.microservices.filter(m => m.status.status === 'RUNNING')

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
        back()
      } else {
        pushFeedback({ type: 'error', message: response.status })
      }
    } catch (e) {
      pushFeedback({ type: 'error', message: e.message || e.status })
    }
  }

  const _getApplicationYAMLFromJSON = (app) => {
    return {
      apiVersion: 'iofog.org/v2',
      kind: 'Application',
      metadata: {
        name: app.name
      },
      spec: {
        microservices: app.microservices.map(m => ({
          name: m.name,
          agent: {
            name: (reducedAgents.byUUID[m.iofogUuid] || { name: '__UNKNOWN__' }).name
          },
          images: m.images.reduce((acc, image) => {
            switch (image.fogTypeId) {
              case 1:
                acc.x86 = image.containerImage
                break
              case 2:
                acc.arm = image.containerImage
                break
            }
            return acc
          }, {
            registry: m.registryId
          }),
          container: {
            ports: m.ports.map(p => {
              if (p.host) {
                p.host = (reducedAgents.byUUID[p.host] || { name: p.host }).name
              }
              return p
            }),
            volumes: m.volumeMappings.map(vm => {
              delete vm.id
              return vm
            }),
            env: m.env.map(env => {
              delete env.id
              return env
            }),
            extraHosts: m.extraHosts.map(eH => {
              delete eH.id
              return eH
            }),
            commands: m.cmd.map(cmd => {
              delete cmd.id
              return cmd
            })
          },
          config: JSON.parse(m.config)
        })),
        routes: app.routes.map(r => ({
          name: r.name,
          from: r.from,
          to: r.to
        }))
      }
    }
  }

  const yamlDump = React.useMemo(() => yaml.dump(_getApplicationYAMLFromJSON(application)), [application])

  console.log({ yamlDump })
  const status = application.isActivated ? 'RUNNING' : 'STOPPED'

  return (
    <>
      <Paper className={`section first ${classes.multiSections}`}>
        <div className={[classes.section, 'paper-container-left'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Status</Typography>
          <span className={classes.subTitle} style={{ display: 'flex', alignItems: 'center' }}><Status status={status} style={{ marginRight: '5px' }} />{status}</span>
        </div>
        <div className={[classes.section, 'paper-container-right'].join(' ')} style={{ flex: '2 1 0px' }}>
          <Typography variant='subtitle2' className={classes.title}>
            <span>Description</span>
            <div className={classes.actions} style={{ minWidth: '100px' }}>
              <icons.DeleteIcon onClick={() => setOpenDeleteApplicationDialog(true)} className={classes.action} title='Delete application' />
              {application.isActivated
                ? <icons.RestartIcon className={classes.action} onClick={() => restartApplication(application)} title='Restart application' />
                : <icons.RestartIcon className={classes.disabledAction} title='Restart application' />}
              {application.isActivated
                ? <icons.StopIcon className={classes.action} onClick={() => toggleApplication(application)} title='Stop application' />
                : <icons.PlayIcon className={classes.action} onClick={() => toggleApplication(application)} title='Start application' />}
            </div>
          </Typography>
          <span className={classes.text}>{application.description}</span>
        </div>
      </Paper>
      <Paper className={`section ${classes.multiSections}`}>
        <div className={[classes.section, 'paper-container-left'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Application Details</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Last Active</span>
            <span className={classes.text}>{moment(application.lastStatusTime).format(dateFormat)}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Microservices</span>
            <span className={classes.text}>{runningMsvcs.length}/{application.microservices.length}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Created at</span>
            <span className={classes.text}>{moment(application.createdAt).format(dateFormat)}</span>
          </div>
        </div>
        <div className={[classes.section, 'paper-container-right'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Routes</Typography>
          {application.routes.map((r, idx) =>
            <div key={r.name || idx} className={classes.subSection}>
              <span className={classes.subTitle}>{r.name}</span>
              <span className={classes.text}>{r.from}&nbsp;&#8594;&nbsp;{r.to}</span>
            </div>
          )}
        </div>
      </Paper>
      <Paper className='section' style={{ paddingBottom: '15px' }}>
        <div className={[classes.section, 'paper-container-left', 'paper-container-right'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>
            <span>Microservices</span>
          </Typography>
        </div>
        <MicroservicesTable
          application={application}
          selectMicroservice={selectMicroservice}
        />
      </Paper>
      <Paper className='section'>
        <div className={[classes.section, 'paper-container-left', 'paper-container-right'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title} style={{ zIndex: 5 }}>Application YAML</Typography>
          <AceEditor
            mode='yaml'
            defaultValue={yamlDump}
            readOnly
            style={{
              width: '100%',
              height: '230px'
            }}
          />
        </div>
      </Paper>
      <Paper className='section'>
        <div className={[classes.section, 'paper-container-left', 'paper-container-right'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>Application JSON</Typography>
          <ReactJson title='Agent' src={application} name={false} collapsed />
        </div>
      </Paper>
      <Dialog
        open={openDeleteApplicationDialog}
        onClose={() => { setOpenDeleteApplicationDialog(false) }}
      >
        <DialogTitle id='alert-dialog-title'>Delete {application.name}?</DialogTitle>
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
          <Button onClick={() => { deleteApplication(application) }} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
