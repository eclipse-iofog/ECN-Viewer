import React, { useEffect } from 'react'

import controllerJson from './controller.json'

const initControllerState = (() => {
  const localUser = window.localStorage.getItem('iofogUser')
  if (localUser) {
    controllerJson.user = JSON.parse(localUser)
  }
  return {
    ...controllerJson,
    api: `${window.location.protocol}//${controllerJson.ip}:${controllerJson.port || 80}/`,
    location: {
      lat: 'Unknown',
      lon: 'Unknown',
      query: controllerJson.ip
    }
  }
})()

const IPLookUp = 'http://ip-api.com/json/'

// If dev mode, use proxy
// Otherwise assume you are running on the Controller
const getUrl = (path) => controllerJson.dev ? `/api/controllerApi${path}` : `${window.location.protocol}//${[window.location.hostname, controllerJson.port].join(':')}${path}`
const getHeaders = (headers, controllerConfig) => controllerJson.dev
  ? ({
    ...headers,
    'ECN-Api-Destination': controllerConfig.api
  }) : headers

export const ControllerContext = React.createContext({
  controller: {},
  updateController: () => {}
})

const lookUpControllerInfo = async (controllerConfig) => {
  if (!controllerConfig.ip) {
    controllerConfig.ip = window.location.host.split(':')[0] // Get only ip, not port
  }
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
  console.log({ state, action })
  const newState = (() => {
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
  })()
  newState.controller.dev = controllerJson.dev
  return newState
}

export default function Context (props) {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const { token, controller } = state

  console.log('======> Updating controller context')

  const authenticate = async (controllerConfig) => {
    const response = await window.fetch(getUrl('/api/v3/user/login'), {
      method: 'POST',
      headers: getHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, controllerConfig),
      body: JSON.stringify(controllerConfig.user)
    })
    if (response.ok) {
      const token = (await response.json()).accessToken
      dispatch({ type: actions.SET_TOKEN, data: token })
      return token
    } else {
      dispatch({ type: actions.SET_TOKEN, data: null })
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
      const response = await window.fetch(getUrl(path), {
        ...options,
        headers: getHeaders({
          ...options.headers,
          'Authorization': t
        }, controller)
      })
      if (state.controller.error) {
        dispatch({ type: actions.CLEAN_ERROR })
      }
      return response
    } catch (err) {
      dispatch({ type: actions.ERROR, data: err })
      return ({
        ok: false,
        statusText: err.message || 'Could not reach controller'
      })
    }
  }

  const updateController = async (newController) => {
    if (controllerJson.dev) { newController.api = `http://${newController.ip}:${newController.port || 80}/` }
    window.localStorage.setItem('iofogUser', JSON.stringify(newController.user))
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
