import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { TextField, Grid, Button } from '@material-ui/core'
import Alert from '../Utils/Alert'
import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({
  skeleton: {
    minHeight: '55px'
  }
})

export default function Config () {
  const classes = useStyles()
  const [data, setData] = React.useState({
    email: '',
    password: '',
    ip: '',
    port: ''
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    window.fetch('/api/controller')
      .then(res => res.json())
      .then(({ info }) => setData({
        ip: info.ip,
        port: info.port,
        email: info.user.email
      }))
      .then(() => setLoading(false))
      .catch(e => setFeedback({ message: e.message, type: 'error' }))
  }, [])

  const [feedback, setFeedback] = React.useState(null)
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
        setFeedback({ message: 'Controller details saved!', type: 'success' })
      } else {
        setFeedback({ message: response.statusText, type: 'error' })
      }
    } catch (e) {
      setFeedback({ message: e.message, type: 'error' })
    }
  }

  const handleChange = name => event => {
    setData({ ...data, [name]: event.target.value })
  }

  return (
    <div>
      {feedback && <Alert
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={!!feedback}
        onClose={() => setFeedback(null)}
        autoHideDuration={6000}
        alerts={[{
          message: <span id='config-feedback'>{feedback.message}</span>,
          type: feedback.type,
          onClose: () => setFeedback(null)
        }]}
      />}
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
    </div>
  )
}
