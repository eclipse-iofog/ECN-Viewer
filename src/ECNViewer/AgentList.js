import React from 'react'

import { List, ListItem, ListSubheader, ListItemAvatar, Chip, Avatar, ListItemText } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'
import MemoryIcon from '@material-ui/icons/Memory'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  avatarList: {
    color: 'white',
    backgroundColor: 'var(--statusColor, white)',
    boxShadow: '0px 2px 2px #444'
  },
  msvcChipList: {
    display: 'flex',
    flexDirection: 'column',
    width: '20%',
    flex: '4',
    paddingRight: '15px'
  },
  msvcChip: {
    backgroundColor: 'var(--color, #5064EC)',
    marginTop: 'var(--mTop, 0px)',
    color: 'white',
    '& .MuiChip-label': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'block'
    }
  }
})

const statusColor = {
  'RUNNING': '#00C0A9',
  'UNKNOWN': '#ACB5C6',
  'OFFLINE': '#FF585D'
}

export default function AgentList (props) {
  const classes = useStyles()
  const { msvcsPerAgent, agents, agent, setAgent } = props
  return (
    <List
      subheader={
        <ListSubheader component='div' id='agent-list-subheader' style={{ position: 'relative' }}>
          Agents - <small>{agents.length} nodes</small>
        </ListSubheader>
      }
    >
      {agents.map(a => {
        const msvcs = msvcsPerAgent[a.uuid] || []
        return (
          <ListItem button key={a.uuid} onClick={() => setAgent(a)} selected={a.uuid === agent.uuid}>
            <ListItemAvatar>
              <Avatar style={{ '--statusColor': statusColor[a.daemonStatus] }} className={classes.avatarList}>
                <MemoryIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={a.name} secondary={`${msvcs.length} Microservices`} />
            <div className={classes.msvcChipList}>
              {msvcs.map((m, idx) => (
                <React.Fragment key={m.uuid}>
                  <Chip
                    size='small'
                    label={m.name}
                    style={{
                      '--mTop': idx ? '2px' : '0px'
                    }}
                    className={classes.msvcChip}
                  />
                </React.Fragment>
              ))}
            </div>
            <MoreIcon />
          </ListItem>
        )
      })}
    </List>
  )
}
