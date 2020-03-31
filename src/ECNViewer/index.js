import React, { useState } from 'react'
import { useInterval } from '../hooks/useInterval'
import { find, groupBy, get, isFinite } from 'lodash'

import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/styles'

import ControllerInfo from './ControllerInfo'
import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import Map from './Map'

// import logo from '../assets/logo.png'
import './layout.scss'

import mapStyle from './mapStyle.json'
import { ControllerContext } from '../ControllerProvider'

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
  activeFlows: [],
  activeMsvcs: [],
  msvcsPerAgent: []
}

export const actions = {
  UPDATE: 'UPDATE',
  SET_AGENT: 'SET_AGENT'
}

const updateData = (state, newController) => {
  if (!newController) {
    return state
  }
  const activeFlows = newController.flows.filter(f => f.isActivated === true)
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

export default function ECNViewer () {
  const classes = useStyles()
  const [state, dispatch] = React.useReducer(reducer, initState)
  const [autozoom, setAutozoom] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [map, setMap] = useState({
    center: [0, 0],
    zoom: 15,
    options: {
      styles: mapStyle
    }
  })
  const { controller: controllerInfo, request } = React.useContext(ControllerContext)
  const timeout = +controllerInfo.refresh || 3000
  React.useEffect(() => {
    setLoading(true)
    setError(null)
  }, [controllerInfo.ip, controllerInfo.port, controllerInfo.user])

  const update = async () => {
    const agentsResponse = await request('/api/v3/iofog-list')
    if (!agentsResponse.ok) {
      throw new Error(agentsResponse.statusText)
    }
    const agents = (await agentsResponse.json()).fogs
    const flowsResponse = await request('/api/v3/flow')
    if (!flowsResponse.ok) {
      throw new Error(agentsResponse.statusText)
    }
    const flows = (await flowsResponse.json()).flows

    let microservices = []
    for (const flow of flows) {
      const microservicesResponse = await request(`/api/v3/microservices?flowId=${flow.id}`)
      if (!flowsResponse.ok) {
        throw new Error(agentsResponse.statusText)
      }
      microservices = microservices.concat((await microservicesResponse.json()).microservices)
    }
    if (loading) {
      setLoading(false)
    }
    if (error) {
      setError(false)
    }
    dispatch({ type: actions.UPDATE, data: { agents, flows, microservices } })
  }

  React.useEffect(() => {
    let id
    async function tick () {
      try {
        await update()
      } catch (e) {
        setError({ message: e.toString() })
      } finally {
        id = setTimeout(tick, timeout)
      }
    }
    if (timeout !== null) {
      id = setTimeout(tick, timeout)
      return () => clearTimeout(id)
    }
  }, [timeout])

  const setAgent = a => dispatch({ type: actions.SET_AGENT, data: a })

  const selectAgent = (a) => {
    setAgent(a)
    if (isFinite(a.latitude) && isFinite(a.longitude)) {
      setMap({ ...map, center: [a.latitude, a.longitude], zoom: 15 })
      setAutozoom(false)
    }
  }

  const selectController = () => {
    setMap({ ...map, center: [controllerInfo.location.lat, controllerInfo.location.lon], zoom: 15 })
    setAutozoom(false)
  }

  const centerMap = (coordinates) => { setMap({ ...map, center: coordinates }) }

  const { controller, activeAgents, activeFlows, activeMsvcs, agent, msvcsPerAgent } = state
  return (
    <div className='viewer-layout-container'>
      <div className='box sidebar'>
        <ControllerInfo {...{ controller: controllerInfo, selectController, loading, error }} />
        <Divider className={classes.divider} />
        <ActiveResources {...{ activeAgents, activeFlows, activeMsvcs, loading }} />
        <Divider className={classes.divider} />
        <AgentList {...{ msvcsPerAgent, loading, msvcs: controller.microservices, agents: controller.agents, agent, setAgent: selectAgent, centerMap, setAutozoom, controller: controller.info }} />
      </div>
      <div className='map-grid-container'>
        <Map {...{ controller: { ...controller, info: controllerInfo }, agent, setAgent, msvcsPerAgent, map, autozoom, setAutozoom, loading }} />
      </div>
    </div>
  )
}
