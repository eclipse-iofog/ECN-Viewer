import React from 'react'

import { TextField, InputAdornment, makeStyles } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'

const useStyle = makeStyles((theme) => ({
  input: {
    paddingTop: '10px',
    paddingBottom: '10px'
  },
  adornedStart: {
    paddingLeft: '5px'
  },
  adornedEnd: {
    paddingRight: '5px'
  },
  searchBar: {
    boxShadow: '0 0 6px #aaaaaa inset',
    borderRadius: '4px',
    '&:focus': {
      borderColor: theme.colors.cobalt
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
