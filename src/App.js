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
    <>
      <CssBaseline />
      <ThemeContext>
        <ControllerContext>
          <FeedbackContext>
            <Layout />
          </FeedbackContext>
        </ControllerContext>
      </ThemeContext>
    </>
  )
}

export default App
