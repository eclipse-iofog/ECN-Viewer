import React from 'react'

import { Paper } from '@material-ui/core'

import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import ApplicationList from './ApplicationList'
import SimpleTabs from '../../Utils/Tabs'

import { useData } from '../../providers/Data'

export default function Default ({ selectAgent, selectController, selectApplication, selectedElement, setView, views }) {
  const { data, loading } = useData()

  const { controller, activeAgents, applications, activeMsvcs, msvcsPerAgent } = data

  return (
    <>
      <ActiveResources {...{ activeAgents, applications, activeMsvcs, loading }} />

      <Paper className='section' style={{ maxHeight: '80vh', padding: 0 }}>
        <SimpleTabs>
          <AgentList title='Agents' {...{ msvcsPerAgent, loading, msvcs: controller.microservices, agents: controller.agents, agent: selectedElement, setAgent: selectAgent, controller: controller.info }} />
          <ApplicationList title='Applications' {...{ applications, loading, agents: controller.agents, selectApplication, application: selectedElement }} />
        </SimpleTabs>
      </Paper>
    </>
  )
}
