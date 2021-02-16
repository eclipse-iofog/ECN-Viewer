import React from 'react'

import { colors } from '../Theme/ThemeProvider'

export const statusColor = {
  RUNNING: colors.primary,
  UNKNOWN: colors.aluminium,
  ERROR: colors.secondary,
  OFFLINE: '#7A3BFF'
}

export const msvcStatusColor = {
  RUNNING: colors.primary,
  PULLING: colors.primary,
  UNKNOWN: colors.aluminium,
  QUEUED: colors.aluminium,
  STARTING: colors.primary,
  STOPPED: '#7A3BFF',
  STOPPING: '#7A3BFF'
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
  const pulse = ['PULLING', 'STOPPING', 'STARTING'].includes(status)
  return (
    <div
      style={{
        ...style,
        width: size + 'px',
        height: size + 'px',
        borderRadius: size + 'px',
        backgroundColor: msvcStatusColor[status] || msvcStatusColor.UNKNOWN
      }}
      className={pulse ? 'pulse' : ''}
    />)
}
