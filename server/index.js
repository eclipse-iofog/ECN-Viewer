/*
 * *******************************************************************************
 *   Copyright (c) 2019 Edgeworx, Inc.
 *
 *   This program and the accompanying materials are made available under the
 *   terms of the Eclipse Public License v. 2.0 which is available at
 *   http://www.eclipse.org/legal/epl-2.0
 *
 *   SPDX-License-Identifier: EPL-2.0
 * *******************************************************************************
 */

const express = require('express')
const app = express()
const path = require('path')
const _ = require('lodash')
const request = require('superagent')
const PORT = process.env.PORT || 80

const IPLookUp = 'http://ip-api.com/json/'

const controller = process.env.MOCK
  ? {
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
  : {
    agents: [],
    flows: [],
    microservices: []
  }

const controllerConfig = require('./config/controller.json')
controllerConfig.address = `http://${controllerConfig.ip}:${controllerConfig.port || 80}/`

const lookUpController = async () => {
  const localhost = new RegExp('(0\.0\.0\.0|localhost|127\.0\.0\.1|192\.168\.)')
  const ip = localhost.test(controllerConfig.ip) ? '8.8.8.8' : controllerConfig.ip
  const response = await request(IPLookUp + ip)
  controller.info = response.body
}

const connectToController = async () => {
  if (process.env.MOCK) return
  try {
    console.log('====> Login in ...')
    const response = await request
      .post(controllerConfig.address + 'api/v3/user/login')
      .send({ ...controllerConfig.user })
    return response.body.accessToken
  } catch (e) {
    console.log('====> Failed to login')
    return connectToController()
  }
}

const runPoll = async () => {
  if (process.env.MOCK) return

  let token = await connectToController()

  const interval = setInterval(async () => {
    const newController = {
      agents: [],
      flows: [],
      microservices: []
    }
    try {
      console.log('====> Updating controller data...')

      const agentResponse = await request
        .get(controllerConfig.address + 'api/v3/iofog-list')
        .set({ Authorization: token })
      newController.agents = agentResponse.body.fogs

      const flowResponse = await request
        .get(controllerConfig.address + 'api/v3/flow')
        .set({ Authorization: token })
      newController.flows = flowResponse.body.flows

      newController.microservices = []
      for (const flow of controller.flows) {
        const microservicesResponse = await request
          .get(controllerConfig.address + 'api/v3/microservices')
          .set({ Authorization: token })
          .query({ flowId: flow.id })
        newController.microservices = newController.microservices.concat(microservicesResponse.body.microservices)
      }

      controller.agents = newController.agents
      controller.microservices = newController.microservices
      controller.flows = newController.flows
      controller.info.error = null
      console.log('====> Controller data updated')
    } catch (e) {
      console.log({ e })
      controller.info.error = _.get(e, 'response.body', e)
      if (e.status === 401) {
        clearInterval(interval)
        runPoll()
      }
    }
  }, 5000)
}

const runServer = async () => {
  app.use('/', express.static(path.join(__dirname, '../build')))

  app.get('/api/data', (req, res) => {
    res.status(200).json(controller)
  })

  try {
    await lookUpController()
  } catch (e) {
    controller.info = {
      lat: 'Unknown',
      lon: 'Unknown',
      query: controllerConfig.ip
    }
  }

  runPoll()

  app.listen(PORT)
}

runServer()
