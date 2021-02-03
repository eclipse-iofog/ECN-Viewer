import React from 'react'
import { useController } from '../../ControllerProvider'
import { find, groupBy, get } from 'lodash'
import useRecursiveTimeout from '../../hooks/useInterval'

export const DataContext = React.createContext()
export const useData = () => React.useContext(DataContext)

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
  activeAgents: [],
  activeMsvcs: [],
  msvcsPerAgent: [],
  applications: []
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
    default:
      return state
  }
}

export const DataProvider = ({
  children
}) => {
  const { request, refresh } = useController()
  const [state, dispatch] = React.useReducer(reducer, initState)
  const [loading, setLoading] = React.useState(true)
  const timeout = +refresh || 3000
  const [error, setError] = React.useState(false)

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
      setLoading(false)
    }
    if (error) {
      setError(false)
    }
    dispatch({ type: actions.UPDATE, data: { agents, applications, microservices } })
  }

  useRecursiveTimeout(update, timeout)

  return (
    <DataContext.Provider
      value={{
        data: state, error, loading
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
