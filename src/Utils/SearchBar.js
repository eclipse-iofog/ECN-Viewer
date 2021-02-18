import React from 'react'

import { TextField, InputAdornment, makeStyles } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'

const useStyle = makeStyles((theme) => ({
  input: {
    paddingTop: '10px',
    color: theme.colors.neutral_3,
    paddingBottom: '10px'
  },
  adornedStart: {
    color: theme.colors.neutral_3,
    paddingLeft: '5px'
  },
  adornedEnd: {
    paddingRight: '5px'
  },
  searchBar: {
    boxShadow: 'inset 0px 1px 3px rgba(0,0,0,.2), inset 0px 1px 8px rgba(0,0,0,.1)',
    border: 'none!important',
    borderColor: theme.colors.neutral_2,
    color: theme.colors.neutral_2,
    borderRadius: '4px',
    '&:focus': {
      borderColor: theme.colors.neutral_2
    }
    // boxShadow: 'inset 0 0 8px 0px rgba(0, 0, 0, 0.19)'
  }
}))

export default function SearchBar ({ style, onSearch, classes: _classes }) {
  const [value, setValue] = React.useState('')
  const classes = useStyle()

  const handleChange = (e) => {
    const newValue = e.target.value.toLowerCase()
    onSearch(newValue)
    setValue(newValue)
  }

  const ornaments = {
    startAdornment: (
      <InputAdornment position='start'>
        <SearchIcon />
      </InputAdornment>
    )
    // endAdornment: value ? (
    //   <InputAdornment style={{ cursor: 'pointer' }} position='end'>
    //     <ClearIcon onClick={() => handleChange({ target: { value: '' } })} />
    //   </InputAdornment>
    // ) : undefined
  }

  return (
    <TextField
      style={{
        ...style
      }}
      id='searchBar'
      value={value}
      onChange={handleChange}
      variant='outlined'
      className={classes.searchBar}
      InputProps={{
        classes: { ...classes, ..._classes },
        ...ornaments
      }}
    />
  )
}
