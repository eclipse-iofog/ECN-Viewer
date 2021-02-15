import React from 'react'

import { Table, TableHead, TableRow, TableBody, TableCell, makeStyles } from '@material-ui/core'

import getSharedStyle from '../sharedStyles'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))

export default function MicroservicesTable ({ application, selectMicroservice }) {
  const classes = useStyles()

  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableTitle} style={{ top: '44px' }}>Name</TableCell>
          <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Status</TableCell>
          <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Ports</TableCell>
          <TableCell className={classes.tableTitle} style={{ top: '44px' }} align='right'>Volumes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {application.microservices.map((row) => (
          <TableRow key={row.uuid}>
            <TableCell component='th' scope='row' className={classes.action} onClick={() => selectMicroservice(row)}>
              {row.name}
            </TableCell>
            <TableCell align='right'>
              <span>{row.status.status}{row.status.status === 'PULLING' && ` (${row.status.percentage}%)`}</span>
              {row.status.errorMessage && <><br /><span>{row.status.errorMessage}</span></>}
            </TableCell>
            <TableCell align='right'>
              {row.ports.map(p => (
                <div key={p.internal}>{p.internal}:{p.external}/{p.protocol === 'udp' ? 'udp' : 'tcp'}</div>
              ))}
            </TableCell>
            <TableCell align='right'>
              {row.volumeMappings.map(p => (
                <div key={p.id}>{p.hostDestination}:{p.containerDestination}:{p.accessMode}</div>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
