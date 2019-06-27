import React from 'react'

import { FormControl, Divider, Grid, Button, Input, InputLabel, Select, MenuItem, Checkbox, ListItemText, Chip } from '@material-ui/core'

import Alert from '../../Utils/Alert'

import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  formControl: {
    width: '100%',
    marginBottom: '15px'
  },
  divider: {
    margin: '5px'
  }
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

export default function RemoveMicroservice (props) {
  const classes = useStyles()
  const [msvcsToRemove, setMsvcsToRemove] = React.useState([])
  const [feedback, setFeedback] = React.useState([])

  function handleChange (event) {
    setMsvcsToRemove(event.target.value)
  }

  const remove = async () => {
    try {
      const feedbacks = []
      for (const uuid of msvcsToRemove) {
        const res = await window.fetch(`/api/controllerAPI/api/v3/microservices/${uuid}`, {
          method: 'DELETE'
        })
        if (!res.ok) {
          feedbacks.push({ message: `${msvcsPerUUID[uuid].name}: ${res.statusText}`, type: 'error', uuid })
        } else {
          const idx = msvcsToRemove.indexOf(uuid)
          setMsvcsToRemove([...msvcsToRemove.slice(0, idx), ...msvcsToRemove.slice(idx + 1)])
        }
      }
      if (!feedbacks.length) {
        feedbacks.push({ message: 'Microservices removed', type: 'success', uuid: 'success' })
      }
      setFeedback(feedbacks)
    } catch (e) {
      setFeedback([{ message: e.message, type: 'error', uuid: 'error' }])
    }
  }

  const { msvcs } = props

  const msvcsPerUUID = msvcs.reduce((r, m) => ({
    ...r,
    [m.uuid]: m
  }), {})

  return (
    <React.Fragment>
      {!!feedback.length && <Alert
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={feedback.length}
        onClose={() => setFeedback([])}
        autoHideDuration={6000}
        alerts={feedback.map((f, idx) => ({
          ...f,
          key: f.uuid,
          message: <span id={`rm-feedback-${f.uuid}`}>{f.message}</span>,
          onClose: () => setFeedback([...feedback.slice(0, idx), ...feedback.slice(idx + 1)])
        }))}
      />}
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor='select-multiple-checkbox'>Microservices to remove</InputLabel>
        <Select
          multiple
          value={msvcsToRemove}
          onChange={handleChange}
          input={<Input id='select-multiple-checkbox-rm-msvcs' />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(uuid => (
                msvcsPerUUID[uuid] && <Chip key={uuid} label={msvcsPerUUID[uuid].name} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {msvcs.map(m => (
            <MenuItem key={m.uuid} value={m.uuid}>
              <Checkbox checked={msvcsToRemove.indexOf(m.uuid) > -1} />
              <ListItemText primary={m.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider className={classes.divider} />
      <Grid container justify='flex-end'>
        <Grid item>
          <Button onClick={remove}>
            Remove
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
