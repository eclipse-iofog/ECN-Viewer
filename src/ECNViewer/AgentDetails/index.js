import React from 'react'

import ReactJson from 'react-json-view'
import { Paper, Typography, makeStyles, Icon, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'

import PlayIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import RestartIcon from '@material-ui/icons/Replay'
import DetailsIcon from '@material-ui/icons/ArrowForward'
import DeleteIcon from '@material-ui/icons/HighlightOff'

import { useData } from '../../providers/Data'
import { dateFormat, MiBFactor, fogTypes } from '../utils'

import getSharedStyle from '../sharedStyles'

import moment from 'moment'
import prettyBytes from 'pretty-bytes'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))

export default function AgentDetails ({ agent: selectedAgent, selectApplication, selectMicroservice }) {
  const { data } = useData()
  const classes = useStyles()

  const { msvcsPerAgent, controller, applications } = data
  const agent = (controller.agents || []).find(a => selectedAgent.uuid === a.uuid) || selectedAgent // Get live updates from data
  const applicationsByName = React.useMemo(() => {
    return msvcsPerAgent[agent.uuid].reduce((acc, m) => {
      if (acc[m.application]) { acc[m.application].microservices.push(m) } else {
        acc[m.application] = {
          microservices: [m],
          application: applications.find(a => a.name === m.application)
        }
      }
      return acc
    }, {})
  }, [msvcsPerAgent, agent])
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
          <span className={classes.subTitle}>Type: <span className={classes.text}>{fogTypes[agent.fogTypeId]}</span></span>
          <span className={classes.subTitle}>Version: <span className={classes.text}>{agent.version}</span></span>
        </div>
      </Paper>
      <Paper className={`section ${classes.multiSections}`}>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Agent Details</Typography>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Last Active</span>
            <span className={classes.text}>{moment(agent.lastStatusTime).format(dateFormat)}</span>
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
          <div className={classes.subSection}>
            <span className={classes.subTitle}>CPU Usage</span>
            <span className={classes.text}>{(agent.cpuUsage * 1).toFixed(2) + '%'}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Memory Usage</span>
            <span className={classes.text}>{`${prettyBytes((agent.memoryUsage * MiBFactor))} / ${prettyBytes((agent.systemAvailableMemory))} (${(agent.memoryUsage * MiBFactor / agent.systemAvailableMemory * 100).toFixed(2)}%)`}</span>
          </div>
          <div className={classes.subSection}>
            <span className={classes.subTitle}>Disk Usage</span>
            <span className={classes.text}>{`${prettyBytes((agent.diskUsage * MiBFactor))} / ${prettyBytes((agent.systemAvailableDisk))} (${(agent.diskUsage * MiBFactor / agent.systemAvailableDisk * 100).toFixed(2)}%)`}</span>
          </div>
        </div>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Edge Resources</Typography>
          {agent.edgeResources.map(er => (
            <div key={`${er.name}_${er.version}`} className={classes.edgeResource}>
              <div className={classes.erIconContainer} style={{ '--color': er.display.color }}>
                {er.display && er.display.icon && <Icon title={er.display.name || er.name} className={classes.erIcon}>{er.display.icon}</Icon>}
              </div>
              <div className={classes.subTitle} style={{ marginLeft: '5px' }}>{(er.display && er.display.name) || er.name} {er.version}</div>
            </div>
          ))}
        </div>
      </Paper>
      {Object.keys(applicationsByName).map(applicationName => (
        <Paper key={applicationName} className='section'>
          <div className={classes.section}>
            <Typography variant='subtitle2' className={classes.title}>
              <span>{applicationName}</span>
              <div className={classes.actions}>
                {applicationsByName[applicationName].isActivated
                  ? <StopIcon className={classes.action} title='Stop application' />
                  : <PlayIcon className={classes.action} title='Start application' />}
                <RestartIcon className={classes.action} title='Restart application' />
                <DeleteIcon className={classes.action} title='Delete application' />
                <DetailsIcon className={classes.action} onClick={() => selectApplication(applicationsByName[applicationName].application)} title='Application Details' />
              </div>
            </Typography>
            <Table>
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
            </Table>
          </div>
        </Paper>
      ))}
      <Paper className='section'>
        <div className={classes.section}>
          <Typography variant='subtitle2' className={classes.title}>Agent JSON</Typography>
          <ReactJson title='Agent' src={agent} name={false} collapsed />
        </div>
      </Paper>
    </>
  )
}
