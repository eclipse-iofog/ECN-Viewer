import React from 'react'

import ReactJson from 'react-json-view'
import { Paper, Typography, makeStyles, Icon, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'

import PlayIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import RestartIcon from '@material-ui/icons/Replay'
import DetailsIcon from '@material-ui/icons/ArrowForward'
import DeleteIcon from '@material-ui/icons/HighlightOff'

import { useData } from '../../providers/Data'

import getSharedStyle from '../sharedStyles'
import { MiBFactor, dateFormat } from '../utils'

import moment from 'moment'
import prettyBytes from 'pretty-bytes'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))
export default function ApplicationDetails ({ application: selectedApplication, selectApplication, selectMicroservice }) {
  const { data } = useData()
  const classes = useStyles()

  const { applications } = data
  const application = (applications || []).find(a => selectedApplication.name === a.name) || selectedApplication // Get live updates from data

  return (
    <>
      <Paper className={`section first ${classes.multiSections}`}>
        <div className={classes.section} style={{ flex: '2 1 0px' }}>
          <Typography variant='subtitle2' className={classes.title}>Description</Typography>
          <span className={classes.text}>{application.description}</span>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Info</Typography>
          <span className={classes.subTitle}>Status: <span className={classes.text}>{application.isActivated ? 'RUNNING' : 'STOPPED'}</span></span>
        </div>
      </Paper>
      <Paper className={`section ${classes.multiSections}`}>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Application Details</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Last Active</span>
            <span className={classes.text}>{moment(application.lastStatusTime).format(dateFormat)}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>IP Address</span>
            <span className={classes.text}>{application.ipAddressExternal}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Processed Messages</span>
            <span className={classes.text}>{application.processedMessages}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Created at</span>
            <span className={classes.text}>{moment(application.createdAt).format(dateFormat)}</span>
          </div>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Resource Utilization</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>CPU Usage</span>
            <span className={classes.text}>{(application.cpuUsage * 1).toFixed(2) + '%'}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Memory Usage</span>
            {/* <span className={classes.text}>{`${prettyBytes((application.memoryUsage * MiBFactor))} / ${prettyBytes((application.systemAvailableMemory))} (${(application.memoryUsage * MiBFactor / application.systemAvailableMemory * 100).toFixed(2)}%)`}</span> */}
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Disk Usage</span>
            {/* <span className={classes.text}>{`${prettyBytes((application.diskUsage * MiBFactor))} / ${prettyBytes((application.systemAvailableDisk))} (${(application.diskUsage * MiBFactor / application.systemAvailableDisk * 100).toFixed(2)}%)`}</span> */}
          </div>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Edge Resources</Typography>
          {/* {application.edgeResources.map(er => (
            <div key={`${er.name}_${er.version}`} className={classes.edgeResource}>
              <div className={classes.erIconContainer} style={{ '--color': er.display.color }}>
                {er.display && er.display.icon && <Icon title={er.display.name || er.name} className={classes.erIcon}>{er.display.icon}</Icon>}
              </div>
              <div className={classes.subTitle} style={{ marginLeft: '5px' }}>{(er.display && er.display.name) || er.name} {er.version}</div>
            </div>
          ))} */}
        </div>
      </Paper>
      {application.microservices.map(microservice => (
        <Paper key={microservice.uuid} className='section'>
          <div className={classes.section}>
            <Typography variant='subtitle2' className={classes.title}>
              <span>{microservice.name}</span>
              <div className={classes.actions}>
                {microservice.status.status === 'RUNNING'
                  ? <StopIcon className={classes.action} title='Stop application' />
                  : <PlayIcon className={classes.action} title='Start application' />}
                <RestartIcon className={classes.action} title='Restart application' />
                <DeleteIcon className={classes.action} title='Delete application' />
                <DetailsIcon className={classes.action} onClick={() => selectMicroservice(microservice)} title='Microservice Details' />
              </div>
            </Typography>
            <ReactJson title='Microservice' src={microservice} name={false} collapsed />
            {/* <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableTitle}>Microservice Name</TableCell>
                  <TableCell className={classes.tableTitle} align='right'>Status</TableCell>
                  <TableCell className={classes.tableTitle} align='right'>Ports</TableCell>
                  <TableCell className={classes.tableTitle} align='right'>Volumes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicationsByName[applicationName].microservices.map((row) => (
                  <TableRow key={row.uuid}>
                    <TableCell component='th' scope='row' onClick={() => selectMicroservice(row)}>
                      {row.name}
                    </TableCell>
                    <TableCell align='right'>{row.status.status}{row.status.status === 'PULLING' && ` (${row.status.percentage}%)`}</TableCell>
                    <TableCell align='right'>
                      {row.ports.map(p => (
                        <div key={p.internal}>{p.internal}:{p.external}/{p.protocol === 'udp' ? 'udp' : 'tcp'}</div>
                      ))}
                    </TableCell>
                    <TableCell align='right'>
                      {row.volumeMappings.map(p => (
                        <div key={p.id}>{p.hostDestination}:{p.containerDestination}:{p.accessMode}</div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          </div>
        </Paper>
      ))}
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Application JSON</Typography>
          <ReactJson title='Agent' src={application} name={false} collapsed />
        </div>
      </Paper>
    </>
  )
}
