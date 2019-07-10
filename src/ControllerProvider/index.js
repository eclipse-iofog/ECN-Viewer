import React, { useEffect } from 'react'

import controllerJson from './controller.json'

const initControllerState = {
  ...controllerJson,
  api: `http://${controllerJson.ip}:${controllerJson.port || 80}/`,
  location: {
    lat: 'Unknown',
    lon: 'Unknown',
    query: controllerJson.ip
  }
}

const IPLookUp = 'http://ip-api.com/json/'

export const ControllerContext = React.createContext({
  controller: {},
  updateController: () => {}
})

const lookUpControllerInfo = async (controllerConfig) => {
  const localhost = new RegExp('(0\.0\.0\.0|localhost|127\.0\.0\.1|192\.168\.)') // eslint-disable-line no-useless-escape
  const ip = localhost.test(controllerConfig.ip) ? '8.8.8.8' : controllerConfig.ip
  const response = await window.fetch(IPLookUp + ip)
  if (response.ok) {
    return response.json()
  } else {
    throw new Error(response.statusText)
  }
}

const updateControllerInfo = async (controllerConfig) => {
  let ipInfo = {}
  try {
    ipInfo = await lookUpControllerInfo(controllerConfig)
  } catch (e) {
    ipInfo = {
      lat: 'Unknown',
      lon: 'Unknown',
      query: controllerConfig.ip
    }
  }

  return {
    ...controllerConfig,
    location: ipInfo
  }
}

const initState = {
  controller: initControllerState,
  token: null
}

const actions = {
  ERROR: 'Error',
  CLEAN_ERROR: 'Clean error',
  UPDATE: 'Update',
  SET_TOKEN: 'Set token'
}

const reducer = (state, action) => {
  switch (action.type) {
    case actions.ERROR:
      return {
        ...state,
        controller: {
          ...state.controller,
          error: action.data
        }
      }
    case actions.CLEAN_ERROR:
      return {
        ...state,
        controller: {
          ...state.controller,
          error: null
        }
      }
    case actions.UPDATE:
      return {
        ...state,
        controller: {
          ...state.controller,
          ...action.data
        }
      }
    case actions.SET_TOKEN:
      return {
        ...state,
        token: action.data,
        controller: {
          ...state.controller,
          error: null
        }
      }
    default:
      return state
  }
}

export default function Context (props) {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { token, controller } = state

  console.log('======> Updating controller context')

  const authenticate = async (controllerConfig) => {
    const response = await window.fetch('/api/controllerApi/api/v3/user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ECN-Api-Destination': controllerConfig.api
      },
      body: JSON.stringify(controllerConfig.user)
    })
    if (response.ok) {
      const token = (await response.json()).accessToken
      dispatch({ type: actions.SET_TOKEN, data: token })
      return token
    } else {
      throw new Error(response.statusText)
    }
  }

  // Wrapper around window.fetch to add proxy and authorization headers
  const request = async (path, options = {}) => {
    try {
      let t = token
      if (!t) {
        t = await authenticate(controller)
      }
      const response = await window.fetch('/api/controllerApi' + path, {
        ...options,
        headers: {
          ...options.headers,
          'ECN-Api-Destination': controller.api,
          'Authorization': t
        }
      })
      if (state.controller.error) {
        dispatch({ type: actions.CLEAN_ERROR })
      }
      return response
    } catch (err) {
      dispatch({ type: actions.ERROR, data: err })
      return ({
        ok: false,
        statusText: 'Could not reach controller'
      })
    }
  }

  const updateController = async (newController) => {
    newController.api = `http://${newController.ip}:${newController.port || 80}/`
    try {
      await authenticate(newController)
    } catch (e) {
      dispatch({ type: actions.ERROR, data: e })
    }
    dispatch({ type: actions.UPDATE, data: await updateControllerInfo(newController) })
  }

  useEffect(() => (async () => {
    try {
      await authenticate(initState.controller)
    } catch (e) {
      dispatch({ type: actions.ERROR, data: e })
    }
    dispatch({ type: actions.UPDATE, data: await updateControllerInfo(initState.controller) })
  })(), [])

  return <ControllerContext.Provider value={{ controller, updateController, request }}>
    {props.children}
  </ControllerContext.Provider>
}
