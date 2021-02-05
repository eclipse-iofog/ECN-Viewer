import { theme } from '../Theme/ThemeProvider'

export const statusColor = {
  RUNNING: theme.colors.chromium,
  UNKNOWN: theme.colors.aluminium,
  OFFLINE: theme.colors.phosphorus
}

export const msvcStatusColor = {
  RUNNING: theme.colors.chromium,
  UNKNOWN: theme.colors.aluminium,
  OFFLINE: theme.colors.aluminium
}

export const tagColor = theme.colors.cobalt

export const dateFormat = 'YYYY/MM/DD hh:mm:ss a'
export const MiBFactor = 1048576

export const fogTypes = {
  0: 'auto-detect',
  1: 'x86',
  2: 'ARM'
}
