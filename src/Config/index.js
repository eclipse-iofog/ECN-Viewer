import React from 'react'
import { TextField, Grid, Button } from '@material-ui/core'
import Alert from '../Utils/Alert'
import { makeStyles } from '@material-ui/styles'
const useStyles = makeStyles({

})

export default function Config (props) {
  const classes = useStyles()
  const [data, setData] = React.useState({
    email: '',
    password: '',
    ip: '',
    port: '',
    ...props.data
  })
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
      setFeedback({ message: e.message })
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
        message={<span id='config-feedback'>{feedback.message}</span>}
        variant={feedback.type}
      />}
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
            onChange={handleChange('email')}
            value={data.email}
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
            onChange={handleChange('password')}
            value={data.password}
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
    </div>
  )
}
