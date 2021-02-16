import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

import customTheme from './theme.json'

export const colors = {
  cobalt: '#5064EC',
  gold: '#F5A623',
  argon: '#7A3BFF',
  carbon: '#00293E',
  lead: '#57687D',
  aluminium: '#ACB5C6',
  silver: '#FAFCFF',
  white: '#FFFFFF',
  primary: '#26D6F1',
  secondary: '#FF58D',
  purple: '#5064EC',
  neutral: '#506279'
}

export const theme = createMuiTheme({
  ...customTheme,
  colors: {
    ...colors,
    success: colors.primaryBlue,
    error: colors.secondary,
    danger: colors.gold
  }
})

export default function Theming (props) {
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  )
}
