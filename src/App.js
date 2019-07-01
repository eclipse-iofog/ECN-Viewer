import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import Layout from './Layout'

import './App.css'
import FeedbackContext from './Utils/FeedbackContext'

function App () {
  return (
    <React.Fragment>
      <CssBaseline />
      <FeedbackContext>
        <Layout />
      </FeedbackContext>
    </React.Fragment>
  )
}

export default App
