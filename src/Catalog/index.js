import React from 'react'
import { makeStyles } from '@material-ui/styles'
import ReactJson from 'react-json-view'
import { Menu, MenuItem, Divider, Typography } from '@material-ui/core'

import { ControllerContext } from '../ControllerProvider'
import { FeedbackContext } from '../Utils/FeedbackContext'
import Modal from '../Utils/Modal'
import CatalogTable from './CatalogTable'
import AddCatalogItemForm from './AddCatalogItemForm'
import Confirm from '../Utils/Confirm'

const useStyles = makeStyles(theme => ({
  pointer: {
    cursor: 'pointer'
  },
  container: {
    padding: '10px 50px 10px 30px'
  },
  titleRow: {
    marginBottom: '30px'
  }
}))

const mapImages = (images) => {
  const map = {
    x86: '',
    arm: ''
  }
  for (const img of images) {
    switch (img.fogTypeId) {
      case 1:
        map.x86 = img.containerImage
        break
      case 2:
        map.arm = img.containerImage
        break
      default:
        break
    }
  }
  return map
}
const mapCatalogItem = (item, registries) => {
  item.images = mapImages(item.images)
  item.registry = registries.find(r => r.id === item.registryId)
  if (item.configExample) {
    try {
      item.configExample = JSON.parse(item.configExample)
    } catch (e) {
    }
  }
  return item
}

export default function Catalog () {
  const classes = useStyles()
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false)
  const [openRemoveConfirm, setOpenRemoveConfirm] = React.useState(false)
  const [openAddCatalogItemModal, setOpenAddCatalogItemModal] = React.useState(false)
  const [fetching, setFetching] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [catalog, setCatalog] = React.useState([])
  const [registries, setRegistries] = React.useState([])
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

  async function fetchCatalog () {
    try {
      setFetching(true)
      const catalogItemsResponse = await request('/api/v3/catalog/microservices')
      if (!catalogItemsResponse.ok) {
        pushFeedback({ message: catalogItemsResponse.statusText, type: 'error' })
        setFetching(false)
        return
      }
      let catalogItems = (await catalogItemsResponse.json()).catalogItems
      const registriesResponse = await request('/api/v3/registries')
      if (!registriesResponse.ok) {
        pushFeedback({ message: registriesResponse.statusText, type: 'error' })
        setFetching(false)
        return
      }
      const registries = (await registriesResponse.json()).registries
      catalogItems = catalogItems.map(item => mapCatalogItem(item, registries))
      console.log({ catalogItems })
      setCatalog(catalogItems)
      setRegistries(registries)
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
    const newItem = {
      ...item,
      images: [{
        fogTypeId: 1,
        containerImage: item.images.x86
      }, {
        fogTypeId: 2,
        containerImage: item.images.arm
      }]
    }
    setLoading(true)
    const response = await request('/api/v3/catalog/microservices', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
    if (response.ok) {
      pushFeedback({ message: 'Item added to the Catalog!', type: 'success' })
      newItem.id = (await response.json()).id
      setCatalog([mapCatalogItem(newItem, registries), ...catalog])
      setLoading(false)
    } else {
      pushFeedback({ message: response.statusText, type: 'error' })
      setLoading(false)
    }
  }

  const removeCatalogItem = async (item) => {
    try {
      setLoading(true)
      const res = await request(`/api/v3/catalog/microservices/${item.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        pushFeedback({ message: res.statusText, type: 'error' })
      } else {
        setCatalog(catalog.filter(i => i.id !== item.id))
        pushFeedback({ message: 'Catalog item deleted', type: 'success' })
      }
      setLoading(false)
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error', uuid: 'error' })
      setLoading(false)
    }
  }

  return (
    <>
      <div className={classes.container}>
        <div className={classes.titleRow}>
          <Typography variant='h5'>Catalog</Typography>
        </div>
        <CatalogTable {...{ loading: fetching, openMenu, catalog, onAdd: () => setOpenAddCatalogItemModal(true) }} />
      </div>
      <Modal
        {...{
          open: openDetailsModal,
          title: `${selectedItem.name} details`,
          onClose: () => setOpenDetailsModal(false)
        }}
      >
        <ReactJson title='Catalog item' src={selectedItem} name={false} />
      </Modal>
      <Modal
        {...{
          open: openAddCatalogItemModal,
          title: 'Add an item to the Catalog',
          onClose: () => setOpenAddCatalogItemModal(false)
        }}
      >
        <AddCatalogItemForm {...{
          loading,
          registries,
          onSave: async (item) => {
            try {
              await addCatalogItem(item)
              setOpenAddCatalogItemModal(false)
            } catch (e) {
              pushFeedback({ message: e.message, type: 'error' })
            }
          }
        }}
        />
      </Modal>
      <Confirm
        open={openRemoveConfirm}
        title={`Delete catalog item ${selectedItem.name} ?`}
        onClose={() => setOpenRemoveConfirm(false)}
        onConfirm={() => {
          removeCatalogItem(selectedItem)
          setOpenRemoveConfirm(false)
        }}
      />
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
