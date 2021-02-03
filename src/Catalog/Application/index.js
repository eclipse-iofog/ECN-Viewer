import React from 'react'
import { makeStyles } from '@material-ui/styles'
import ReactJson from 'react-json-view'
import yaml from 'js-yaml'
import { Menu, MenuItem, Divider } from '@material-ui/core'

import { ControllerContext } from '../../ControllerProvider'
import { FeedbackContext } from '../../Utils/FeedbackContext'
import Modal from '../../Utils/Modal'
import CatalogTable from './CatalogTable'
import Confirm from '../../Utils/Confirm'
import FileDrop from '../../Utils/FileDrop'

import lget from 'lodash/get'
import { parseMicroservice } from '../../Utils/ApplicationParser'

const useStyles = makeStyles(theme => ({
  pointer: {
    cursor: 'pointer'
  },
  avatarContainer: {
    backgroundColor: theme.colors.chromium
  },
  container: {
    padding: '10px 50px 10px 30px'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  titleRow: {
    marginBottom: '30px'
  }
}))

const parseApplication = async (applicationYAML) => {
  return {
    ...applicationYAML,
    microservices: await Promise.all((applicationYAML.microservices || []).map(async m => parseMicroservice(m)))
  }
}

const parseApplicationTemplate = async (doc) => {
  if (doc.apiVersion !== 'iofog.org/v2') {
    return [{}, `Invalid API Version ${doc.apiVersion}, current version is iofog.org/v2`]
  }
  if (doc.kind !== 'ApplicationTemplate') {
    return [{}, `Invalid kind ${doc.kind}`]
  }
  if (!doc.metadata || !doc.spec) {
    return [{}, 'Invalid YAML format']
  }
  const application = await parseApplication(lget(doc, 'spec.application', {}))
  const applicationTemplate = {
    name: lget(doc, 'metadata.name', lget(doc, 'spec.name', undefined)),
    description: lget(doc, 'spec.description', ''),
    application,
    variables: lget(doc, 'spec.variables', [])
  }

  return [applicationTemplate]
}

export default function Catalog () {
  const classes = useStyles()
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false)
  const [openRemoveConfirm, setOpenRemoveConfirm] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [catalog, setCatalog] = React.useState([])
  const [selectedItem, setSelectedItem] = React.useState({})
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null)
  const { request } = React.useContext(ControllerContext)
  const { pushFeedback } = React.useContext(FeedbackContext)

  const handleCloseMenu = () => setMenuAnchorEl(null)
  const openMenu = (item, e) => {
    setSelectedItem(item)
    setMenuAnchorEl(e.currentTarget)
  }
  const openDetails = () => {
    setOpenDetailsModal(true)
    handleCloseMenu()
  }
  const openRemove = () => {
    setOpenRemoveConfirm(true)
    handleCloseMenu()
  }

  function mapApplicationTemplate (item) {
    return {
      display: {
        microservices: lget(item, 'application.microservices', []).map(m => m.name),
        variables: lget(item, 'variables', []).map(m => m.key)
      },
      ...item
    }
  }

  async function fetchCatalog () {
    try {
      setFetching(true)
      const catalogItemsResponse = await request('/api/v3/applicationTemplates')
      if (!catalogItemsResponse.ok) {
        pushFeedback({ message: catalogItemsResponse.statusText, type: 'error' })
        setFetching(false)
        return
      }
      const catalogItems = (await catalogItemsResponse.json()).applicationTemplates
      console.log({ catalogItems })
      setCatalog(catalogItems.map(item => mapApplicationTemplate(item)))
      setFetching(false)
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
      setFetching(false)
    }
  }

  React.useEffect(() => {
    fetchCatalog()
  }, [])

  const addCatalogItem = async (item) => {
    const newItem = { ...item }
    setLoading(true)
    const response = await request(`/api/v3/applicationTemplate/${newItem.name}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
    if (response.ok) {
      pushFeedback({ message: 'Catalog Updated!', type: 'success' })
      newItem.id = (await response.json()).id
      setCatalog([mapApplicationTemplate(newItem), ...catalog.filter(i => i.id !== newItem.id)])
      setLoading(false)
    } else {
      pushFeedback({ message: response.statusText, type: 'error' })
      setLoading(false)
    }
  }

  const removeCatalogItem = async (item) => {
    try {
      setLoading(true)
      const res = await request(`/api/v3/applicationTemplate/${item.name}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        pushFeedback({ message: res.statusText, type: 'error' })
      } else {
        setCatalog(catalog.filter(i => i.id !== item.id))
        pushFeedback({ message: 'Application template deleted', type: 'success' })
      }
      setLoading(false)
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error', uuid: 'error' })
      setLoading(false)
    }
  }

  const readCatalogItemFile = async (item) => {
    const file = item.files[0]
    if (file) {
      const reader = new window.FileReader()

      reader.onload = async function (evt) {
        console.log({ evt })
        try {
          const doc = yaml.safeLoad(evt.target.result)
          const [catalogItem, err] = await parseApplicationTemplate(doc)
          if (err) {
            return pushFeedback({ message: err, type: 'error' })
          }
          addCatalogItem(catalogItem)
        } catch (e) {
          console.error({ e })
          pushFeedback({ message: 'Could not parse the file', type: 'error' })
        }
      }

      reader.onerror = function (evt) {
        pushFeedback({ message: evt, type: 'error' })
      }

      reader.readAsText(file, 'UTF-8')
    }
  }

  const getDetails = (selectedItem) => {
    const detailsObj = { ...selectedItem }
    delete detailsObj.display
    return detailsObj
  }

  return (
    <>
      <div className={classes.container}>
        <CatalogTable {...{ loading: fetching, openMenu, catalog }} />
        <div>
          <FileDrop {...{ onDrop: readCatalogItemFile }}>
            <div className={classes.flexColumn}>
              <span>Drag a file here to update the catalog</span>
            </div>
          </FileDrop>
        </div>
      </div>
      <Modal
        {...{
          open: openDetailsModal,
          title: `${selectedItem.name} details`,
          onClose: () => setOpenDetailsModal(false)
        }}
      >
        <ReactJson title='Application template' src={getDetails(selectedItem)} name={false} />
      </Modal>
      <Confirm
        open={openRemoveConfirm}
        title={`Delete Application template ${selectedItem.name} ?`}
        onClose={() => setOpenRemoveConfirm(false)}
        onConfirm={() => {
          removeCatalogItem(selectedItem)
          setOpenRemoveConfirm(false)
        }}
      >
        <span>This is not reversible.</span>
      </Confirm>
      <Menu
        id='catalog-menu'
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={openDetails}>Details</MenuItem>
        <Divider />
        <MenuItem onClick={openRemove}>Remove item</MenuItem>
      </Menu>
    </>
  )
}
