import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import Layout from './Layout'

import './App.css'
import FeedbackContext from './Utils/FeedbackContext'
import ThemeContext from './Theme/ThemeProvider'
import ControllerContext from './ControllerProvider'

function App () {
  console.log(' ======> Rendering app ')
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeContext>
        <ControllerContext>
          <FeedbackContext>
            <Layout />
          </FeedbackContext>
        </ControllerContext>
      </ThemeContext>
    </React.Fragment>
  )
}

export default App
