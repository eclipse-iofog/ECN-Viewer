import React from 'react'
import yaml from 'js-yaml'

import { makeStyles, Paper } from '@material-ui/core'

import ActiveResources from './ActiveResources'
import AgentList from './AgentList'
import ApplicationList from './ApplicationList'
import SimpleTabs from '../../Utils/Tabs'
import FileDrop from '../../Utils/FileDrop'
import { API_VERSIONS } from '../../Utils/constants'

import { parseMicroservice } from '../../Utils/ApplicationParser'

import { useData } from '../../providers/Data'
import getSharedStyles from '../sharedStyles'
import { get as lget } from 'lodash'
import { useController } from '../../ControllerProvider'
import { useFeedback } from '../../Utils/FeedbackContext'
import SearchBar from '../../Utils/SearchBar'
import PublishIcon from '@material-ui/icons/Publish'
import GetAppIcon from '@material-ui/icons/GetApp'
import { Search as SearchIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  ...getSharedStyles(theme),
  link: {
    color: theme.palette.text.primary,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  hiddenInput: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1'
  },
  iconContainer: {
    height: '39px',
    width: '39px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchIconContainer: {
    borderRadius: '4px',
    border: `solid 1px ${theme.colors.carbon}`
  }
}))

export default function Default ({ selectAgent, selectController, selectApplication, selectedElement, setView, views }) {
  const { data, loading, deleteAgent } = useData()
  const [filter, setFilter] = React.useState('')
  const [fileParsing, setFileParsing] = React.useState(false)
  const [showSearchbar, setShowSearchbar] = React.useState(false)
  const classes = useStyles()
  const { request } = useController()
  const { pushFeedback } = useFeedback()

  const { controller, activeAgents, applications, activeMsvcs, msvcsPerAgent } = data

  const parseApplicationFile = async (doc) => {
    if (API_VERSIONS.indexOf(doc.apiVersion) === -1) {
      return [{}, `Invalid API Version ${doc.apiVersion}, current version is ${API_VERSIONS.slice(-1)[0]}`]
    }
    if (doc.kind !== 'Application') {
      return [{}, `Invalid kind ${doc.kind}`]
    }
    if (!doc.metadata || !doc.spec) {
      return [{}, 'Invalid YAML format']
    }
    const application = {
      name: lget(doc, 'metadata.name', undefined),
      ...doc.spec,
      isActivated: true,
      microservices: await Promise.all((doc.spec.microservices || []).map(async m => parseMicroservice(m)))
    }

    return [application]
  }

  const deployApplication = async (application, newApplication) => {
    const url = `/api/v3/application${newApplication ? '' : `/${application.name}`}`
    try {
      const res = await request(url, {
        method: newApplication ? 'POST' : 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(application)
      })
      return res
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
    }
  }

  const readApplicationFile = async (item) => {
    setFileParsing(true)
    const file = item.files[0]
    if (file) {
      const reader = new window.FileReader()

      reader.onload = async function (evt) {
        try {
          const doc = yaml.safeLoad(evt.target.result)
          console.log({ doc })
          const [applicationData, err] = await parseApplicationFile(doc)
          if (err) {
            setFileParsing(false)
            return pushFeedback({ message: err, type: 'error' })
          }
          const newApplication = !applications.find(a => a.name === applicationData.name)
          const res = await deployApplication(applicationData, newApplication)
          if (!res.ok) {
            try {
              const error = await res.json()
              pushFeedback({ message: error.message, type: 'error' })
            } catch (e) {
              pushFeedback({ message: res.statusText, type: 'error' })
            }
          } else {
            pushFeedback({ message: newApplication ? 'Application deployed!' : 'Application updated!', type: 'success' })
          }
          setFileParsing(false)
        } catch (e) {
          pushFeedback({ message: e.message, type: 'error' })
          setFileParsing(false)
        }
      }

      reader.onerror = function (evt) {
        pushFeedback({ message: evt, type: 'error' })
        setFileParsing(false)
      }

      reader.readAsText(file, 'UTF-8')
    }
  }

  const handleFileInput = (e) => {
    readApplicationFile(e.target)
  }

  return (
    <>
      <ActiveResources {...{ activeAgents, applications, activeMsvcs, loading }} />

      <Paper className='section' style={{ maxHeight: '80vh', padding: 0 }}>
        <SimpleTabs
          stickyHeader
          headers={(selectedTab) => {
            return selectedTab === 0 ? (
              <SearchBar onSearch={setFilter} style={{ marginRight: '5px' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileDrop {...{
                  onHover:
                    showSearchbar
                      ? <GetAppIcon />
                      : <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}><GetAppIcon style={{ marginRight: '5px' }} /> Release to drop</div>,
                  onDrop: readApplicationFile,
                  loading: fileParsing,
                  style:
                    showSearchbar
                      ? { padding: 0, height: '39px', width: '39px' }
                      : { paddingLeft: '5px', width: '400px' }
                }}
                >
                  {showSearchbar ? (
                    <div className={classes.iconContainer} onClick={() => setShowSearchbar(false)} style={{ cursor: 'pointer' }}><PublishIcon /></div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input onChange={handleFileInput} class='box__file' type='file' name='files[]' id='file' className={classes.hiddenInput} />
                      <PublishIcon style={{ marginRight: '5px' }} />
                      <span style={{ fontSize: '14px' }}>
                        {'To deploy an app, drag a YAML file here or '}
                        <label for='file' className={classes.link} style={{ marginRight: '5px', textDecoration: 'underline' }}>upload</label>
                      </span>
                    </div>
                  )}
                </FileDrop>
                {showSearchbar ? <SearchBar onSearch={setFilter} style={{ marginRight: '5px', marginLeft: '15px' }} /> : <div className={[classes.iconContainer, classes.searchIconContainer].join(' ')} onClick={() => setShowSearchbar(true)} style={{ marginLeft: '15px', cursor: 'pointer' }}><SearchIcon /></div>}
              </div>)
          }}
        >
          <AgentList title='Agents' {...{ deleteAgent, msvcsPerAgent, filter, loading, msvcs: controller.microservices, agents: controller.agents, agent: selectedElement, setAgent: selectAgent, controller: controller.info }} />
          <ApplicationList title='Applications' {...{ applications, filter, loading, agents: controller.agents, selectApplication, application: selectedElement }} />
        </SimpleTabs>
      </Paper>
    </>
  )
}
