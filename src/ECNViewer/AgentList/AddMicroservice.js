import React from 'react'
import ReactJson from 'react-json-view'
import get from 'lodash/get'

import { Grid, Paper, Typography, TextField, Divider, Select, Input, Button, InputLabel, FormControl, FormControlLabel, Checkbox, MenuItem } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import Alert from '../../Utils/Alert'
import Autocomplete from '../../Utils/Autocomplete'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  divider: {
    margin: '5px'
  },
  formControl: {
    width: '100%'
  },
  newPaper: {
    border: '1px solid hsla(0, 0%, 0%, 0.2)',
    boxShadow: '0 4px 6px 0 hsla(0,0%,0%,0.2)',
    borderRadius: '4px',
    padding: '10px',
    marginTop: '10px'
  },
  inputWithIcon: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const initMsvc = {
  flow: {},
  name: '',
  config: {},
  catalog: {
    images: []
  },
  volumeMappings: [],
  ports: [],
  rootHostAccess: false
}

const initFlow = {
  name: '',
  isActivated: true
}

const initCatalogItem = (fogTypeId) => ({
  name: '',
  images: [{
    containerImage: '',
    fogTypeId
  }],
  registryId: 1
})

const randomString = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)

export default function AddMicroservice (props) {
  const classes = useStyles()
  const [ flows, setFlows ] = React.useState([])
  const [ catalog, setCatalog ] = React.useState([])
  const [ msvc, setMsvc ] = React.useState(initMsvc)
  const [ feedback, setFeedback ] = React.useState(null)
  const [ newFlow, setNewFlow ] = React.useState(initFlow)
  const [ newCatalogItem, setNewCatalogItem ] = React.useState(() => initCatalogItem(get(props, 'target.fogTypeId', 1)))

  const agent = props.target

  React.useEffect(() => {
    Promise.all([(async () => {
      const flowRaw = await window.fetch('/api/controllerApi/api/v3/flow')
      if (flowRaw.ok) {
        const flowsRes = await flowRaw.json()
        setFlows(flowsRes.flows)
      }
    })(), (async () => {
      const catalogRaw = await window.fetch('/api/controllerApi/api/v3/catalog/microservices')
      if (catalogRaw.ok) {
        const catalogRes = await catalogRaw.json()
        setCatalog(catalogRes.catalogItems.filter(item => {
          for (const img of item.images) {
            if (img.fogTypeId === agent.fogTypeId) { return true }
          }
          return false
        })) // TODO: filter per userId
      }
    })()])
  }, [])

  const handleChange = (key, setter, prevState) => e => setter({ ...prevState, [key]: e.target.value })
  const handleMsvcChangeArray = (key, objKey, idx, valueDecorator = x => x) => e => setMsvc({
    ...msvc,
    [key]: [
      ...msvc[key].slice(0, idx),
      {
        ...msvc[key][idx],
        [objKey]: valueDecorator(e.target.value)
      },
      ...msvc[key].slice(idx + 1)
    ]
  })
  const getCatalogImage = item => {
    if (!item.id) { return 'Select an image' }
    for (const img of item.images) {
      if (img.fogTypeId === agent.fogTypeId) { return img.containerImage }
    }
    return 'Image not found'
  }

  const editConfig = (e) => {
    setMsvc({
      ...msvc,
      config: e.updated_src
    })
  }

  const addVolume = () => setMsvc({
    ...msvc,
    volumeMappings: [
      ...msvc.volumeMappings,
      {
        hostDestination: '',
        containerDestination: '',
        accessMode: 'z'
      }
    ]
  })

  const addPort = () => setMsvc({
    ...msvc,
    ports: [
      ...msvc.ports,
      {
        internal: '',
        external: ''
      }
    ]
  })

  const removeFromArray = (key, idx) => setMsvc({
    ...msvc,
    [key]: [...msvc[key].slice(0, idx), ...msvc[key].slice(idx + 1)]
  })

  const addMsvc = async () => {
    try {
      const { config, name, ports, volumeMappings, rootHostAccess } = msvc
      const response = await window.fetch('/api/controllerApi/api/v3/microservices', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: JSON.stringify(config),
          name,
          ports,
          volumeMappings,
          rootHostAccess,
          flowId: msvc.flow.id,
          iofogUuid: agent.uuid,
          catalogItemId: msvc.catalog.id
        })
      })
      if (response.ok) {
        setFeedback({ message: 'Microservice added!', type: 'success' })
        setMsvc(initMsvc)
      } else {
        setFeedback({ message: response.statusText, type: 'error' })
      }
    } catch (e) {
      setFeedback({ message: e.message })
    }
  }

  const createFlow = async () => {
    try {
      const { name } = newFlow
      const response = await window.fetch('/api/controllerApi/api/v3/flow', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFlow)
      })
      if (response.ok) {
        setFeedback({ message: 'Flow created!', type: 'success' })
        setNewFlow(initFlow)
        const flow = { ...await response.json(), name }
        setMsvc({ ...msvc, flow })
        msvc.flow = flow
        return true
      } else {
        setFeedback({ message: response.statusText, type: 'error' })
        return false
      }
    } catch (e) {
      setFeedback({ message: e.message })
      return false
    }
  }

  const createCatalogItem = async () => {
    try {
      const catalogItem = {
        ...newCatalogItem,
        name: randomString()
      }
      const response = await window.fetch('/api/controllerApi/api/v3/catalog/microservices', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(catalogItem)
      })
      if (response.ok) {
        setFeedback({ message: 'Image added to catalog!', type: 'success' })
        setNewCatalogItem(initCatalogItem(agent.fogTypeId))
        const catalog = { ...await response.json(), ...catalogItem }
        setMsvc({ ...msvc, catalog })
        msvc.catalog = catalog
        return true
      } else {
        setFeedback({ message: response.statusText, type: 'error' })
        return false
      }
    } catch (e) {
      setFeedback({ message: e.message })
      return false
    }
  }

  const createMsvc = async () => {
    let success = true
    try {
      if (msvc.flow.id === -1) {
        success = await createFlow()
      }
      if (success && msvc.catalog.id === -1) {
        success = await createCatalogItem()
      }
      if (success) {
        await addMsvc()
      }
    } catch (e) {

    }
  }

  return (
    <React.Fragment>
      {feedback && <Alert
        open={!!feedback}
        onClose={() => setFeedback(null)}
        autoHideDuration={6000}
        alerts={[{
          ...feedback,
          key: feedback.type,
          message: <span id={`rm-feedback-${feedback.type}`}>{feedback.message}</span>,
          onClose: () => setFeedback(null)
        }]}
      />}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.formControl}>
            <Autocomplete
              label='Flow'
              placeholder='Select a flow'
              onChange={(selected, state) => {
                handleChange('flow', setMsvc, msvc)({ target: { value: selected } })
              }}
              maxSuggestions={20}
              suggestions={flows.map(f => ({
                ...f,
                label: f.name
              })).concat([{
                id: -1,
                label: '+ Add a flow'
              }])}
            />
          </FormControl>
          {msvc.flow.id === -1 && <Paper className={classes.newPaper}>
            <Typography variant='subtitle2'>New flow</Typography>
            <TextField
              id='name'
              label='Name'
              required
              onChange={handleChange('name', setNewFlow, newFlow)}
              value={newFlow.name}
              fullWidth
              className={classes.textField}
              margin='normal'
            />
            <FormControlLabel
              style={{ color: 'rgba(0, 0, 0, 0.54)' }}
              control={
                <Checkbox
                  checked={newFlow.isActivated}
                  onChange={e => setNewFlow({ ...newFlow, isActivated: e.target.checked })}
                  value='checkedB'
                  color='primary'
                />
              }
              label='Active'
            />
          </Paper>}
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.formControl}>
            <Autocomplete
              label='Image'
              placeholder='Select an image'
              onChange={(selected, state) => {
                handleChange('catalog', setMsvc, msvc)({ target: { value: selected } })
              }}
              maxSuggestions={20}
              suggestions={catalog.map(m => ({
                ...m,
                label: getCatalogImage(m)
              })).concat([{
                id: -1,
                label: '+ Add an image'
              }])}
            />
          </FormControl>
          {msvc.catalog.id === -1 && <Paper className={classes.newPaper}>
            <Typography variant='subtitle2'>New image</Typography>
            <TextField
              id='name'
              label='Name'
              required
              onChange={e => setNewCatalogItem({
                ...newCatalogItem,
                images: [{
                  ...newCatalogItem.images[0],
                  containerImage: e.target.value
                }]
              })}
              value={newCatalogItem.images[0].containerImage}
              fullWidth
              className={classes.textField}
              margin='normal'
            />
          </Paper>}
        </Grid>
      </Grid>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <TextField
            id='name'
            label='Name'
            required
            onChange={handleChange('name', setMsvc, msvc)}
            value={msvc.name}
            fullWidth
            className={classes.textField}
            margin='normal'
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography style={{ color: 'rgba(0, 0, 0, 0.54)' }} variant='subtitle1'>Configuration</Typography><br />
          <ReactJson src={msvc.config} name={false} onAdd={editConfig} onEdit={editConfig} onDelete={editConfig} />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography style={{ color: 'rgba(0, 0, 0, 0.54)' }} variant='subtitle1'>Volumes</Typography><br />
          {msvc.volumeMappings.map((v, idx) =>
            <Grid container spacing={2} key={idx} style={{ alignItems: 'flex-end' }}>
              <Grid item xs={11}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='host'
                      label='Host'
                      required
                      onChange={handleMsvcChangeArray('volumeMappings', 'hostDestination', idx)}
                      value={v.hostDestination}
                      fullWidth
                      className={classes.textField}
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='Container'
                      label='Container'
                      required
                      onChange={handleMsvcChangeArray('volumeMappings', 'containerDestination', idx)}
                      value={v.containerDestination}
                      fullWidth
                      className={classes.textField}
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} >
                    <FormControl className={classes.formControl} style={{ marginTop: '5px' }}>
                      <InputLabel htmlFor='select-flow'>Access mode</InputLabel>
                      <Select
                        required
                        value={v.accessMode}
                        onChange={handleMsvcChangeArray('volumeMappings', 'accessMode', idx)}
                        input={<Input id='select-flow-input' />}
                        MenuProps={MenuProps}
                      >
                        <MenuItem value='z'>Z</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1}>
                <CloseIcon style={{ cursor: 'pointer' }} onClick={() => removeFromArray('volumeMappings', idx)} />
              </Grid>
            </Grid>
          )}
          <Typography style={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} variant='caption' onClick={() => addVolume()}>+ Add</Typography>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography style={{ color: 'rgba(0, 0, 0, 0.54)' }} variant='subtitle1'>Ports</Typography><br />
          {msvc.ports.map((p, idx) =>
            <Grid container spacing={2} key={idx} style={{ alignItems: 'flex-end' }}>
              <Grid item xs={11}>
                <Grid container spacing={2} >
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='host'
                      label='External'
                      required
                      type='number'
                      onChange={handleMsvcChangeArray('ports', 'external', idx, parseInt)}
                      value={p.external}
                      fullWidth
                      className={classes.textField}
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id='Container'
                      label='Internal'
                      required
                      fullWidth
                      type='number'
                      onChange={handleMsvcChangeArray('ports', 'internal', idx, parseInt)}
                      value={p.internal}
                      className={classes.textField}
                      margin='dense'
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1}>
                <CloseIcon style={{ cursor: 'pointer' }} onClick={() => removeFromArray('ports', idx)} />
              </Grid>
            </Grid>
          )}
          <Typography style={{ color: 'rgba(0, 0, 0, 0.54)', cursor: 'pointer' }} variant='caption' onClick={() => addPort()}>+ Add</Typography>
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <FormControlLabel
        style={{ color: 'rgba(0, 0, 0, 0.54)' }}
        control={
          <Checkbox
            checked={msvc.rootHostAccess}
            onChange={e => setMsvc({ ...msvc, rootHostAccess: e.target.checked })}
            value='checkedB'
            color='primary'
          />
        }
        label='Root host access'
      />
      <Divider className={classes.divider} />
      <Grid container justify='flex-end'>
        <Grid item>
          <Button onClick={createMsvc}>
            Add
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
