import React, { useEffect, useState } from 'react'
import { Badge, Avatar } from '@material-ui/core'
import MemoryIcon from '@material-ui/icons/Memory'
import CtrlIcon from '@material-ui/icons/DeveloperBoard'
import Icon from '@material-ui/core/Icon'
import { makeStyles, useTheme } from '@material-ui/styles'
import { MenuItem } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import { statusColor, msvcStatusColor, tagColor } from './utils'
import { useMap } from '../providers/Map'
import L from 'leaflet'
import { getAllProviderName, getProviderInfo } from '../providers/providerInfo'
import { MapContainer } from './myleaflet'

// Default map provider name
const defaultProvider = 'Google'
export const { Provider, Consumer } = React.createContext("a");
const useStyles = makeStyles(theme => ({
  mapMarkerTransform: {
    transform: 'translate(-50%, -100%)',
    position: 'absolute'
  },
  msvcBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: `var(--color, ${theme.colors.cobalt})`
    }
  },
  mapMarker: {
    backgroundColor: `var(--markerColor, ${theme.colors.success})`,
    borderRadius: '50% 50% 50% 0 !important',
    border: `2px solid var(--markerColor, ${theme.colors.success})`,
    transform: 'rotate(-45deg)',
    '& .MuiSvgIcon-root': {
      transform: 'rotate(-45deg)'
    }
  },
  mapWrapper: {
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    width: '100%',
    height: '100%',
    maxHeight: '700px',
    position: 'sticky',
    top: '25px',
    borderColor: theme.colors.aluminium,
    '& div': {
      borderRadius: '4px',
      '& div': {
        borderRadius: '4px'
      }
    }
  }
}))
/**
 * Renderer
 * @description This component do not return ANYTHING for user interface, it is only used for updating MapContainer props dynamically
 * @see https://stackoverflow.com/questions/65546744/not-able-to-change-center-dynamically-in-react-leaflet-v-3-x
 */
export default function Map(props) {
  const classes = useStyles()
  //mcstate value will be true after componentDidmount
  const [mcstate, setMcstate] = useState(false);
  const [mymap, setMymap] = useState(0);
  const [mymapurl, setMymapurl] = useState(0);
  let that = this
  const theme = useTheme()
  const { controller, agent, setAgent, msvcsPerAgent, loading } = props
  const { map, mapRef, hasValidCoordinates } = useMap()
  const [providerName, setProviderName] = useState(defaultProvider)

  useEffect(() => {
    console.log('Map has updated', controller)
  })
  function getMapContainer(a) {
    setMymap(a)
    console.log(a)
  }
  function changemcstate(a) {
    setMcstate(a)
    console.log(a)
  }
  function changemymapurl(a) {
    setMymapurl(a)
    console.log(a)
  }
  function ViewerMarker(props) {
    //componentDidmount is not over so this component return null
    if (mcstate == false) {
      return null
    } else {
      return (
        // componentDidmount is over Mymarker function can be mark on the map
        <Consumer>
          {(mymapobj) => {
            const Mymarker = L.marker(props.position).addTo(mymapobj);
            // var allcity = L.layerGroup(...Mymarker).addTo(mymapobj);
          }
          }
        </Consumer>
      );
    }
  }
  //change map center and zoom
  function SetViewOnClick({ coords }) {
    console.log(coords)
    if (mcstate == false) {
      return null
    } else {
      return (
        //  
        <Consumer>
          {(mymapobj) => {
            console.log(mymapobj)
            const map = mymapobj
            console.log(map)
            map.setView(coords.center, coords.zoom);
          }
          }
        </Consumer>
      );
    }
  }
  const handleProviderChange = (event) => {
    const pName = event.target.value
    setProviderName(pName)
  }

  var propsdata = (controller.agents).filter(a => hasValidCoordinates([a.latitude, a.longitude])).map(a =>
    [a.latitude, a.longitude]
  )

  var mymapurls = getAllProviderName().map(pName => {
    const pInfo = getProviderInfo(pName)
    if (providerName === pName) {
      return pInfo
    }
  })
  // console.log(propsdata)
  return (
    <div className={classes.mapWrapper} ref={mapRef}>
      {
      }
      <MapContainer
        {...map}
        position={propsdata}
        getfun={getMapContainer}//get leaflet example
        mcstate={changemcstate}//change react state
        mymapurl={mymapurls}
      >
        {console.log(mymap)}
        <Provider value={mymap}>
          <SetViewOnClick coords={map} />
          {(loading ? [] : controller.agents).filter(a => hasValidCoordinates([a.latitude, a.longitude])).map(a =>
            <ViewerMarker
              mInstance={MapContainer}
              key={a.uuid}
              position={[a.latitude, a.longitude]}
              eventHandlers={{
                click: () => {
                  setAgent(a)
                }
              }}
              mType='agent'
              mInfo={a}
            >
            </ViewerMarker>
          )}
        </Provider>
      </MapContainer>

    </div>
  )
}
