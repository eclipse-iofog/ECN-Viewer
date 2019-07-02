import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { FeedbackContext } from '../Utils/FeedbackContext'
import { TextField, Grid, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  skeleton: {
    minHeight: '55px'
  }
})

export default function Config (props) {
  const classes = useStyles()
  const [data, setData] = React.useState({
    email: '',
    password: '',
    ip: '',
    port: ''
  })
  const [loading, setLoading] = React.useState(true)
  const { pushFeedback } = React.useContext(FeedbackContext)

  React.useEffect(() => {
    window.fetch('/api/controller')
      .then(res => res.json())
      .then(({ info }) => setData({
        ...data,
        ip: info.ip,
        port: info.port,
        email: info.user.email
      }))
      .then(() => setLoading(false))
      .catch(e => pushFeedback({ message: e.message, type: 'error' }))
  }, [])

  const save = async () => {
    try {
      const response = await window.fetch('/api/controller/connect', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ip: data.ip,
          port: data.port,
          user: {
            email: data.email,
            password: data.password
          }
        })
      })
      if (response.ok) {
        pushFeedback({ message: 'Controller details saved!', type: 'success' })
        props.onSave()
      } else {
        pushFeedback({ message: response.statusText, type: 'error' })
      }
    } catch (e) {
      pushFeedback({ message: e.message, type: 'error' })
    }
  }

  const handleChange = name => event => {
    setData({ ...data, [name]: event.target.value })
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {loading ? <Skeleton height={55} /> : <TextField
            id='ip'
            label='IP'
            onChange={handleChange('ip')}
            value={data.ip}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />}
        </Grid>
        <Grid item xs={12} sm={6}>
          {loading ? <Skeleton height={55} /> : <TextField
            id='port'
            label='Port'
            onChange={handleChange('port')}
            value={data.port}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {loading ? <Skeleton height={55} /> : <TextField
            id='email'
            label='Email'
            onChange={handleChange('email')}
            value={data.email}
            fullWidth
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />}
        </Grid>
        <Grid item xs={12} sm={6}>
          {loading ? <Skeleton height={55} /> : <TextField
            id='password'
            label='Password'
            onChange={handleChange('password')}
            value={data.password}
            fullWidth
            type='password'
            className={classes.textField}
            margin='normal'
            variant='outlined'
          />}
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
