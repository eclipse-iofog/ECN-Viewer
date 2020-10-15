import React from 'react'
import ReactJson from 'react-json-view'
import Skeleton from 'react-loading-skeleton'
import yaml from 'js-yaml'

import { List, ListItem, ListSubheader, Divider, ListItemAvatar, Chip, Avatar, ListItemText, Menu, MenuItem, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, Button } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'
import AppsIcon from '@material-ui/icons/ViewQuilt'

import { makeStyles } from '@material-ui/styles'

import { statusColor, msvcStatusColor, tagColor } from '../utils'
import Modal from '../../Utils/Modal'
import FileDrop from '../../Utils/FileDrop'
import { API_VERSIONS } from '../../Utils/constants'

import Icon from '@material-ui/core/Icon'
import { useConfig } from '../../providers/Config'
import { useMap } from '../../providers/Map'
import { useController } from '../../ControllerProvider'
import { useFeedback } from '../../Utils/FeedbackContext'
import { get as lget, uniqBy } from 'lodash'

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
    height: '50px',
    color: theme.palette.text.primary
  },
  link: {
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

const TagChip = ({ tag, first }) => {
  const classes = useStyles()
  if (!tag.icon) {
    return (
      <Chip
        size='small'
        label={tag.value}
        style={{
          '--mTop': first ? '0px' : '2px',
          '--color': tag.color || tagColor,
          color: 'white'
        }}
        className={classes.msvcChip}
        title={tag.value}
      />)
  }
  return (
    <Chip
      icon={<Icon style={{ fontSize: 16, color: 'white' }}>{tag.icon}</Icon>}
      size='small'
      label={tag.value}
      style={{
        '--mTop': first ? '0px' : '2px',
        '--color': tag.color || tagColor,
        color: 'white'
      }}
      className={classes.msvcChip}
      title={tag.value}
    />
  )
}

export default function ApplicationList ({ applications, loading, setAutozoom, agents, controllerInfo }) {
  const classes = useStyles()
  const { getTagDisplayInfo } = useConfig()
  const { request } = useController()
  const { setMap } = useMap()
  const { pushFeedback } = useFeedback()
  const [fileParsing, setFileParsing] = React.useState(false)
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false)
  const [openStartStopModal, setOpenStartStopModal] = React.useState(false)
  const [openDeleteApplicationModal, setOpenDeleteApplicationModal] = React.useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null)
  const [application, setApplication] = React.useState(applications[0] || {})
  const [agentsByName, setAgentsByName] = React.useState((agents || {}).reduce((res, agent) => { res[agent.name] = agent; return res }, {}))
  const [agentsByUUID, setAgentsByUUID] = React.useState((agents || {}).reduce((res, agent) => { res[agent.uuid] = agent; return res }, {}))

  React.useEffect(() => {
    const reduced = (agents || []).reduce((res, agent) => { res.byName[agent.name] = agent; res.byUUID[agent.uuid] = agent; return res }, {
      byName: {},
      byUUID: {}
    })
    setAgentsByName(reduced.byName)
    setAgentsByUUID(reduced.byUUID)
  }, [agents])

  const handleCloseMenu = () => setMenuAnchorEl(null)
  const openMenu = (e) => setMenuAnchorEl(e.currentTarget)
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

  const mapImages = (images) => {
    const imgs = []
    if (images.x86) {
      imgs.push({
        fogTypeId: 1,
        containerImage: images.x86
      })
    }
    if (images.arm) {
      imgs.push({
        fogTypeId: 2,
        containerImage: images.arm
      })
    }
    return imgs
  }

  const parseMicroserviceImages = async (fileImages) => {
    if (fileImages.catalogId) {
      return { registryId: undefined, images: undefined, catalogItemId: fileImages.catalogId }
    }
    const registryByName = {
      remote: 1,
      local: 2
    }
    const images = mapImages(fileImages)
    const registryId = fileImages.registry ? registryByName[fileImages.registry] || window.parseInt(fileImages.registry) : 1
    return { registryId, catalogItemId: undefined, images }
  }

  const _deleteUndefinedFields = (obj) => Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])

  const parseMicroservice = async (microservice) => {
    const { registryId, catalogItemId, images } = await parseMicroserviceImages(microservice.images)
    const microserviceData = {
      config: microservice.config ? JSON.stringify(microservice.config) : undefined,
      name: microservice.name,
      logSize: microservice.logSize,
      catalogItemId,
      iofogUuid: agentsByName[microservice.agent.name].uuid,
      registryId,
      ...microservice.container,
      ports: lget(microservice, 'container.ports', []).map(p => ({ ...p, publicPort: p.public })),
      volumeMappings: lget(microservice, 'container.volumes', []),
      cmd: lget(microservice, 'container.commands', []),
      env: lget(microservice, 'container.env', []),
      images,
      extraHosts: lget(microservice, 'container.extraHosts', [])
    }
    _deleteUndefinedFields(microserviceData)
    return microserviceData
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

  const selectApplication = (application) => {
    setApplication(application)
    setMap(uniqBy(application.microservices.map(m => agentsByUUID[m.iofogUuid]), a => a.uuid), null, false)
  }

  return (
    <>
      <List
        subheader={
          <ListSubheader component='div' id='agent-list-subheader' style={{ position: 'relative', marginBottom: '5px' }} disableGutters disableSticky>
            <div className={classes.listTitle}>
              <FileDrop {...{ onDrop: readApplicationFile, loading: fileParsing }}>
                <div className={classes.flexColumn}>
                  <span>Drag a file here to deploy an application</span>
                </div>
              </FileDrop>
            </div>
          </ListSubheader>
        }
      >
        {(loading ? [1, 2, 3].map((idx) => <ListItem key={idx}><ListItemText><Skeleton height={72} /></ListItemText></ListItem>) : applications.map(a => {
          const msvcs = a.microservices || []
          const tags = (a.tags || []).map(getTagDisplayInfo)
          return (
            <ListItem button key={a.id} onClick={() => selectApplication(a)} selected={a.id === application.id}>
              <ListItemAvatar>
                <Avatar style={{ '--statusColor': statusColor[a.isActivated ? 'RUNNING' : 'OFFLINE'] }} className={classes.avatarList}>
                  <AppsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText style={{ width: '100px', textOverflow: 'ellipsis' }} primary={a.name} secondary={`${msvcs.length} Microservices`} />
              <div className={classes.msvcChipList}>
                {tags.map((t, idx) => (
                  <TagChip key={t.value} tag={t} first={!idx} />
                ))}
              </div>
              <div className={classes.msvcChipList}>
                {msvcs.length > 4
                  ? (
                    <Chip
                      size='small'
                      label={`${msvcs.length} microservices`}
                      style={{
                        '--mTop': '0px',
                        '--color': msvcStatusColor[a.isActivated ? 'RUNNING' : 'UNKNOWN']
                      }}
                      className={classes.msvcChip}
                      title={`${msvcs.length} microservices`}
                    />
                  )
                  : msvcs.map((m, idx) => (
                    <React.Fragment key={m.uuid}>
                      <Chip
                        size='small'
                        label={m.name}
                        style={{
                          '--mTop': idx ? '2px' : '0px',
                          '--color': msvcStatusColor[a.isActivated && m.status.status === 'RUNNING' ? 'RUNNING' : 'UNKNOWN']
                        }}
                        className={classes.msvcChip}
                        title={m.name}
                      />
                    </React.Fragment>
                  ))}
              </div>
              <MoreIcon onClick={openMenu} />
            </ListItem>
          )
        }))}
      </List>
      <Modal
        {...{
          open: openDetailsModal,
          title: `${application.name} details`,
          onClose: () => setOpenDetailsModal(false)
        }}
      >
        <ReactJson title='Application' src={application} name={false} />
      </Modal>
      <Dialog
        open={openStartStopModal}
        onClose={() => setOpenStartStopModal(false)}
      >
        <DialogTitle id='alert-dialog-title'>{`${application.isActivated ? 'Stop' : 'Start'} ${application.name}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {application.isActivated ? 'Stopping an application will stop all its microservices' : 'Starting an application will start all its microservices'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStartStopModal(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => toggleApplication(application)} color='primary' autoFocus>
            {application.isActivated ? 'Stop' : 'Start'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDeleteApplicationModal}
        onClose={() => setOpenDeleteApplicationModal(false)}
      >
        <DialogTitle id='alert-dialog-title'>Delete {application.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span>Deleting an application will delete all its microservices.</span><br />
            <span>This is not reversible.</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteApplicationModal(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => deleteApplication(application)} color='primary' autoFocus>
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
        <MenuItem onClick={openStartStop}>{`${application.isActivated ? 'Stop' : 'Start'}`}</MenuItem>
        <MenuItem onClick={openDeleteApplication}>Delete</MenuItem>
      </Menu>
    </>
  )
}
