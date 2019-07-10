import React from 'react'
import set from 'lodash/set'
import { TextField, Grid, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { ControllerContext } from '../ControllerProvider'
import { FeedbackContext } from '../Utils/FeedbackContext'

const useStyles = makeStyles({
  skeleton: {
    minHeight: '55px'
  }
})

export default function Config (props) {
  const classes = useStyles()
  const { pushFeedback } = React.useContext(FeedbackContext)
  const { controller, updateController } = React.useContext(ControllerContext)
  const [data, setData] = React.useState({ ...controller })

  const save = async () => {
    try {
      await updateController(data)
      pushFeedback({ message: 'Controller details saved!', type: 'success' })
      props.onSave()
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
    }
  }

  const handleChange = name => event => {
    set(data, name, event.target.value)
    setData(data)
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            id='ip'
            label='IP'
            onChange={handleChange('ip')}
            value={data.ip}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id='port'
            label='Port'
            onChange={handleChange('port')}
            value={data.port}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            id='email'
            label='Email'
            onChange={handleChange('user.email')}
            value={data.user.email}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id='password'
            label='Password'
            onChange={handleChange('user.password')}
            value={data.user.password}
            fullWidth
            type='password'
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />
        </Grid>
      </Grid>
      <Grid container justify='flex-end'>
        <Grid item>
          <Button onClick={save}>
            Save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
