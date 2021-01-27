import React from 'react'
import { isFinite } from 'lodash'

import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/styles'

import ControllerInfo from './ControllerInfo'
import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import ApplicationList from './ApplicationList'
import Map from './Map'
import SimpleTabs from '../Utils/Tabs'

// import logo from '../assets/logo.png'
import './layout.scss'

import { ControllerContext } from '../ControllerProvider'
import { useMap } from '../providers/Map'
import { useData } from '../providers/Data'

const useStyles = makeStyles({
  divider: {
    margin: '15px 0'
  }
})

export default function ECNViewer () {
  const classes = useStyles()
  const { data, error, loading } = useData()
  const { location, error: controllerError } = React.useContext(ControllerContext)
  const { setMap } = useMap()
  const [agent, setAgent] = React.useState({})

  const selectAgent = (a) => {
    setAgent(a)
    if (isFinite(a.latitude) && isFinite(a.longitude)) {
      setMap([a], { location }, false)
    }
  }

  React.useEffect(() => {
    if (!loading) {
      setMap(data.activeAgents, { location }, true)
    }
  }, [loading])

  const selectController = () => {
    setMap([], { location }, true)
  }

  const setAutozoom = () => {
    setMap(data.controller.agents, { location }, true)
  }

  const { controller, activeAgents, applications, activeMsvcs, msvcsPerAgent } = data
  return (
    <div className='viewer-layout-container'>
      <div className='box sidebar'>
        <ControllerInfo {...{ controller: { location, error: controllerError }, selectController, loading, error }} />
        <Divider className={classes.divider} />
        <ActiveResources {...{ activeAgents, applications, activeMsvcs, loading }} />
        <Divider className={classes.divider} />

        <SimpleTabs>
          <AgentList title='Agents' {...{ msvcsPerAgent, loading, msvcs: controller.microservices, agents: controller.agents, agent, setAgent: selectAgent, setAutozoom, controller: controller.info }} />
          <ApplicationList title='Applications' {...{ applications, loading, agents: controller.agents, setAutozoom }} />
        </SimpleTabs>
      </div>
      <div className='map-grid-container'>
        <Map {...{ controller: { ...controller, info: { location } }, agent, setAgent, msvcsPerAgent, loading }} />
      </div>
    </div>
  )
}
