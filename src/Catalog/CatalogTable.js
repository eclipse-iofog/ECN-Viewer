import React from 'react'
import { makeStyles } from '@material-ui/styles'

import Skeleton from 'react-loading-skeleton'
import { Avatar, TextField, InputAdornment, Paper, Table, TableRow, TableCell, TableContainer, TableHead, TableBody, TablePagination } from '@material-ui/core'

import MoreIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import lget from 'lodash/get'

const useStyles = makeStyles(theme => ({
  pointer: {
    cursor: 'pointer'
  },
  avatarContainer: {
    backgroundColor: theme.colors.chromium
  },
  tableActions: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const filterFields = [
  'name',
  'images.x86',
  'images.arm',
  'category',
  'registry.url'
]

export default function CatalogTable (props) {
  const classes = useStyles()
  const { loading, openMenu, catalog, onAdd } = props
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
      if (lget(item, field, '').toLowerCase().includes(filter)) { return true }
    }
    return false
  }

  const filteredCatalog = catalog.filter(filterItem)

  const emptyRows = loading ? 0 : rowsPerPage - Math.min(rowsPerPage, filteredCatalog.length - page * rowsPerPage)
  return (
    <>
      <div className={`${classes.tableActions} ${classes.pointer}`}>
        <Avatar className={classes.avatarContainer} onClick={() => onAdd()}>+</Avatar>
        <TextField
          className={classes.margin}
          id='input-with-icon-textfield'
          label='Filter'
          value={filter}
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment className={classes.pointer} position='start'>
                <ClearIcon onClick={() => setFilter('')} />
              </InputAdornment>
            )
          }}
        />
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} stickyHeader aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Description</TableCell>
              <TableCell align='right'>Supported platforms</TableCell>
              <TableCell align='right'>Publisher</TableCell>
              <TableCell align='right'>Registry</TableCell>
              <TableCell align='right'>Category</TableCell>
              <TableCell align='right' />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6}><Skeleton height={50} count={5} /></TableCell></TableRow> : filteredCatalog
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => (
                <TableRow key={row.name}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell align='right'>{row.description}</TableCell>
                  <TableCell align='right'>{row.supportedPlatforms.join(', ')}</TableCell>
                  <TableCell align='right'>{row.publisher}</TableCell>
                  <TableCell align='right'>{row.registry.url}</TableCell>
                  <TableCell align='right'>{row.category}</TableCell>
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
    </>
  )
}
