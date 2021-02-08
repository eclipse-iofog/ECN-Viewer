import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'

function TabContainer (props) {
  return (
    <Typography component='div'>
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}))

export default function SimpleTabs (props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  function handleChange (event, newValue) {
    setValue(newValue)
  }

  const children = props.children.filter(c => !!c)

  return (
    <div className={classes.root}>
      {
        children.length === 1
          ? children
          : (
            <>
              <Tabs value={value} onChange={handleChange}>
                {children.map((child, idx) => {
                  return (
                    child && <Tab key={child.id || idx} label={child.props.title} />
                  )
                })}
              </Tabs>
              <TabContainer>{props.children[value]}</TabContainer>
            </>)
      }
    </div>
  )
}
