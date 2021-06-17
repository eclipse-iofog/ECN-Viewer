import React from 'react'

import ReactJson from '../../Utils/ReactJson'
import { Paper, Typography, makeStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Table, TableBody, TableHead, TableRow, TableCell, useMediaQuery } from '@material-ui/core'

import { useData } from '../../providers/Data'

import getSharedStyle from '../sharedStyles'
import { dateFormat, icons } from '../utils'

import moment from 'moment'
import MicroservicesTable from '../MicroservicesTable'
import yaml from 'js-yaml'

import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-yaml'

import { useFeedback } from '../../Utils/FeedbackContext'
import { MsvcStatus as Status } from '../../Utils/Status'
import Modal from '../../Utils/Modal'
import SearchBar from '../../Utils/SearchBar'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))

const notFoundMsvc = { name: 'UNKNOWN', status: {}, notFound: true }

export default function ApplicationDetails ({ application: selectedApplication, selectApplication, selectMicroservice, selectAgent, back }) {
  const { data, toggleApplication: _toggleApplication, deleteApplication: _deleteApplication } = useData()
  const classes = useStyles()
  const { pushFeedback } = useFeedback()
  const [openDeleteApplicationDialog, setOpenDeleteApplicationDialog] = React.useState(false)
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false)
  const [msvcFilter, setMsvcFilter] = React.useState('')
  const isMediumScreen = useMediaQuery('(min-width: 768px)')

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

  const status = application.isActivated ? 'STARTED' : 'STOPPED'
  const routes = application.routes || []
  if (!routes.length) { routes.push({}) }

  const mainActions = (
    <div className={classes.actions} style={{ minWidth: '100px' }}>
      <icons.DeleteIcon onClick={() => setOpenDeleteApplicationDialog(true)} className={classes.action} title='Delete application' />
      {application.isActivated
        ? <icons.RestartIcon className={classes.action} onClick={() => restartApplication(application)} title='Restart application' />
        : <icons.RestartIcon className={classes.disabledAction} title='Restart application' />}
      {application.isActivated
        ? <icons.StopIcon className={classes.action} onClick={() => toggleApplication(application)} title='Stop application' />
        : <icons.PlayIcon className={classes.action} onClick={() => toggleApplication(application)} title='Start application' />}
    </div>
  )

  const detailActions = (
    <div className={classes.actions} style={{ minWidth: 0 }}>
      <icons.CodeIcon onClick={() => setOpenDetailsModal(true)} className={classes.action} title='Details' />
    </div>
  )

  return (
    <>
      <Paper className={`section first ${classes.multiSections}`}>
        <div className={[classes.section, 'paper-container-left', classes.bottomPad].join(' ')}>
          <Typography variant='subtitle2' className={classes.title}>
            <span>Status</span>
            {!isMediumScreen && mainActions}
          </Typography>
          <span className={classes.text} style={{ display: 'flex', alignItems: 'center' }}><Status status={status} style={{ marginRight: '5px', marginTop: '-3px' }} />{status}</span>
        </div>
        <div className={classes.sectionDivider} />
        <div className={[classes.section, 'paper-container-right'].join(' ')} style={{ paddingBottom: '15px' }}>
          <Typography variant='subtitle2' className={classes.title}>
            <span>Description</span>
            {isMediumScreen && mainActions}
          </Typography>
          <span className={classes.text}>{application.description}</span>
        </div>
      </Paper>
      <Paper className={`section ${classes.multiSections}`}>
        <div className={[classes.section, 'paper-container-left'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title} style={{ minWidth: '100%' }}>
            <span>Application Details</span>
            {!isMediumScreen && detailActions}
          </Typography>
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
        {isMediumScreen && (
          <div className={[classes.section, 'paper-container-right'].join(' ')}>
            <Typography variant='subtitle2' className={classes.title} style={{ justifyContent: 'flex-end' }}>
              {detailActions}
            </Typography>
            {/* {application.routes.map((r, idx) =>
            <div key={r.name || idx} className={classes.subSection}>
              <span className={classes.subTitle}>{r.name}</span>
              <span className={classes.text}>{r.from}&nbsp;&#8594;&nbsp;{r.to}</span>
            </div>
          )} */}
          </div>
        )}
      </Paper>
      <Paper className='section'>
        <div className='section-container'>
          <div className={[classes.section, classes.cardTitle, 'paper-container-left', 'paper-container-right'].join(' ')}>
            <Typography variant='subtitle2' className={classes.title}>
              <span className={[classes.stickyLeft, classes.textEllipsis].join(' ')}>Microservices</span>
              <SearchBar onSearch={setMsvcFilter} inputClasses={{ root: classes.narrowSearchBar }} classes={{ root: classes.stickyRight }} />
            </Typography>
          </div>
          <MicroservicesTable
            selectAgent={selectAgent}
            application={application}
            selectMicroservice={selectMicroservice}
            filter={msvcFilter}
          />
        </div>
      </Paper>
      <Paper className='section'>
        <div className='section-container'>
          <div className={[classes.section, 'paper-container-left', 'paper-container-right'].join(' ')}>
            <Typography variant='subtitle2' className={classes.title}>
              <span className={classes.stickyLeft}>Routes</span>
            </Typography>
          </div>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeaderCell }} style={{ top: '44px' }}>Name</TableCell>
                <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeaderCell }} style={{ top: '44px' }}>From</TableCell>
                <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeaderCell }} style={{ top: '44px' }}>To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes
                .map((p, idx) => {
                  if (!p.name) {
                    return <TableRow key={idx}><TableCell colSpan={3} /></TableRow>
                  }
                  const from = application.microservices.find(m => m.name === p.from) || notFoundMsvc
                  const to = application.microservices.find(m => m.name === p.to) || notFoundMsvc
                  return (
                    <TableRow key={p.name}>
                      <TableCell component='th' scope='row'>
                        {p.name}
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                          <Status status={from.status.status} size={10} style={{ marginRight: '5px', '--pulse-size': '5px' }} />
                          <span className={from.notFound ? '' : classes.action} onClick={() => from.notFound ? null : selectMicroservice(from)}>{from.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                          <Status status={to.status.status} size={10} style={{ marginRight: '5px', '--pulse-size': '5px' }} />
                          <span className={to.notFound ? '' : classes.action} onClick={() => to.notFound ? null : selectMicroservice(to)}>{to.name}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Paper className='section' style={{ maxHeight: '800px', paddingBottom: '15px' }}>
        <div className={[classes.section, 'paper-container-left', 'paper-container-right'].join(' ')}>
          <Typography variant='subtitle2' className={classes.title} style={{ zIndex: 5 }}>Application YAML</Typography>
          <AceEditor
            mode='yaml'
            theme='monokai'
            defaultValue={yamlDump}
            readOnly
            onLoad={function (editor) { editor.renderer.setPadding(10); editor.renderer.setScrollMargin(10) }}
            style={{
              width: '100%',
              height: '700px',
              borderRadius: '4px'
            }}
          />
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
      <Modal
        {...{
          open: openDetailsModal,
          title: `${application.name} details`,
          onClose: () => setOpenDetailsModal(false),
          size: 'lg'
        }}
      >
        <ReactJson title='Application' src={application} name={false} />
      </Modal>
    </>
  )
}
