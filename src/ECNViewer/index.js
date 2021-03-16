import React, { useState } from 'react'
import useRecursiveTimeout from '../hooks/useInterval'
import { find, groupBy, get, isFinite } from 'lodash'

import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/styles'

import ControllerInfo from './ControllerInfo'
import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import ApplicationList from './ApplicationList'
import Map from './Map'
import SimpleTabs from '../Utils/Tabs'

import './layout.scss'

import { ControllerContext } from '../ControllerProvider'
import { useConfig } from '../providers/Config'
import { useMap } from '../providers/Map'

const useStyles = makeStyles({
  divider: {
    margin: '15px 0'
  }
})

const initState = {
  controller: {
    info: {
      location: {},
      user: {}
    },
    agents: [],
    flows: [],
    microservices: []
  },
  agent: {},
  activeAgents: [],
  activeMsvcs: [],
  msvcsPerAgent: [],
  applications: [],
}

export const actions = {
  UPDATE: 'UPDATE',
  SET_AGENT: 'SET_AGENT'
}

const updateData = (state, newController) => {
  if (!newController) {
    return state
  }
  const activeFlows = newController.applications.filter(f => f.isActivated === true)
  const activeAgents = newController.agents.filter(a => a.daemonStatus === 'RUNNING')
  const msvcsPerAgent = groupBy(newController.microservices.map(m => ({
    ...m,
    flowActive: !!find(activeFlows, f => m.flowId === f.id)
  })), 'iofogUuid')
  const activeMsvcs = activeAgents.reduce((res, a) => res.concat(get(msvcsPerAgent, a.uuid, []).filter(m => !!find(activeFlows, f => f.id === m.flowId)) || []), [])

  if (!state.agent || !state.agent.uuid) {
    state.agent = newController.agents[0] || {}
  }

  return {
    ...state,
    controller: newController,
    applications: newController.applications,
    activeFlows,
    activeAgents,
    activeMsvcs,
    msvcsPerAgent
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case actions.UPDATE:
      return updateData(state, action.data)
    case actions.SET_AGENT:
      return {
        ...state,
        agent: action.data
      }
    default:
      return state
  }
}

export default function ECNViewer() {
  const classes = useStyles()
  const { updateTags } = useConfig()
  const [state, dispatch] = React.useReducer(reducer, initState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { controller: controllerInfo, request } = React.useContext(ControllerContext)
  const timeout = +controllerInfo.refresh || 3000
  const { setMap } = useMap()
  React.useEffect(() => {
    setLoading(true)
    setError(null)
  }, [controllerInfo.ip, controllerInfo.port, controllerInfo.user])

  const update = async () => {
    const agentsResponse = await request('/api/v3/iofog-list')
    if (!agentsResponse.ok) {
      setError({ message: agentsResponse.statusText })
      return
    }
    const agents = (await agentsResponse.json()).fogs
    const applicationResponse = await request('/api/v3/application')
    if (!applicationResponse.ok) {
      setError({ message: applicationResponse.statusText })
      return
    }
    const applications = (await applicationResponse.json()).applications

    let microservices = []
    for (const application of applications) {
      const microservicesResponse = await request(`/api/v3/microservices?application=${application.name}`)
      if (!microservicesResponse.ok) {
        setError({ message: microservicesResponse.statusText })
        return
      }
      const newMicroservices = (await microservicesResponse.json()).microservices
      microservices = microservices.concat(newMicroservices)
      application.microservices = newMicroservices
    }
    if (loading) {
      setMap(agents, controllerInfo, true, this)
      setLoading(false)
    }
    if (error) {
      setError(false)
    }
    updateTags(agents)
    dispatch({ type: actions.UPDATE, data: { agents, applications, microservices } })
  }

  useRecursiveTimeout(update, timeout)

  const setAgent = a => dispatch({ type: actions.SET_AGENT, data: a })

  const selectAgent = (a) => {
    setAgent(a)
    if (isFinite(a.latitude) && isFinite(a.longitude)) {
      setMap([a], controllerInfo, false, this)
    }
  }

  const selectController = () => {
    setMap([], controllerInfo, true, this)
  }

  const setAutozoom = () => {
    setMap(state.controller.agents, controllerInfo, true, this)
  }

  const { controller, activeAgents, applications, activeMsvcs, agent, msvcsPerAgent } = state
  return (
    <div className='viewer-layout-container'>
      <div className='box sidebar'>
        <ControllerInfo {...{ controller: controllerInfo, selectController, loading, error }} />
        <Divider className={classes.divider} />
        <ActiveResources {...{ activeAgents, applications, activeMsvcs, loading }} />
        <Divider className={classes.divider} />

        <SimpleTabs>
          <AgentList title='Agents' {...{ msvcsPerAgent, loading, msvcs: controller.microservices, agents: controller.agents, agent, setAgent: selectAgent, setAutozoom, controller: controller.info }} />
          <ApplicationList title='Applications' {...{ applications, controllerInfo, loading, agents: controller.agents, setAutozoom }} />
        </SimpleTabs>
      </div>
      <div className='map-grid-container'>
        <Map {...{ controller: { ...controller, info: controllerInfo }, agent, setAgent, msvcsPerAgent, loading }} />
      </div>
    </div>
  )
}
