import React, { useState, useEffect } from 'react'
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
    marginRight: '50px'
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
  footer: {
    align: 'center',
    fontColor: '#ACB5C6',
    fontSize: '10pt'
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
      .then(setController)
  }, [1000])

  useEffect(() => {
    if (!agent || !agent.uuid) {
      setAgent(controller.agents[0] || {})
      if (controller.agents[0]) {
        centerMap([controller.agents[0].latitude, controller.agents[0].longitude])
      } else {
        centerMap([controller.info.lat, controller.info.lon])
      }
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

  const centerMap = (coordinates) => { setMap({ ...map, center: coordinates }) }

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
        <ControllerInfo controller={controller} centerMap={centerMap} />
        <Divider className={classes.divider} />
        <ActiveResources {...{ activeAgents, activeFlows, activeMsvcs }} />
        <Divider className={classes.divider} />
        <AgentList {...{ msvcsPerAgent, agents: controller.agents, agent, setAgent, centerMap }} />
      </div>
      <div className='content'>
        <Map {...{ controller, agent, setAgent, msvcsPerAgent, map }} />

      </div>
      <div className={classes.footer}>
        Copyright © 2019 Edgeworx, Inc. All Rights Reserved.
      </div>

    </div>
  )
}
