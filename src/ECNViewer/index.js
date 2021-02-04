import React from 'react'
import { isFinite } from 'lodash'

import Map from './Map'
import Default from './Default'
import AgentDetails from './AgentDetails'
import ApplicationDetails from './ApplicationDetails'
import MicroserviceDetails from './MicroserviceDetails'
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
  const [selectedElement, selectElement] = React.useState(null)
  const [history, setHistory] = React.useState([])
  const [view, setView] = React.useState(views.DEFAULT)

  const selectAgent = (a) => {
    const copy = { ...a }
    setHistory(h => [...h, { view, selectedElement }])
    selectElement(copy)
    if (isFinite(a.latitude) && isFinite(a.longitude)) {
      setMap([copy], { location }, false)
    }
    setView(views.AGENT_DETAILS)
  }

  const selectApplication = (a) => {
    console.log('Selection application')
    const copy = { ...a }
    console.log({ app: copy, view, selectedElement })
    setHistory(h => [...h, { view, selectedElement }])
    selectElement(copy)
    // TODO: SET MAP
    setView(views.APPLICATION_DETAILS)
  }

  const selectMicroservice = (a) => {
    const copy = { ...a }
    setHistory(h => [...h, { view, selectedElement }])
    selectElement(copy)
    // TODO: SET MAP
    setView(views.MICROSERVICE_DETAILS)
  }

  const seeAllECN = () => {
    selectElement({})
    setView(views.DEFAULT)
    selectController()
    setHistory([])
  }

  const back = () => {
    if (history.length) {
      const previousState = history[history.length - 1]
      console.log({ previousState })
      setView(previousState.view)
      selectElement(previousState.selectedElement)
      setHistory(h => {
        h.pop()
        return h
      })
    } else {
      seeAllECN()
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

  const _getView = (view) => {
    switch (view) {
      case views.AGENT_DETAILS:
        return (
          <AgentDetails
            {
              ...{
                agent: selectedElement,
                selectApplication,
                selectMicroservice
              }
            }
          />
        )
      case views.APPLICATION_DETAILS:
        return (
          <ApplicationDetails
            {
              ...{
                views,
                application: selectedElement,
                setView
              }
            }
          />
        )
      case views.MICROSERVICE_DETAILS:
        return (
          <MicroserviceDetails
            {
              ...{
                views,
                microservice: selectedElement,
                setView
              }
            }
          />
        )
      case views.DEFAULT:
      default:
        return (
          <Default {
            ...{
              setAutozoom,
              selectController,
              selectAgent,
              agent: selectedElement,
              setView,
              views
            }
          }
          />)
    }
  }

  const { controller, msvcsPerAgent } = data
  return (
    <div className='viewer-layout-container'>
      <div className='box sidebar'>
        <Navigation {...{ view, selectedElement, views, back }} />
        {_getView(view)}
      </div>
      <div className='map-grid-container'>
        <Map {...{ controller: { ...controller, info: { location } }, agent: selectedElement, setAgent: selectElement, msvcsPerAgent, loading }} />
      </div>
    </div>
  )
}
