import React from 'react'
import { HashRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import HomeIcon from '@material-ui/icons/HomeOutlined'
import CatalogIcon from '@material-ui/icons/GraphicEqOutlined'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'

import ECNViewer from '../ECNViewer'
import Catalog from '../Catalog'
import Modal from '../Utils/Modal'
import Config from '../Config'
import { ControllerContext } from '../ControllerProvider'

import logomark from '../assets/logomark.svg'
import './layout.scss'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  wrapper: {
    color: theme.colors.carbon,
    backgroundColor: theme.colors.silver
  },
  divider: {
    margin: '15px 0'
  },
  logo: {
    backgroundColor: theme.colors.phosphorus,
    color: theme.colors.white
  },
  latNav: {
    backgroundColor: theme.colors.carbon
  },
  avatarContainer: {
    backgroundColor: theme.colors.phosphorus,
    marginRight: '45px'
  },
  latIcons: {
    margin: 'auto',
    marginTop: '15px',
    cursor: 'pointer',
    backgroundColor: theme.colors.carbon,
    '.active &': {
      backgroundColor: theme.colors.aluminium
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
    color: theme.colors.aluminium,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    fontSize: '9pt',
    '& a': {
      color: theme.colors.aluminium,
      textDecoration: 'none!important'
    }
  }
}))

export default function Layout () {
  const classes = useStyles()
  const { controller } = React.useContext(ControllerContext)
  const [settingsOpen, setSettingsOpen] = React.useState(!(controller.user.email && controller.user.password))

  console.log(' ====> Rendering layout')

  return (
    <>
      <HashRouter>
        <div className={classes.wrapper + ' wrapper'}>
          <div className={classes.logo + ' logo'}>
            <NavLink to='/overview'>
              <img src={logomark} alt='Edgeworx logomark' />
            </NavLink>
          </div>
          <div className='topnav'>
            <SearchIcon className={classes.topIcons} />
            <NotificationsIcon className={classes.topIcons} />
            <Avatar className={classes.avatarContainer}>M</Avatar>
          </div>
          <div className={classes.latNav + ' latnav'}>
            <NavLink to='/overview'>
              <Avatar className={classes.latIcons}>
                <HomeIcon />
              </Avatar>
            </NavLink>
            <NavLink to='/catalog'>
              <Avatar className={classes.latIcons}>
                <CatalogIcon />
              </Avatar>
            </NavLink>
            <Avatar className={classes.latIcons}>
              <SettingsIcon onClick={() => setSettingsOpen(!settingsOpen)} />
            </Avatar>
          </div>
          <div className='content'>
            <Switch>
              <Route path='/catalog' component={Catalog} />
              <Route path='/overview' component={ECNViewer} />
              <Route component={() => <Redirect to='/overview' />} />
            </Switch>
          </div>
          <div className={`${classes.footerContainer} footer`}>
            <span className={classes.footer}><a href='http://www.eclipse.org/legal/copyright.php'>© 2019 Eclipse Foundation, Inc.</a></span>
          </div>
        </div>
      </HashRouter>
      <Modal
        {...{
          open: settingsOpen,
          title: controller.dev ? 'Controller details' : 'User credentials',
          onClose: () => setSettingsOpen(false)
        }}
      >
        <Config {...{ onSave: () => setSettingsOpen(false) }} />
      </Modal>
    </>
  )
}
