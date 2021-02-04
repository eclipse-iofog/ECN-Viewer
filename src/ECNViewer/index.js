import React from 'react'
import { isFinite } from 'lodash'

import Map from './Map'
import Default from './Default'
import AgentDetails from './AgentDetails'
import Navigation from './Navigation'

// import logo from '../assets/logo.png'
import './layout.scss'

import { ControllerContext } from '../ControllerProvider'
import { useMap } from '../providers/Map'
import { useData } from '../providers/Data'

const views = {
  DEFAULT: 1,
  AGENT_DETAILS: 2,
  APPLICATION_DETAILS: 3,
  MICROSERVICE_DETAILS: 4
}

export default function ECNViewer () {
  const { data, loading } = useData()
  const { location } = React.useContext(ControllerContext)
  const { setMap } = useMap()
  const [agent, setAgent] = React.useState({})
  const [view, setView] = React.useState(views.DEFAULT)

  const selectAgent = (a) => {
    const copy = { ...a }
    setAgent(copy)
    if (isFinite(a.latitude) && isFinite(a.longitude)) {
      setMap([copy], { location }, false)
    }
    setView(views.AGENT_DETAILS)
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

  const _getView = (view) => {
    switch (view) {
      case views.AGENT_DETAILS:
        return (
          <AgentDetails
            {
              ...{
                views,
                agent,
                setView
              }
            }
          />
        )
      case views.APPLICATION_DETAILS:
      case views.MICROSERVICE_DETAILS:
      case views.DEFAULT:
      default:
        return (
          <Default {
            ...{
              setAutozoom,
              selectController,
              selectAgent,
              agent,
              setView,
              views
            }
          }
          />)
    }
  }

  const seeAllECN = () => {
    setAgent({})
    setView(views.DEFAULT)
    selectController()
  }

  const { controller, msvcsPerAgent } = data
  return (
    <div className='viewer-layout-container'>
      <div className='box sidebar'>
        <Navigation {...{ view, agent, views, seeAllECN }} />
        {_getView(view)}
      </div>
      <div className='map-grid-container'>
        <Map {...{ controller: { ...controller, info: { location } }, agent, setAgent, msvcsPerAgent, loading }} />
      </div>
    </div>
  )
}
