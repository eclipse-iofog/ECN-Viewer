import React from 'react'

import { Table, TableHead, TableRow, TableBody, TableCell, makeStyles } from '@material-ui/core'

import getSharedStyle from '../sharedStyles'

import { MsvcStatus as Status } from '../../Utils/Status'

const useStyles = makeStyles(theme => ({
  ...getSharedStyle(theme)
}))

export default function MicroservicesTable ({ application, selectMicroservice }) {
  const classes = useStyles()

  const microservices = application.microservices
  if (!microservices.length) {
    microservices.push({ uuid: 'filler' })
  }

  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeaderCell }} style={{ top: '44px' }}>Name</TableCell>
          <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeaderCell }} style={{ top: '44px' }} align='right'>Status</TableCell>
          <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeaderCell }} style={{ top: '44px' }} align='right'>Ports</TableCell>
          <TableCell className={classes.tableTitle} classes={{ stickyHeader: classes.stickyHeaderCell }} style={{ top: '44px' }} align='right'>Volumes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {microservices.map((row) => {
          if (!row.name) {
            return <TableRow key={row.uuid}><TableCell colSpan={4} /></TableRow>
          }
          return (
            <TableRow key={row.uuid}>
              <TableCell component='th' scope='row' className={classes.action} onClick={() => selectMicroservice(row)}>
                <span style={{ display: 'flex', alignItems: 'center' }}><Status status={row.status.status} size={10} style={{ marginRight: '5px', '--pulse-size': '5px' }} />{row.name}</span>
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
          )
        })}
      </TableBody>
    </Table>
  )
}
