import React from 'react'

import ReactJson from 'react-json-view'
import { Paper, Typography, makeStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'

import { useData } from '../../providers/Data'
import getSharedStyle from '../sharedStyles'

import { icons, dateFormat, MiBFactor, prettyBytes } from '../utils'
import moment from 'moment'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))
export default function MicroserviceDetails ({ microservice: selectedMicroservice, selectApplication, selectAgent }) {
  const { data } = useData()
  const classes = useStyles()
  const [openDeleteMicroserviceDialog, setOpenDeleteMicroserviceDialog] = React.useState(false)

  const { microservices, reducedAgents, reducedApplications } = data
  const microservice = (microservices || []).find(a => selectedMicroservice.uuid === a.uuid) || selectedMicroservice // Get live updates from data
  const agent = reducedAgents.byUUID[microservice.iofogUuid]

  const _getMicroserviceImage = m => {
    if (!agent) {
      return '--'
    }
    for (const img of microservice.images) {
      if (img.fogTypeId === agent.fogTypeId) {
        return img.containerImage
      }
    }
  }
  return (
    <>
      <Paper className={`section first ${classes.multiSections}`}>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Status</Typography>
          <span className={classes.subTitle}>{microservice.status.status}{microservice.status.status === 'PULLING' && ` (${microservice.status.percentage}%)`}</span>
          {microservice.status.errorMessage && <span className={classes.subTitle}>Error: <span className={classes.text}>{microservice.status.errorMessage}</span></span>}
        </div>
        <div className={classes.section} style={{ flex: '1 1 0px' }}>
          <Typography variant='subtitle2' className={classes.title}>
            <span>Description</span>
            <div className={classes.actions}>
              <icons.DeleteIcon onClick={() => setOpenDeleteMicroserviceDialog(true)} className={classes.action} title='Delete application' />
            </div>
          </Typography>
          <span className={classes.text}>{microservice.description}</span>
        </div>
      </Paper>
      <Paper className={`section ${classes.multiSections}`}>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Microservices Details</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Image</span>
            <span className={classes.text}>{_getMicroserviceImage(microservice)}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Application</span>
            <span className={`${classes.text} ${classes.action}`} onClick={() => selectApplication(reducedApplications.byName[microservice.application])}>{microservice.application}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Agent</span>
            {agent ? <span className={`${classes.text} ${classes.action}`} onClick={() => selectAgent(agent)}>{agent.name}</span> : ''}
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Created at</span>
            <span className={classes.text}>{moment(microservice.createdAt).format(dateFormat)}</span>
          </div>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Resource Utilization</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>CPU Usage</span>
            <span className={classes.text}>{(microservice.status.cpuUsage * 1).toFixed(2) + '%'}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Memory Usage</span>
            <span className={classes.text}>{`${prettyBytes((microservice.status.memoryUsage || 0 * MiBFactor))} / ${prettyBytes((agent.systemAvailableMemory || 0))} (${((microservice.status.memoryUsage / agent.systemAvailableMemory * 100) || 0).toFixed(2)}%)`}</span>
          </div>
        </div>
      </Paper>
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Ports</Typography>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }}>Internal</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>External</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Protocol</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>PublicLink</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {microservice.ports.map((p) => (
                <TableRow key={p.external}>
                  <TableCell component='th' scope='row'>
                    {p.internal}
                  </TableCell>
                  <TableCell align='right'>
                    {p.external}
                  </TableCell>
                  <TableCell align='right'>
                    {p.protocol === 'udp' ? p.protocol : 'tcp'}
                  </TableCell>
                  <TableCell align='right'>
                    {p.publicLink}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Volumes</Typography>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }}>Host</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Container</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Acces Mode</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {microservice.volumeMappings.map((p) => (
                <TableRow key={p.containerDestination}>
                  <TableCell component='th' scope='row'>
                    {p.hostDestination}
                  </TableCell>
                  <TableCell align='right'>
                    {p.containerDestination}
                  </TableCell>
                  <TableCell align='right'>
                    {p.accessMode}
                  </TableCell>
                  <TableCell align='right'>
                    {p.fogTypeId}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Environment variables</Typography>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableTitle} style={{ top: '44px', maxWidth: '200px' }}>Key</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px', maxWidth: '200px' }} align='right'>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {microservice.env.map((p) => (
                <TableRow key={p.key}>
                  <TableCell component='th' scope='row' style={{ maxWidth: '200px' }}>
                    {p.key}
                  </TableCell>
                  <TableCell align='right' style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                    {p.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Extra Hosts</Typography>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }}>Name</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Address</TableCell>
                <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {microservice.extraHosts.map((p) => (
                <TableRow key={p.name}>
                  <TableCell component='th' scope='row'>
                    {p.name}
                  </TableCell>
                  <TableCell align='right'>
                    {p.address}
                  </TableCell>
                  <TableCell align='right'>
                    {p.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Microservice JSON</Typography>
          <ReactJson title='Microservice' src={microservice} name={false} collapsed />
        </div>
      </Paper>
      <Dialog
        open={openDeleteMicroserviceDialog}
        onClose={() => { setOpenDeleteMicroserviceDialog(false) }}
      >
        <DialogTitle id='alert-dialog-title'>Delete {microservice.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span>This is not reversible.</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteMicroserviceDialog(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => setOpenDeleteMicroserviceDialog(false)} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
