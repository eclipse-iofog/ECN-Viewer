import React from 'react'
import Skeleton from 'react-loading-skeleton'

import { List, ListItem, ListSubheader, ListItemAvatar, Chip, Avatar, ListItemText, Menu } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'
import MemoryIcon from '@material-ui/icons/Memory'

import { makeStyles } from '@material-ui/styles'

import { statusColor, msvcStatusColor, tagColor } from '../../utils'
import Modal from '../../../Utils/Modal'

import ConnectNode from './ConnectNode'
import AddMicroservice from './AddMicroservice'
import RemoveMicroservice from './RemoveMicroservice'
import Icon from '@material-ui/core/Icon'

const useStyles = makeStyles(theme => ({
  avatarList: {
    color: 'white',
    backgroundColor: 'var(--statusColor, white)',
    boxShadow: `0px 2px 2px ${theme.colors.carbon}`
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
    backgroundColor: `var(--color, ${theme.colors.cobalt})`,
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
    justifyContent: 'space-between',
    alignItems: 'baseline',
    color: theme.palette.text.primary
  },
  link: {
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

const TagChip = ({ tag, first }) => {
  const classes = useStyles()
  if (!tag.icon) {
    return (
      <Chip
        size='small'
        label={tag.value}
        style={{
          '--mTop': first ? '0px' : '2px',
          '--color': tag.color || tagColor,
          color: 'white'
        }}
        className={classes.msvcChip}
        title={tag.value}
      />)
  }
  return (
    <Chip
      icon={<Icon style={{ fontSize: 16, color: 'white' }}>{tag.icon}</Icon>}
      size='small'
      label={tag.value}
      style={{
        '--mTop': first ? '0px' : '2px',
        '--color': tag.color || tagColor,
        color: 'white'
      }}
      className={classes.msvcChip}
      title={tag.value}
    />
  )
}

export default function AgentList (props) {
  const classes = useStyles()
  const [openConnectNodeModal, setOpenConnectNodeModal] = React.useState(false)
  const [openAddMicroserviceModal, setOpenAddMicroserviceModal] = React.useState(false)
  const [openRemoveMicroserviceModal, setOpenRemoveMicroserviceModal] = React.useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null)
  const { msvcsPerAgent, msvcs, agents, agent, setAgent, setAutozoom, loading } = props

  const handleCloseMenu = () => setMenuAnchorEl(null)
  const openMenu = (e) => setMenuAnchorEl(e.currentTarget)

  // const openAddMicroservice = () => {
  //   setOpenAddMicroserviceModal(true)
  //   handleCloseMenu()
  // }
  // const openRemoveMicroservice = () => {
  //   setOpenRemoveMicroserviceModal(true)
  //   handleCloseMenu()
  // }

  return (
    <>
      <List
        subheader={
          <ListSubheader component='div' id='agent-list-subheader' style={{ position: 'relative', marginBottom: '5px' }} disableGutters disableSticky>
            <div className={classes.listTitle}>
              <div>
                {/* <Typography variant='h5'><small>{loading ? 0 : agents.length} nodes</small></Typography> */}
              </div>
              <div>
                <small className={classes.link} onClick={() => setAutozoom(true)}>See all ECN</small>
              </div>
            </div>
          </ListSubheader>
        }
      >
        {(loading ? [1, 2, 3].map((idx) => <ListItem key={idx}><ListItemText><Skeleton height={72} /></ListItemText></ListItem>) : agents.map(a => {
          const msvcs = msvcsPerAgent[a.uuid] || []
          const edgeResources = a.edgeResources || []
          return (
            <ListItem button key={a.uuid} onClick={() => setAgent(a)} selected={agent && a.uuid === agent.uuid}>
              <ListItemAvatar>
                <Avatar style={{ '--statusColor': statusColor[a.daemonStatus] }} className={classes.avatarList}>
                  <MemoryIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={a.name} secondary={`${msvcs.length} Microservices`} />
              <div className={classes.msvcChipList}>
                {edgeResources.map((eR, idx) => (
                  <TagChip key={eR.name} tag={{ value: eR.display ? eR.display.name : eR.name, ...eR.display }} first={!idx} />
                ))}
              </div>
              <div className={classes.msvcChipList}>
                {msvcs.length > 4
                  ? (
                    <Chip
                      size='small'
                      label={`${msvcs.length} microservices`}
                      style={{
                        '--mTop': '0px',
                        '--color': msvcStatusColor[(a.daemonStatus === 'RUNNING') ? 'RUNNING' : 'UNKNOWN']
                      }}
                      className={classes.msvcChip}
                      title={`${msvcs.length} microservices`}
                    />
                  )
                  : msvcs.map((m, idx) => (
                    <React.Fragment key={m.uuid}>
                      <Chip
                        size='small'
                        label={m.name}
                        style={{
                          '--mTop': idx ? '2px' : '0px',
                          '--color': msvcStatusColor[(a.daemonStatus === 'RUNNING' && m.status.status === 'RUNNING' && m.flowActive) ? 'RUNNING' : 'UNKNOWN']
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
        }))}
      </List>
      {agent &&
        <>
          <Modal
            {...{
              open: openAddMicroserviceModal,
              title: `Deploy microservice to ${agent.name}`,
              onClose: () => setOpenAddMicroserviceModal(false)
            }}
          >
            <AddMicroservice {...{
              target: agent,
              microservices: msvcs,
              onSuccess: () => setOpenAddMicroserviceModal(false)
            }}
            />
          </Modal>
          <Modal
            {...{
              open: openRemoveMicroserviceModal,
              title: `Remove microservice from ${agent.name}`,
              onClose: () => setOpenRemoveMicroserviceModal(false)
            }}
          >
            <RemoveMicroservice
              {...{
                target: agent,
                msvcs: msvcsPerAgent[agent.uuid] || [],
                onSuccess: () => setOpenRemoveMicroserviceModal(false)
              }}
            />
          </Modal>
          <Modal
            {...{
              open: openConnectNodeModal,
              title: 'Connect agent',
              onClose: () => setOpenConnectNodeModal(false)
            }}
          >
            <ConnectNode
              {...{
                controller: props.controller,
                onSuccess: () => setOpenConnectNodeModal(false)
              }}
            />
          </Modal>
        </>}
      <Menu
        id='agent-menu'
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        {/* <Divider />
        <MenuItem onClick={openAddMicroservice}>Add microservice</MenuItem>
        <MenuItem onClick={openRemoveMicroservice}>Remove microservice</MenuItem> */}
      </Menu>
    </>
  )
}
