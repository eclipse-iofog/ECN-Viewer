import React from 'react'
import { makeStyles } from '@material-ui/styles'
import PublishIcon from '@material-ui/icons/Publish'

import Skeleton from 'react-loading-skeleton'
import { Paper, Table, TableRow, TableCell, TableContainer, TableHead, TableBody, TablePagination } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'
import lget from 'lodash/get'
import SearchBar from '../../Utils/SearchBar'
import getSharedStyles from '../../ECNViewer/sharedStyles'
import FileDrop from '../../Utils/FileDrop'
import GetAppIcon from '@material-ui/icons/GetApp'

const useStyles = makeStyles(theme => ({
  ...getSharedStyles(theme),
  pointer: {
    cursor: 'pointer'
  },
  tableActions: {
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  link: {
    color: theme.palette.text.primary,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  hiddenInput: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1'
  }
}))

const filterFields = [
  'name',
  'description'
]

export default function CatalogTable (props) {
  const classes = useStyles()
  const { loading, uploading, openMenu, catalog, readCatalogItemFile } = props
  const [filter, setFilter] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const filterItem = (item) => {
    for (const field of filterFields) {
      if (lget(item, field, '').toString().toLowerCase().includes(filter)) { return true }
    }
    return false
  }

  const filteredCatalog = catalog.filter(filterItem)

  const emptyRows = loading ? 0 : rowsPerPage - Math.min(rowsPerPage, filteredCatalog.length - page * rowsPerPage)
  return (
    <Paper>
      <div className={`${classes.tableActions} ${classes.pointer}`}>
        <SearchBar {...{
          onSearch: setFilter
        }}
        />
        <div>
          <FileDrop {...{
            onDrop: readCatalogItemFile,
            onHover: <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}><GetAppIcon style={{ marginRight: '5px' }} /> Release to drop</div>,
            style: { paddingLeft: '5px', width: '400px' },
            loading: uploading
          }}
          >
            <div className={classes.flexColumn}>
              <input onChange={(e) => readCatalogItemFile(e.target)} class='box__file' type='file' name='files[]' id='file' className={classes.hiddenInput} />
              <div style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                <PublishIcon style={{ marginRight: '5px' }} />
                <span>To add a template, drag a YAML file here or&nbsp;</span>
                <label for='file' className={classes.link} style={{ marginRight: '5px', textDecoration: 'underline' }}>upload</label>
              </div>
            </div>
          </FileDrop>
        </div>
      </div>
      <TableContainer>
        <Table className={classes.table} stickyHeader aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell classes={{ stickyHeader: classes.stickyHeaderCell }}>Name</TableCell>
              <TableCell classes={{ stickyHeader: classes.stickyHeaderCell }} align='right'>Description</TableCell>
              <TableCell classes={{ stickyHeader: classes.stickyHeaderCell }} align='right'>Microservices</TableCell>
              <TableCell classes={{ stickyHeader: classes.stickyHeaderCell }} align='right'>Variables</TableCell>
              <TableCell classes={{ stickyHeader: classes.stickyHeaderCell }} align='right' />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={7}><Skeleton height={50} count={5} /></TableCell></TableRow> : filteredCatalog
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => (
                <TableRow key={row.name}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell align='right'>{row.description}</TableCell>
                  <TableCell align='right'>{row.display.microservices.join(', ')}</TableCell>
                  <TableCell align='right'>{row.display.variables.join(', ')}</TableCell>
                  <TableCell align='right' className={classes.pointer}>
                    <MoreIcon onClick={(e) => openMenu(row, e)} />
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={filteredCatalog.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
