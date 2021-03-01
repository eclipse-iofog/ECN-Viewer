import React from 'react'
import { TextField, Grid, Button, InputAdornment, Divider, useMediaQuery } from '@material-ui/core'
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
  const { user, refresh, updateController } = React.useContext(ControllerContext)
  const [data, setData] = React.useState({ user, refresh })
  const isLargeScreen = useMediaQuery('(min-width: 992px)')

  const padding = isLargeScreen ? 10 : 25
  const save = async () => {
    try {
      await updateController(data)
      pushFeedback({ message: 'Authenticated!', type: 'success' })
      props.onSave()
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
    }
  }

  const handleChange = name => event => {
    setData({ ...data, [name]: event.target.value })
  }
  const handleUserChange = name => event => {
    setData({ ...data, user: { ...data.user, [name]: event.target.value } })
  }
  return (
    <>
      <Grid container spacing={2} style={{ paddingBottom: (padding + 5) + 'px' }}>
        <Grid item xs={12} lg={6}>
          <TextField
            id='email'
            label='Email'
            onChange={handleUserChange('email')}
            value={data.user.email}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            id='password'
            label='Password'
            onChange={handleUserChange('password')}
            onKeyPress={(e) => e.key === 'Enter' && data.user.email && data.user.password ? save() : null}
            value={data.user.password}
            fullWidth
            type='password'
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={2} style={{ paddingTop: padding + 'px', paddingBottom: padding + 'px' }}>
        <Grid item xs={12} lg={6}>
          <TextField
            id='refresh'
            label='Update Frequency'
            type='number'
            onChange={handleChange('refresh')}
            value={data.refresh}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
            inputProps={{
              min: '1000',
              step: '500'
            }}
            InputProps={{
              endAdornment: <InputAdornment position='end'>ms</InputAdornment>
            }}
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
    </>
  )
}
