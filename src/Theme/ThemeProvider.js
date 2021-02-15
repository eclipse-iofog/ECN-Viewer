import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

import customTheme from './theme.json'

export const colors = {
  phosphorus: '#FF585D',
  cobalt: '#5064EC',
  gold: '#F5A623',
  chromium: '#00C0A9',
  argon: '#7A3BFF',
  carbon: '#002E43',
  lead: '#57687D',
  aluminium: '#ACB5C6',
  silver: '#FAFCFF',
  white: '#FFFFFF'
}

export const theme = createMuiTheme({
  ...customTheme,
  colors: {
    ...colors,
    success: colors.chromium,
    error: colors.phosphorus,
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
