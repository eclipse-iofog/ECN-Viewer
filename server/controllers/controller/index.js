const request = require('superagent')

const { get, set } = require('./model')

const IPLookUp = 'http://ip-api.com/json/'

const find = get

const authenticate = async (controller) => {
  if (process.env.MOCK) return

  console.log('====> Login in ...')
  const response = await request
    .post(controller.address + 'api/v3/user/login')
    .send({ ...controller.user })
  console.log('====> Logged in')
  return response.body.accessToken
}

const getFlows = async (controller, token) => {
  const flowResponse = await request
    .get(controller.address + 'api/v3/flow')
    .set({ Authorization: token })
  return flowResponse.body.flows
}

const getAgents = async (controller, token) => {
  const agentResponse = await request
    .get(controller.address + 'api/v3/iofog-list')
    .set({ Authorization: token })
  return agentResponse.body.fogs
}

const getMicroservices = async (controller, flows, token) => {
  let microservices = []
  for (const flow of flows) {
    const microservicesResponse = await request
      .get(controller.address + 'api/v3/microservices')
      .set({ Authorization: token })
      .query({ flowId: flow.id })
    microservices = microservices.concat(microservicesResponse.body.microservices)
  }
  return microservices
}

const getCatalog = async (controller, token) => {
  const agentResponse = await request
    .get(controller.address + 'api/v3/catalog/microservices')
    .set({ Authorization: token })
  return agentResponse.body.catalogItems
}

const removeMicroservice = (controller, uuid, token) => {
  return request
    .delete(controller.address + `api/v3/${uuid}`)
    .set({ Authorization: token })
    .send({ withCleanup: true })
}

const connect = async (controllerConfig) => {
  let controller = {
    ...controllerConfig,
    address: `http://${controllerConfig.ip}:${controllerConfig.port || 80}/`
  }

  let ipInfo = {}
  try {
    ipInfo = await lookUpControllerInfo(controller)
  } catch (e) {
    ipInfo = {
      lat: 'Unknown',
      lon: 'Unknown',
      query: controller.ip
    }
  }

  set({
    ...controller,
    info: {
      location: ipInfo,
      ...controllerConfig,
      user: {
        email: controllerConfig.user.email
      }
    }
  })
}

const lookUpControllerInfo = async (controllerConfig) => {
  const localhost = new RegExp('(0\.0\.0\.0|localhost|127\.0\.0\.1|192\.168\.)')
  const ip = localhost.test(controllerConfig.ip) ? '8.8.8.8' : controllerConfig.ip
  const response = await request(IPLookUp + ip)
  return response.body
}

const getMockData = () => ({
  info: get().info,
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
})

module.exports = {
  find,
  authenticate,
  getFlows,
  getAgents,
  getMicroservices,
  getCatalog,
  removeMicroservice,
  getMockData,
  connect
}
