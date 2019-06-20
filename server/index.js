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
const _ = require('lodash')
const path = require('path')
const request = require('superagent')
const PORT = process.env.PORT || 5555

const controller = {
  agents: [],
  flows: [],
  microservices: []
}

const controllerConfig = require('./config/controller.json')

const connectToController = async () => {
  const response = await request
    .post(controllerConfig.address + 'api/v3/user/login')
    .send({ ...controllerConfig.user })
  return response.body.accessToken
}

const runPoll = (token) => {
  setInterval(async () => {
    const newController = {
      agents: [],
      flows: [],
      microservices: []
    }
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
  }, 5000)
}

const runServer = async () => {
  app.use('/', express.static(path.join(__dirname, 'build')))

  app.get('/api/data', (req, res) => {
    res.status(200).json(controller)
  })

  const token = await connectToController()
  runPoll(token)

  app.listen(PORT)
}

runServer()
