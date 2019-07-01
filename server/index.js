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
const bodyParser = require('body-parser')
const proxy = require('express-http-proxy')

const PORT = process.env.PORT || 80
const controllerConfig = require('./config/controller.json')

const controller = require('./controllers/controller')

const fetchData = async () => {
  if (process.env.MOCK) return controller.getMockData()

  let ctrl = controller.find()

  try {
    const token = await controller.authenticate(ctrl)

    console.log('====> Updating controller data...')
    const agents = await controller.getAgents(ctrl, token)
    const flows = await controller.getFlows(ctrl, token)
    const microservices = await controller.getMicroservices(ctrl, flows, token)
    console.log('====> Controller data updated')

    return {
      info: ctrl.info,
      agents,
      flows,
      microservices
    }
  } catch (e) {
    console.log({ e })
    console.log({ request: e.response.request })
    return {
      agents: [],
      flows: [],
      microservices: [],
      info: {
        ...ctrl.info,
        error: _.get(e, 'response.body', e)
      }
    }
  }
}

const runServer = async () => {
  app.use('/', express.static(path.join(__dirname, '../build')))

  app.use(bodyParser.json())

  app.get('/api/controller', async (req, res) => {
    const data = await fetchData()
    res.status(200).json(data)
  })

  app.post('/api/controller/connect', async (req, res) => {
    try {
      await controller.connect(req.body)
      return res.sendStatus(204)
    } catch (e) {
      console.log({ e })
      return res.status(500).json(e)
    }
  })

  app.use('/api/controllerAPI', async (req, res, next) => {
    const ctrl = controller.find()
    proxy(ctrl.address, {
      proxyReqOptDecorator: async (proxyReqOpts, srcReq) => {
        // recieves an Object of headers, returns an Object of headers.
        const token = await controller.authenticate(ctrl)
        proxyReqOpts.headers['Authorization'] = token
        return proxyReqOpts
      }
    })(req, res, next)
  })

  app.use('/api/agentApi', (req, res, next) => {
    console.log({ headers: req.headers })
    proxy(req.headers.iofogapi)(req, res, next)
  })

  await controller.connect(controllerConfig)

  app.listen(PORT)
}

runServer()
