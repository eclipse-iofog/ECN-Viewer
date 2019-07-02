import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import Layout from './Layout'

import './App.css'
import FeedbackContext from './Utils/FeedbackContext'
import ThemeContext from './Theme/ThemeProvider'

function App () {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeContext>
        <FeedbackContext>
          <Layout />
        </FeedbackContext>
      </ThemeContext>
    </React.Fragment>
  )
}

export default App
