import React, { useState } from 'react'
import { useInterval } from '../hooks/useInterval'
import _ from 'lodash'

import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import FakeIcon1 from '@material-ui/icons/GraphicEqOutlined'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import { makeStyles } from '@material-ui/styles'

import ControllerInfo from './ControllerInfo'
import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import Map from './Map'

// import logo from '../assets/logo.png'
import logomark from '../assets/logomark.svg'
import './layout.scss'

import mapStyle from './mapStyle.json'

const useStyles = makeStyles({
  divider: {
    margin: '15px 0'
  },
  avatarContainer: {
    backgroundColor: '#FF585D',
    marginRight: '45px'
  },
  latIcons: {
    margin: 'auto',
    marginTop: '15px',
    cursor: 'pointer',
    backgroundColor: '#002E43',
    '&.selected': {
      backgroundColor: '#ACB5C6'
    }
  },
  topIcons: {
    height: '100%',
    width: '25px',
    marginRight: '25px',
    cursor: 'pointer'
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
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    justifyItems: 'center',
    padding: '20px 10px 20px 0px'
  },
  footer: {
    color: '#ACB5C6',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    fontSize: '9pt'
  }
})

const initState = {
  controller: {
    info: {},
    agents: [],
    flows: [],
    msvcs: []
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
  const activeFlows = newController.flows.filter(f => f.isActivated === true)
  const activeAgents = newController.agents.filter(a => a.daemonStatus === 'RUNNING')
  const msvcsPerAgent = _.groupBy(newController.microservices, 'iofogUuid')
  const activeMsvcs = activeAgents.reduce((res, a) => res.concat(msvcsPerAgent[a.uuid] || []), [])

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
  const [map, setMap] = useState({
    center: [0, 0],
    zoom: 15,
    options: {
      styles: mapStyle
    }
  })

  useInterval(() => {
    window.fetch('/api/data')
      .then(res => res.json())
      .then(data => dispatch({ type: actions.UPDATE, data }))
  }, [1000])

  const setAgent = a => dispatch({ type: actions.SET_AGENT, data: a })

  const selectAgent = (a) => {
    setAgent(a)
    setMap({ ...map, center: [a.latitude, a.longitude], zoom: 15 })
    setAutozoom(false)
  }

  const selectController = () => {
    setMap({ ...map, center: [state.controller.info.lat, state.controller.info.lon], zoom: 15 })
    setAutozoom(false)
  }

  const centerMap = (coordinates) => { setMap({ ...map, center: coordinates }) }

  const { controller, activeAgents, activeFlows, activeMsvcs, agent, msvcsPerAgent } = state
  return (
    <div className='wrapper'>
      <div className='logo'>
        <img src={logomark} alt='Edgeworx logomark' />
      </div>
      <div className='topnav'>
        <SearchIcon className={classes.topIcons} />
        <NotificationsIcon className={classes.topIcons} />
        <Avatar className={classes.avatarContainer} >M</Avatar>
      </div>
      <div className='latnav'>
        <Avatar className={classes.latIcons + ' selected'} >
          <HomeIcon />
        </Avatar>
        <Avatar className={classes.latIcons} >
          <FakeIcon1 />
        </Avatar>
        <Avatar className={classes.latIcons} >
          <SettingsIcon />
        </Avatar>
      </div>
      <div className='box sidebar'>
        <ControllerInfo {...{ controller, selectController }} />
        <Divider className={classes.divider} />
        <ActiveResources {...{ activeAgents, activeFlows, activeMsvcs }} />
        <Divider className={classes.divider} />
        <AgentList {...{ msvcsPerAgent, agents: controller.agents, agent, setAgent: selectAgent, centerMap, setAutozoom }} />
      </div>
      <div className='content'>
        <Map {...{ controller, agent, setAgent, msvcsPerAgent, map, autozoom, setAutozoom }} />

      </div>
      <div className={`${classes.footerContainer} footer`}>
        <span className={classes.footer}>Copyright © 2019 Edgeworx, Inc. All Rights Reserved.</span>
      </div>

    </div>
  )
}
