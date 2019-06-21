import React, { useState, useEffect } from 'react'
import { useInterval } from '../hooks/useInterval'
import _ from 'lodash'

import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/styles'

import ControllerInfo from './ControllerInfo'
import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import Map from './Map'

import logo from '../assets/logo.png'
import './layout.scss'

import mapStyle from './mapStyle.json'

const useStyles = makeStyles({
  divider: {
    margin: '15px 0'
  },
  nav: {
    marginBottom: '15px',
    height: '50px',
    '& a': {
      height: '100%',
      '& img': {
        height: '100%'
      }
    }
  }
})

const initController = {
  info: {},
  agents: [],
  flows: [],
  msvcs: []
}

export default function ECNViewer () {
  const classes = useStyles()
  const [controller, setController] = useState(initController)
  const [agent, setAgent] = useState([])
  // const [agentsPerFlow, setAgentsPerFlow] = useState({})
  const [msvcsPerAgent, setMsvcsPerAgent] = useState({})
  const [activeAgents, setActiveAgents] = useState([])
  const [activeFlows, setActiveFlows] = useState([])
  const [activeMsvcs, setActiveMsvcs] = useState([])

  useInterval(() => {
    window.fetch('/api/data')
      .then(res => res.json())
      .then(setController)
  }, [1000])

  useEffect(() => {
    if (!agent || !agent.uuid) {
      setAgent(controller.agents[0] || {})
    }
    // setAgentsPerFlow(_.mapValues(
    //   _.groupBy(controller.microservices, 'flowId'),
    //   msvcs => _.uniqBy(msvcs, 'iofogUuid').map(msvc => _.find(controller.agents, a => a.uuid === msvc.iofogUuid))
    // ))
    setMsvcsPerAgent(_.groupBy(controller.microservices, 'iofogUuid'))

    setActiveAgents(controller.agents.filter(a => a.daemonStatus === 'RUNNING'))
    setActiveFlows(controller.flows.filter(f => f.isActivated === true))
    setActiveMsvcs(activeAgents.reduce((res, a) => res.concat(msvcsPerAgent[a.uuid] || []), []))
  }, [controller])

  const map = {
    center: agent ? [agent.latitude, agent.longitude] : [0, 0],
    zoom: 15,
    options: {
      styles: mapStyle
    }
  }

  return (
    <div className='wrapper'>
      <div className='header' />
      <div className='box sidebar'>
        <nav className={classes.nav}>
          <a href='/'><img src={logo} alt='Edgeworx logo' /></a>
        </nav>
        <ControllerInfo controller={controller} />
        <Divider className={classes.divider} />
        <ActiveResources {...{ activeAgents, activeFlows, activeMsvcs }} />
        <Divider className={classes.divider} />
        <AgentList {...{ msvcsPerAgent, agents: controller.agents, agent, setAgent }} />
      </div>
      <div className='content'>
        <Map {...{ controller, agent, setAgent, msvcsPerAgent, map }} />
      </div>
    </div>
  )
}
