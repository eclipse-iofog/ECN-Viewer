import React from 'react'
import ReactJson from 'react-json-view'
import Skeleton from 'react-loading-skeleton'
import yaml from 'js-yaml'

import { Table, TableHead, TableBody, TableRow, TableCell, Divider, Menu, MenuItem, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, Button } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'

import { makeStyles } from '@material-ui/styles'

import Modal from '../../../Utils/Modal'
import FileDrop from '../../../Utils/FileDrop'
import { API_VERSIONS } from '../../../Utils/constants'

import { useController } from '../../../ControllerProvider'
import { useFeedback } from '../../../Utils/FeedbackContext'
import { get as lget } from 'lodash'

import { parseMicroservice } from '../../../Utils/ApplicationParser'

import Status from '../../../Utils/Status'

const useStyles = makeStyles(theme => ({
  avatarList: {
    color: 'white',
    backgroundColor: 'var(--statusColor, white)',
    boxShadow: `0px 2px 2px ${theme.colors.carbon}`
  },
  msvcChipList: {
    display: 'flex',
    flexDirection: 'column',
    width: '20%',
    flex: '1',
    paddingRight: '15px'
  },
  msvcChip: {
    marginTop: 'var(--mTop, 0px)',
    backgroundColor: `var(--color, ${theme.colors.cobalt})`,
    fontSize: '10px',
    borderRadius: '5px',
    height: '20px',
    margin: '2px',
    width: '100px',
    color: 'white',
    '& .MuiChip-label': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'block'
    }
  },
  jsonDisplay: {
    width: '99%',
    minHeight: '30rem',
    fontFamily: '"Lucida Console", Monaco, monospace',
    fontSize: '0.8rem',
    lineHeight: '1.2'
  },
  listTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    color: theme.palette.text.primary,
    padding: '20px'
  },
  link: {
    color: theme.palette.text.primary,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  hiddenInput: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1'
  }
}))

export default function ApplicationList ({ applications: unfilteredApplications, filter, loading, application, agents, selectApplication }) {
  const classes = useStyles()
  const { request } = useController()
  const { pushFeedback } = useFeedback()
  const [fileParsing, setFileParsing] = React.useState(false)
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false)
  const [openStartStopModal, setOpenStartStopModal] = React.useState(false)
  const [openDeleteApplicationModal, setOpenDeleteApplicationModal] = React.useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null)
  const [applicationMenu, setApplicationMenu] = React.useState(unfilteredApplications[0] || {})

  const applications = unfilteredApplications.filter(a => a.name.toLowerCase().includes(filter))

  const handleCloseMenu = () => setMenuAnchorEl(null)
  const openMenu = (a, e) => {
    setApplicationMenu(a)
    setMenuAnchorEl(e.currentTarget)
  }
  const openDetails = () => {
    setOpenDetailsModal(true)
    handleCloseMenu()
  }
  const openStartStop = () => {
    setOpenStartStopModal(true)
    handleCloseMenu()
  }
  const openDeleteApplication = () => {
    setOpenDeleteApplicationModal(true)
    handleCloseMenu()
  }

  const toggleApplication = async (application) => {
    try {
      const res = await request(`/api/v3/application/${application.name}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ isActivated: !application.isActivated })
      })
      if (res.ok) {
        pushFeedback({ message: application.isActivated ? 'Application stopped!' : 'Application started!', type: 'success' })
        setOpenStartStopModal(false)
      } else {
        pushFeedback({ message: res.statusText, type: 'error' })
      }
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
    }
  }

  const deleteApplication = async (application) => {
    try {
      const res = await request(`/api/v3/application/${application.name}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        pushFeedback({ message: 'Application deleted!', type: 'success' })
        setOpenDeleteApplicationModal(false)
      } else {
        pushFeedback({ message: res.statusText, type: 'error' })
      }
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
    }
  }

  const parseApplicationFile = async (doc) => {
    if (API_VERSIONS.indexOf(doc.apiVersion) === -1) {
      return [{}, `Invalid API Version ${doc.apiVersion}, current version is ${API_VERSIONS.slice(-1)[0]}`]
    }
    if (doc.kind !== 'Application') {
      return [{}, `Invalid kind ${doc.kind}`]
    }
    if (!doc.metadata || !doc.spec) {
      return [{}, 'Invalid YAML format']
    }
    const application = {
      name: lget(doc, 'metadata.name', undefined),
      ...doc.spec,
      isActivated: true,
      microservices: await Promise.all((doc.spec.microservices || []).map(async m => parseMicroservice(m)))
    }

    return [application]
  }

  const deployApplication = async (application, newApplication) => {
    const url = `/api/v3/application${newApplication ? '' : `/${application.name}`}`
    try {
      const res = await request(url, {
        method: newApplication ? 'POST' : 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(application)
      })
      return res
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
    }
  }

  const readApplicationFile = async (item) => {
    setFileParsing(true)
    const file = item.files[0]
    if (file) {
      const reader = new window.FileReader()

      reader.onload = async function (evt) {
        try {
          const doc = yaml.safeLoad(evt.target.result)
          console.log({ doc })
          const [applicationData, err] = await parseApplicationFile(doc)
          if (err) {
            setFileParsing(false)
            return pushFeedback({ message: err, type: 'error' })
          }
          const newApplication = !applications.find(a => a.name === applicationData.name)
          const res = await deployApplication(applicationData, newApplication)
          if (!res.ok) {
            try {
              const error = await res.json()
              pushFeedback({ message: error.message, type: 'error' })
            } catch (e) {
              pushFeedback({ message: res.statusText, type: 'error' })
            }
          } else {
            pushFeedback({ message: newApplication ? 'Application deployed!' : 'Application updated!', type: 'success' })
          }
          setFileParsing(false)
        } catch (e) {
          pushFeedback({ message: e.message, type: 'error' })
          setFileParsing(false)
        }
      }

      reader.onerror = function (evt) {
        pushFeedback({ message: evt, type: 'error' })
        setFileParsing(false)
      }

      reader.readAsText(file, 'UTF-8')
    }
  }

  const handleFileInput = (e) => {
    readApplicationFile(e.target)
  }

  return (
    <>
      <div className={classes.listTitle}>
        <FileDrop {...{ onDrop: readApplicationFile, loading: fileParsing }}>
          <div className={classes.flexColumn}>
            <input onChange={handleFileInput} class='box__file' type='file' name='files[]' id='file' className={classes.hiddenInput} />
            <span>
              <label for='file' className={classes.link} style={{ marginRight: '5px' }}>Choose a file</label>
              or Drag a file here to deploy an application
            </span>
          </div>
        </FileDrop>
      </div>
      <Table stickyHeader classes={{ stickyHeader: { top: '48px' } }}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableTitle}>Name</TableCell>
            <TableCell className={classes.tableTitle} align='right'>Msvcs</TableCell>
            <TableCell className={classes.tableTitle} align='right' />
          </TableRow>
        </TableHead>
        <TableBody>
          {(loading ? [1, 2, 3].map((idx) => <TableRow key={idx}><TableCell colSpan={4}><Skeleton height={72} /></TableCell></TableRow>) : applications.map(a => {
            return (
              <TableRow button key={a.uuid}>
                <TableCell onClick={() => selectApplication(a)}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Status status={a.isActivated ? 'RUNNING' : 'OFFLINE'} />
                    <span className={classes.link} style={{ marginLeft: '15px' }}>{a.name}</span>
                  </div>
                </TableCell>
                <TableCell align='right'>{a.microservices.length}</TableCell>
                <TableCell align='right'>
                  <MoreIcon className={classes.action} onClick={(e) => { e.stopPropagation(); openMenu(a, e) }} />
                </TableCell>
              </TableRow>
            )
          }))}
        </TableBody>
      </Table>
      <Modal
        {...{
          open: openDetailsModal,
          title: `${applicationMenu.name} details`,
          onClose: () => setOpenDetailsModal(false)
        }}
      >
        <ReactJson title='Application' src={applicationMenu} name={false} />
      </Modal>
      <Dialog
        open={openStartStopModal}
        onClose={() => setOpenStartStopModal(false)}
      >
        <DialogTitle id='alert-dialog-title'>{`${applicationMenu.isActivated ? 'Stop' : 'Start'} ${applicationMenu.name}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {applicationMenu.isActivated ? 'Stopping an application will stop all its microservices' : 'Starting an application will start all its microservices'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStartStopModal(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => toggleApplication(applicationMenu)} color='primary' autoFocus>
            {applicationMenu.isActivated ? 'Stop' : 'Start'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteApplicationModal}
        onClose={() => setOpenDeleteApplicationModal(false)}
      >
        <DialogTitle id='alert-dialog-title'>Delete {applicationMenu.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span>Deleting an application will delete all its microservices.</span><br />
            <span>This is not reversible.</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteApplicationModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => deleteApplication(applicationMenu)} color='secondary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Menu
        id='agent-menu'
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={openDetails}>Details</MenuItem>
        <Divider />
        <MenuItem onClick={openStartStop}>{`${applicationMenu.isActivated ? 'Stop' : 'Start'}`}</MenuItem>
        <MenuItem onClick={openDeleteApplication}>Delete</MenuItem>
      </Menu>
    </>
  )
}
