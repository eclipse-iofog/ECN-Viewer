import React from 'react'
import ReactJson from 'react-json-view'

import { List, ListItem, ListSubheader, ListItemAvatar, Chip, Avatar, ListItemText, Menu, MenuItem } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'
import MemoryIcon from '@material-ui/icons/Memory'

import { makeStyles } from '@material-ui/styles'

import { statusColor, msvcStatusColor } from '../utils'
import Modal from '../../Utils/Modal'

import AddMicroservice from './AddMicroservice'
import RemoveMicroservice from './RemoveMicroservice'

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
    flex: '1',
    paddingRight: '15px'
  },
  msvcChip: {
    marginTop: 'var(--mTop, 0px)',
    backgroundColor: 'var(--color, #5064EC)',
    fontSize: '10px',
    borderRadius: '5px',
    height: '20px',
    margin: '2px',
    width: '100px',
    color: 'white',
    '& .MuiChip-label': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'block'
    }
  },
  jsonDisplay: {
    width: '99%',
    minHeight: '30rem',
    fontFamily: '"Lucida Console", Monaco, monospace',
    fontSize: '0.8rem',
    lineHeight: '1.2'
  },
  listTitle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  link: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
})

export default function AgentList (props) {
  const classes = useStyles()
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false)
  const [openAddMicroserviceModal, setOpenAddMicroserviceModal] = React.useState(false)
  const [openRemoveMicroserviceModal, setOpenRemoveMicroserviceModal] = React.useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null)
  const { msvcsPerAgent, agents, agent, setAgent, setAutozoom } = props

  const handleCloseMenu = () => setMenuAnchorEl(null)
  const openMenu = (e) => setMenuAnchorEl(e.currentTarget)
  const openDetails = () => {
    setOpenDetailsModal(true)
    handleCloseMenu()
  }
  const openAddMicroservice = () => {
    setOpenAddMicroserviceModal(true)
    handleCloseMenu()
  }
  const openRemoveMicroservice = () => {
    setOpenRemoveMicroserviceModal(true)
    handleCloseMenu()
  }

  return (
    <React.Fragment>
      <List
        subheader={
          <ListSubheader component='div' id='agent-list-subheader' style={{ position: 'relative' }}>
            <div className={classes.listTitle}>
              <div>Agents - <small>{agents.length} nodes</small></div>
              <div><small className={classes.link} onClick={() => setAutozoom(true)}>See all ECN</small></div>
            </div>
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
                        '--mTop': idx ? '2px' : '0px',
                        '--color': msvcStatusColor[a.daemonStatus]
                      }}
                      className={classes.msvcChip}
                      title={m.name}
                    />
                  </React.Fragment>
                ))}
              </div>
              <MoreIcon onClick={openMenu} />
            </ListItem>
          )
        })}
      </List>
      <Modal
        {...{
          open: openDetailsModal,
          title: `${agent.name} details`,
          onClose: () => setOpenDetailsModal(false)
        }}
      >
        <ReactJson src={agent} name={false} />
      </Modal>
      <Modal
        {...{
          open: openAddMicroserviceModal,
          title: `Deploy microservice to ${agent.name}`,
          onClose: () => setOpenAddMicroserviceModal(false)
        }}
      >
        <AddMicroservice target={agent} />
      </Modal>
      <Modal
        {...{
          open: openRemoveMicroserviceModal,
          title: `Remove microservice from ${agent.name}`,
          onClose: () => setOpenRemoveMicroserviceModal(false)
        }}
      >
        <RemoveMicroservice target={agent} msvcs={msvcsPerAgent[agent.uuid] || []} />
      </Modal>
      <Menu
        id='agent-menu'
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={openDetails}>Details</MenuItem>
        <MenuItem onClick={openAddMicroservice}>Add microservice</MenuItem>
        <MenuItem onClick={openRemoveMicroservice}>Remove microservice</MenuItem>
      </Menu>
    </React.Fragment>
  )
}
