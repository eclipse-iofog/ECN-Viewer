import React, { useState, useEffect } from 'react'
import { useInterval } from '../hooks/useInterval'
import _ from 'lodash'

import GoogleMapReact from 'google-map-react'

import Paper from '@material-ui/core/Paper'
import Badge from '@material-ui/core/Badge'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import MemoryIcon from '@material-ui/icons/Memory'
import MoreIcon from '@material-ui/icons/MoreVert'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/styles'

import './layout.scss'

const useStyles = makeStyles({
  avatarList: {
    color: 'white',
    backgroundColor: 'var(--statusColor, white)',
    boxShadow: '0px 2px 2px #444'
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridColumnGap: '15px',
    marginBottom: '15px'
  },
  mapMarkerTransform: {
    transform: 'translate(-50%, -100%)',
    position: 'absolute'
  },
  mapMarker: {
    backgroundColor: 'var(--markerColor, gray)',
    borderRadius: '50% 50% 50% 0',
    border: '4px solid var(--markerColor, gray)',
    transform: 'rotate(-45deg)',
    '& .MuiSvgIcon-root': {
      transform: 'rotate(-45deg)'
    }
  }
})

export default function ECNViewer () {
  const classes = useStyles()
  const [flow, setFlow] = useState(1)
  const [msvc, setMicroservice] = useState()
  const [token, setToken] = useState('')

  const controller = {
    flows: [
      {
        'id': 1,
        'name': 'HealthcareWearableFlow',
        'description': '',
        'isActivated': true,
        'userId': 1
      },
      {
        id: 2,
        name: 'SmartCameraAIFlow',
        'description': '',
        'isActivated': true,
        'userId': 1
      }
    ],
    agents: [
      {
        'uuid': '67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f',
        'name': 'ioFog Agent',
        'location': null,
        'gpsMode': 'auto',
        'latitude': -36.8486,
        'longitude': 174.754,
        'description': null,
        'lastActive': 1560983352565,
        'daemonStatus': 'RUNNING',
        'daemonOperatingDuration': 593583,
        'daemonLastStart': 1560982726513,
        'memoryUsage': 197.0137939453125,
        'diskUsage': 0.00002233099985460285,
        'cpuUsage': 0.5494505763053894,
        'memoryViolation': '0',
        'diskViolation': '0',
        'cpuViolation': '0',
        'systemAvailableDisk': 54909857792,
        'systemAvailableMemory': 3473170432,
        'systemTotalCpu': 4.995870113372803,
        'securityStatus': 'OK',
        'securityViolationInfo': 'No violation',
        'catalogItemStatus': null,
        'repositoryCount': 2,
        'repositoryStatus': '[]',
        'systemTime': 1560983265930,
        'lastStatusTime': 1560983320096,
        'ipAddress': '172.17.0.4',
        'processedMessages': 75,
        'catalogItemMessageCounts': null,
        'messageSpeed': 0.2002202421426773,
        'lastCommandTime': 0,
        'networkInterface': 'eth0',
        'dockerUrl': 'unix:///var/run/docker.sock',
        'diskLimit': 50,
        'diskDirectory': '/var/lib/iofog-agent/',
        'memoryLimit': 4096,
        'cpuLimit': 80,
        'logLimit': 10,
        'logDirectory': '/var/log/iofog-agent/',
        'bluetoothEnabled': true,
        'abstractedHardwareEnabled': false,
        'logFileCount': 10,
        'version': '1.0.14',
        'isReadyToUpgrade': false,
        'isReadyToRollback': false,
        'statusFrequency': 30,
        'changeFrequency': 60,
        'deviceScanFrequency': 60,
        'tunnel': '',
        'watchdogEnabled': false,
        'created_at': '2019-06-19T22:18:55.391Z',
        'updated_at': '2019-06-19T22:29:12.565Z',
        'fogTypeId': 1,
        'userId': 1
      },
      {
        'uuid': '67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f2',
        'name': 'ioFog Agent2',
        'location': null,
        'gpsMode': 'auto',
        'latitude': -36.8486 + 0.010,
        'longitude': 174.754,
        'description': null,
        'lastActive': 1560983352565,
        'daemonStatus': 'RUNNING',
        'daemonOperatingDuration': 593583,
        'daemonLastStart': 1560982726513,
        'memoryUsage': 197.0137939453125,
        'diskUsage': 0.00002233099985460285,
        'cpuUsage': 0.5494505763053894,
        'memoryViolation': '0',
        'diskViolation': '0',
        'cpuViolation': '0',
        'systemAvailableDisk': 54909857792,
        'systemAvailableMemory': 3473170432,
        'systemTotalCpu': 4.995870113372803,
        'securityStatus': 'OK',
        'securityViolationInfo': 'No violation',
        'catalogItemStatus': null,
        'repositoryCount': 2,
        'repositoryStatus': '[]',
        'systemTime': 1560983265930,
        'lastStatusTime': 1560983320096,
        'ipAddress': '172.17.0.4',
        'processedMessages': 75,
        'catalogItemMessageCounts': null,
        'messageSpeed': 0.2002202421426773,
        'lastCommandTime': 0,
        'networkInterface': 'eth0',
        'dockerUrl': 'unix:///var/run/docker.sock',
        'diskLimit': 50,
        'diskDirectory': '/var/lib/iofog-agent/',
        'memoryLimit': 4096,
        'cpuLimit': 80,
        'logLimit': 10,
        'logDirectory': '/var/log/iofog-agent/',
        'bluetoothEnabled': true,
        'abstractedHardwareEnabled': false,
        'logFileCount': 10,
        'version': '1.0.14',
        'isReadyToUpgrade': false,
        'isReadyToRollback': false,
        'statusFrequency': 30,
        'changeFrequency': 60,
        'deviceScanFrequency': 60,
        'tunnel': '',
        'watchdogEnabled': false,
        'created_at': '2019-06-19T22:18:55.391Z',
        'updated_at': '2019-06-19T22:29:12.565Z',
        'fogTypeId': 1,
        'userId': 1
      },
      {
        'uuid': '67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f3',
        'name': 'ioFog Agent3',
        'location': null,
        'gpsMode': 'auto',
        'latitude': null,
        'longitude': null,
        'description': null,
        'lastActive': 1560983352565,
        'daemonStatus': 'UNKNOWN',
        'daemonOperatingDuration': 593583,
        'daemonLastStart': 1560982726513,
        'memoryUsage': 197.0137939453125,
        'diskUsage': 0.00002233099985460285,
        'cpuUsage': 0.5494505763053894,
        'memoryViolation': '0',
        'diskViolation': '0',
        'cpuViolation': '0',
        'systemAvailableDisk': 54909857792,
        'systemAvailableMemory': 3473170432,
        'systemTotalCpu': 4.995870113372803,
        'securityStatus': 'OK',
        'securityViolationInfo': 'No violation',
        'catalogItemStatus': null,
        'repositoryCount': 2,
        'repositoryStatus': '[]',
        'systemTime': 1560983265930,
        'lastStatusTime': 1560983320096,
        'ipAddress': '172.17.0.4',
        'processedMessages': 75,
        'catalogItemMessageCounts': null,
        'messageSpeed': 0.2002202421426773,
        'lastCommandTime': 0,
        'networkInterface': 'eth0',
        'dockerUrl': 'unix:///var/run/docker.sock',
        'diskLimit': 50,
        'diskDirectory': '/var/lib/iofog-agent/',
        'memoryLimit': 4096,
        'cpuLimit': 80,
        'logLimit': 10,
        'logDirectory': '/var/log/iofog-agent/',
        'bluetoothEnabled': true,
        'abstractedHardwareEnabled': false,
        'logFileCount': 10,
        'version': '1.0.14',
        'isReadyToUpgrade': false,
        'isReadyToRollback': false,
        'statusFrequency': 30,
        'changeFrequency': 60,
        'deviceScanFrequency': 60,
        'tunnel': '',
        'watchdogEnabled': false,
        'created_at': '2019-06-19T22:18:55.391Z',
        'updated_at': '2019-06-19T22:29:12.565Z',
        'fogTypeId': 1,
        'userId': 1
      },
      {
        'uuid': '67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f4',
        'name': 'ioFog Agent4',
        'location': null,
        'gpsMode': 'auto',
        'latitude': -36.8486 - 0.010,
        'longitude': 174.754,
        'description': null,
        'lastActive': 1560983352565,
        'daemonStatus': 'OFFLINE',
        'daemonOperatingDuration': 593583,
        'daemonLastStart': 1560982726513,
        'memoryUsage': 197.0137939453125,
        'diskUsage': 0.00002233099985460285,
        'cpuUsage': 0.5494505763053894,
        'memoryViolation': '0',
        'diskViolation': '0',
        'cpuViolation': '0',
        'systemAvailableDisk': 54909857792,
        'systemAvailableMemory': 3473170432,
        'systemTotalCpu': 4.995870113372803,
        'securityStatus': 'OK',
        'securityViolationInfo': 'No violation',
        'catalogItemStatus': null,
        'repositoryCount': 2,
        'repositoryStatus': '[]',
        'systemTime': 1560983265930,
        'lastStatusTime': 1560983320096,
        'ipAddress': '172.17.0.4',
        'processedMessages': 75,
        'catalogItemMessageCounts': null,
        'messageSpeed': 0.2002202421426773,
        'lastCommandTime': 0,
        'networkInterface': 'eth0',
        'dockerUrl': 'unix:///var/run/docker.sock',
        'diskLimit': 50,
        'diskDirectory': '/var/lib/iofog-agent/',
        'memoryLimit': 4096,
        'cpuLimit': 80,
        'logLimit': 10,
        'logDirectory': '/var/log/iofog-agent/',
        'bluetoothEnabled': true,
        'abstractedHardwareEnabled': false,
        'logFileCount': 10,
        'version': '1.0.14',
        'isReadyToUpgrade': false,
        'isReadyToRollback': false,
        'statusFrequency': 30,
        'changeFrequency': 60,
        'deviceScanFrequency': 60,
        'tunnel': '',
        'watchdogEnabled': false,
        'created_at': '2019-06-19T22:18:55.391Z',
        'updated_at': '2019-06-19T22:29:12.565Z',
        'fogTypeId': 1,
        'userId': 1
      }
    ],
    microservices: [
      {
        'uuid': 'RHC6tVtxJbGFVvzG7xkY9XWDBhb9KQzw',
        'config': '{}',
        'name': 'Bluetooth for Fog 67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f',
        'rootHostAccess': true,
        'logSize': 50,
        'delete': false,
        'deleteWithCleanup': false,
        'flowId': null,
        'catalogItemId': 2,
        'iofogUuid': '67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f',
        'userId': 1,
        'ports': [],
        'volumeMappings': [],
        'routes': [],
        'env': [],
        'cmd': []
      },
      {
        'uuid': 'cTnLwDjct8R9hyp3cp4Lvh7Bkn4QWCqv',
        'config': '{"test_mode": true, "data_label": "Anonymous Person"}',
        'name': 'heart-rate-monitor',
        'rootHostAccess': false,
        'logSize': 0,
        'delete': false,
        'deleteWithCleanup': false,
        'flowId': 1,
        'catalogItemId': 102,
        'iofogUuid': '67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f',
        'userId': 1,
        'ports': [],
        'volumeMappings': [],
        'routes': [
          'yPn8XXDPdbgwmPb44ZL7r2dNQTvkKRt6'
        ],
        'env': [],
        'cmd': []
      },
      {
        'uuid': 'yPn8XXDPdbgwmPb44ZL7r2dNQTvkKRt6',
        'config': '{}',
        'name': 'heart-rate-viewer',
        'rootHostAccess': false,
        'logSize': 0,
        'delete': false,
        'deleteWithCleanup': false,
        'flowId': 1,
        'catalogItemId': 103,
        'iofogUuid': '67hhQkWPrZdg83fN3KHhTFgfjvMhnG7f',
        'userId': 1,
        'ports': [
          {
            'internal': 80,
            'external': 5000,
            'publicMode': false
          }
        ],
        'volumeMappings': [],
        'routes': [],
        'env': [],
        'cmd': []
      }
    ]
  }

  useInterval(() => {
    window.fetch('/api/data')
      .then(res => res.json())
      .then(console.log)
  }, [1000])

  const [agent, setAgent] = useState(() => controller.agents[0])

  const agentsPerFlow = _.mapValues(
    _.groupBy(controller.microservices, 'flowId'),
    msvcs => _.uniqBy(msvcs, 'iofogUuid').map(msvc => _.find(controller.agents, a => a.uuid === msvc.iofogUuid))
  )

  const msvcsPerAgent = _.groupBy(controller.microservices, 'iofogUuid')

  const map = {
    center: agent ? [agent.latitude, agent.longitude] : [0, 0],
    zoom: 9
  }

  const activeAgents = controller.agents.filter(a => a.daemonStatus === 'RUNNING')
  const activeFlows = controller.flows.filter(f => f.isActivated === true)
  const activeMsvcs = activeAgents.reduce((res, a) => res.concat(msvcsPerAgent[a.uuid] || []), [])
  console.log({ activeMsvcs })

  const statusColor = {
    'RUNNING': 'green',
    'UNKNOWN': 'gray',
    'OFFLINE': 'red'
  }

  return (
    <div className='wrapper'>
      <div className='box header'>Header</div>
      <div className='box sidebar'>
        <Typography variant='h5'>Active resources</Typography>
        <br />
        <div className={classes.summary}>
          <Paper>
            <Typography variant='h3'>{activeFlows.length}</Typography>
            <Typography variant='subtitle1'>Flows</Typography>
          </Paper>
          <Paper>
            <Typography variant='h3'>{activeAgents.length}</Typography>
            <Typography variant='subtitle1'>Agents</Typography>
          </Paper>
          <Paper>
            <Typography variant='h3'>{activeMsvcs.length}</Typography>
            <Typography variant='subtitle1'>Microservices</Typography>
          </Paper>
        </div>
        <Divider />
        <List
          subheader={
            <ListSubheader component='div' id='agent-list-subheader'>
              Agents - <small>{controller.agents.length} nodes</small>
            </ListSubheader>
          }
        >
          {controller.agents.map(a => (
            <ListItem button key={a.uuid} onClick={() => setAgent(a)} selected={a.uuid === agent.uuid}>
              <ListItemAvatar>
                <Avatar style={{ '--statusColor': statusColor[a.daemonStatus] }} className={classes.avatarList}>
                  <MemoryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={a.name} secondary={`${(msvcsPerAgent[a.uuid] || []).length} Microservices`} />
              <MoreIcon />
            </ListItem>
          ))}
        </List>
      </div>
      <div className='content'>
        <GoogleMapReact
          {...map}
        >
          {controller.agents.filter(a => (_.isFinite(a.latitude) && _.isFinite(a.longitude))).map(a =>
            <div
              lat={a.latitude} lng={a.longitude}
              className={classes.mapMarkerTransform}
              onClick={() => setAgent(a)}
            >
              <Badge color='primary' badgeContent={(msvcsPerAgent[a.uuid] || []).length} invisible={a.uuid !== agent.uuid} className={classes.margin}>
                <Avatar
                  style={a.uuid === agent.uuid ? { '--markerColor': 'blue' } : {}}
                  className={classes.mapMarker}>
                  <MemoryIcon />
                </Avatar>
              </Badge>
            </div>
          )}
        </GoogleMapReact>
      </div>
      <div className='box footer'>Footer</div>
    </div>
  )
}
