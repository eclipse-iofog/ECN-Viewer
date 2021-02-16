import React from 'react'

import { colors } from '../Theme/ThemeProvider'

export const statusColor = {
  RUNNING: colors.primary,
  UNKNOWN: colors.aluminium,
  OFFLINE: colors.secondary
}

export const msvcStatusColor = {
  RUNNING: colors.primary,
  UNKNOWN: colors.aluminium,
  OFFLINE: colors.aluminium
}

const defaultSize = 15

export default function Status ({ status, style, size = defaultSize }) {
  return (
    <div style={{
      ...style,
      width: size + 'px',
      height: size + 'px',
      borderRadius: size + 'px',
      backgroundColor: statusColor[status] || statusColor.UNKNOWN
    }}
    />)
}

export function MsvcStatus ({ status, style, size = defaultSize }) {
  return (
    <div style={{
      ...style,
      width: size + 'px',
      height: size + 'px',
      borderRadius: size + 'px',
      backgroundColor: msvcStatusColor[status] || msvcStatusColor.UNKNOWN
    }}
    />)
}
