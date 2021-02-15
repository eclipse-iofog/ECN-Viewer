import React from 'react'

import { colors } from '../Theme/ThemeProvider'

const statusColor = {
  RUNNING: colors.chromium
}

export default function Status ({ status, style }) {
  return (
    <div style={{
      ...style,
      width: '20px',
      height: '20px',
      borderRadius: '10px',
      backgroundColor: statusColor[status] || 'grey'
    }}
    />)
}
