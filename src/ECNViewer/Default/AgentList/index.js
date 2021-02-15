import React from 'react'
import Skeleton from 'react-loading-skeleton'

import { Avatar, Menu, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Divider, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, Button } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'
import MemoryIcon from '@material-ui/icons/Memory'

import { makeStyles } from '@material-ui/styles'

import { statusColor, fogTypes } from '../../utils'
import Icon from '@material-ui/core/Icon'

import { theme } from '../../../Theme/ThemeProvider'

import getSharedStyle from '../../sharedStyles/'
import { useFeedback } from '../../../Utils/FeedbackContext'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme),
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
    color: theme.palette.text.primary,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  stickyHeader: {
    top: '48px'
  }
}))

export default function AgentList (props) {
  const classes = useStyles()
  const { pushFeedback } = useFeedback()
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null)
  const { msvcsPerAgent, filter, agents: unfilteredAgents, setAgent, loading, deleteAgent: _deleteAgent } = props
  const [openDeleteAgentDialog, setOpenDeleteAgentDialog] = React.useState(false)
  const [selectedAgent, setSelectedAgent] = React.useState({})

  const handleCloseMenu = () => { setMenuAnchorEl(null); setSelectedAgent({}) }
  const openMenu = (a, e) => { setMenuAnchorEl(e.currentTarget); setSelectedAgent(a) }

  const agents = unfilteredAgents.filter(a => a.name.toLowerCase().includes(filter))
  const deleteAgent = async (agent) => {
    try {
      const response = await _deleteAgent(agent)
      if (response.ok) {
        pushFeedback({ type: 'success', message: 'Agent deleted!' })
        setOpenDeleteAgentDialog(false)
        handleCloseMenu()
      } else {
        pushFeedback({ type: 'error', message: response.status })
      }
    } catch (e) {
      pushFeedback({ type: 'error', message: e.message || e.status })
    }
  }

  return (
    <>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeader }}>Name</TableCell>
            <TableCell className={classes.tableTitle} align='right' classes={{ stickyHeader: classes.stickyHeader }}>Version</TableCell>
            <TableCell className={classes.tableTitle} align='right' classes={{ stickyHeader: classes.stickyHeader }}>Apps</TableCell>
            <TableCell className={classes.tableTitle} align='right' classes={{ stickyHeader: classes.stickyHeader }}>Msvcs</TableCell>
            <TableCell className={classes.tableTitle} align='right' classes={{ stickyHeader: classes.stickyHeader }}>Type</TableCell>
            <TableCell className={classes.tableTitle} align='right' classes={{ stickyHeader: classes.stickyHeader }}>Resources</TableCell>
            <TableCell className={classes.tableTitle} align='right' classes={{ stickyHeader: classes.stickyHeader }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {(loading ? [1, 2, 3].map((idx) => <TableRow key={idx}><TableCell colSpan={7}><Skeleton height={72} /></TableCell></TableRow>) : agents.map(a => {
            const msvcs = msvcsPerAgent[a.uuid] || []
            const applications = Object.keys(msvcs.reduce((acc, m) => ({ ...acc, [m.application]: true }), {}))
            const edgeResources = a.edgeResources || []
            return (
              <TableRow button key={a.uuid}>
                <TableCell onClick={() => setAgent(a)} style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar style={{ '--statusColor': statusColor[a.daemonStatus] }} className={classes.avatarList}>
                    <MemoryIcon />
                  </Avatar>
                  <span className={classes.link} style={{ marginLeft: '5px' }}>{a.name}</span>
                </TableCell>
                <TableCell align='right'>{a.version}</TableCell>
                <TableCell align='right'>{applications.length}</TableCell>
                <TableCell align='right'>{msvcs.length}</TableCell>
                <TableCell align='right'>{fogTypes[a.fogTypeId]}</TableCell>
                <TableCell align='right'>
                  {edgeResources.map((er) => {
                    return er.display && er.display.icon ? <Icon title={er.display.name || er.name} style={{ color: theme.colors.carbon }} className={classes.erIcon}>{er.display.icon}</Icon> : null
                  })}
                </TableCell>
                <TableCell align='right'>
                  <MoreIcon className={classes.action} onClick={(e) => { e.stopPropagation(); openMenu(a, e) }} />
                </TableCell>
              </TableRow>
            )
          }))}
        </TableBody>
      </Table>
      <Dialog
        open={openDeleteAgentDialog}
        onClose={() => { setOpenDeleteAgentDialog(false); handleCloseMenu() }}
      >
        <DialogTitle id='alert-dialog-title'>Delete {selectedAgent.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <span>Deleting an agent will delete all its microservices.</span><br />
            <span>This is not reversible.</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAgentDialog(false)} color='primary'>
            Cancel
          </Button>
          <Button onClick={() => deleteAgent(selectedAgent)} color='primary' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Menu
        id='agent-menu'
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => setAgent(selectedAgent)}>Details</MenuItem>
        <Divider />
        <MenuItem onClick={() => setOpenDeleteAgentDialog(true)}>Delete Agent</MenuItem>
      </Menu>
    </>
  )
}
