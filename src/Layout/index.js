import React from 'react'
import { HashRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import FakeIcon1 from '@material-ui/icons/GraphicEqOutlined'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'

import ECNViewer from '../ECNViewer'
import Modal from '../Utils/Modal'
import Config from '../Config'

import logomark from '../assets/logomark.svg'
import './layout.scss'

import { makeStyles } from '@material-ui/styles'
import { FeedbackContext } from '../Utils/FeedbackContext'

const useStyles = makeStyles({
  divider: {
    margin: '15px 0'
  },
  avatarContainer: {
    backgroundColor: '#FF585D',
    marginRight: '45px'
  },
  latIcons: {
    margin: 'auto',
    marginTop: '15px',
    cursor: 'pointer',
    backgroundColor: '#002E43',
    '.active &': {
      backgroundColor: '#ACB5C6'
    }
  },
  topIcons: {
    height: '100%',
    width: '25px',
    marginRight: '25px',
    cursor: 'pointer'
  },
  nav: {
    marginBottom: '15px',
    height: '50px',
    '& a': {
      height: '100%',
      '& img': {
        height: '100%'
      }
    }
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    justifyItems: 'center',
    padding: '20px 10px 20px 0px'
  },
  footer: {
    color: '#ACB5C6',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    fontSize: '9pt'
  }
})

export default function Layout () {
  const classes = useStyles()
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  return <React.Fragment>
    <HashRouter>
      <div className='wrapper'>
        <div className='logo'>
          <NavLink to='/overview' >
            <img src={logomark} alt='Edgeworx logomark' />
          </NavLink>
        </div>
        <div className='topnav'>
          <SearchIcon className={classes.topIcons} />
          <NotificationsIcon className={classes.topIcons} />
          <Avatar className={classes.avatarContainer} >M</Avatar>
        </div>
        <div className='latnav'>
          <NavLink to='/overview' >
            <Avatar className={classes.latIcons} >
              <HomeIcon />
            </Avatar>
          </NavLink>
          <NavLink to='/routes' >
            <Avatar className={classes.latIcons} >
              <FakeIcon1 />
            </Avatar>
          </NavLink>
          <Avatar className={classes.latIcons} >
            <SettingsIcon onClick={() => setSettingsOpen(!settingsOpen)} />
          </Avatar>
        </div>
        <div className='content'>
          <Switch>
            <Route path='/routes' component={() => 'Hello agents'} />
            <Route path='/overview' component={ECNViewer} />
            <Route component={() => <Redirect to='/overview' />} />
          </Switch>
        </div>
        <div className={`${classes.footerContainer} footer`}>
          <span className={classes.footer}>Copyright © 2019 Edgeworx, Inc. All Rights Reserved.</span>
        </div>
      </div>
    </HashRouter>
    <Modal
      {...{
        open: settingsOpen,
        title: `Controller details`,
        onClose: () => setSettingsOpen(false)
      }}
    >
      <FeedbackContext.Consumer>
        {feedbackContext => <Config {...feedbackContext} />}
      </FeedbackContext.Consumer>
    </Modal>

  </React.Fragment>
}
