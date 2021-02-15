import React from 'react'

import { Paper } from '@material-ui/core'

import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import ApplicationList from './ApplicationList'
import SimpleTabs from '../../Utils/Tabs'

import { useData } from '../../providers/Data'

export default function Default ({ selectAgent, selectController, selectApplication, selectedElement, setView, views }) {
  const { data, loading, deleteAgent } = useData()
  const [filter, setFilter] = React.useState('')

  const { controller, activeAgents, applications, activeMsvcs, msvcsPerAgent } = data

  return (
    <>
      <ActiveResources {...{ activeAgents, applications, activeMsvcs, loading }} />

      <Paper className='section' style={{ maxHeight: '80vh', padding: 0 }}>
        <SimpleTabs onSearch={setFilter} stickyHeader>
          <AgentList title='Agents' {...{ deleteAgent, msvcsPerAgent, filter, loading, msvcs: controller.microservices, agents: controller.agents, agent: selectedElement, setAgent: selectAgent, controller: controller.info }} />
          <ApplicationList title='Applications' {...{ applications, filter, loading, agents: controller.agents, selectApplication, application: selectedElement }} />
        </SimpleTabs>
      </Paper>
    </>
  )
}
