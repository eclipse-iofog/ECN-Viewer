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
import { FeedbackContext } from '../Utils/FeedbackContext'

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
  const [map, setMap] = useState({
    center: [0, 0],
    zoom: 15,
    options: {
      styles: mapStyle
    }
  })

  useInterval(async () => {
    const erroredData = e => ({
      ...initState.controller,
      info: {
        ...initState.controller.info,
        error: e
      }
    })
    try {
      const res = await window.fetch('/api/controller')
      if (!res.ok) {
        dispatch({ type: actions.UPDATE, data: erroredData({ message: res.statusText }) })
        return
      }
      const data = await res.json()
      dispatch({ type: actions.UPDATE, data })
      if (loading) {
        setLoading(false)
      }
    } catch (e) {
      dispatch({ type: actions.UPDATE, data: erroredData(e) })
    }
  }, [3000])

  const setAgent = a => dispatch({ type: actions.SET_AGENT, data: a })

  const selectAgent = (a) => {
    setAgent(a)
    if (isFinite(a.latitude) && isFinite(a.longitude)) {
      setMap({ ...map, center: [a.latitude, a.longitude], zoom: 15 })
      setAutozoom(false)
    }
  }

  const selectController = () => {
    setMap({ ...map, center: [state.controller.info.location.lat, state.controller.info.location.lon], zoom: 15 })
    setAutozoom(false)
  }

  const centerMap = (coordinates) => { setMap({ ...map, center: coordinates }) }

  const { controller, activeAgents, activeFlows, activeMsvcs, agent, msvcsPerAgent } = state
  return (
    <FeedbackContext.Consumer>
      {(feedbackContext) =>
        <div className='viewer-layout-container'>
          <div className='box sidebar'>
            <ControllerInfo {...{ controller, selectController, loading }} />
            <Divider className={classes.divider} />
            <ActiveResources {...{ activeAgents, activeFlows, activeMsvcs }} />
            <Divider className={classes.divider} />
            <AgentList {...{ msvcsPerAgent, msvcs: controller.microservices, agents: controller.agents, agent, setAgent: selectAgent, centerMap, setAutozoom, controller: controller.info, feedbackContext }} />
          </div>
          <div className='map-grid-container'>
            <Map {...{ controller, agent, setAgent, msvcsPerAgent, map, autozoom, setAutozoom }} />
          </div>
        </div>
      }
    </FeedbackContext.Consumer>
  )
}
