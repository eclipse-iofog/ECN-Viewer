import React from 'react'

import MicroserviceCatalog from './Microservice'
import ApplicationCatalog from './Application'
import { ControllerContext } from '../ControllerProvider'

import SimpleTabs from '../Utils/Tabs'

export default function Catalog () {
  const { request } = React.useContext(ControllerContext)
  const [isApplicationtemplateCapable, setIsApplicationTemplateCapable] = React.useState(false)

  React.useEffect(() => {
    const checkCapability = async (name) => {
      const response = await request(`/api/v3/capabilities/${name}`, {
        method: 'HEAD'
      })
      if (response.ok) {
        return response.status === 204
      } else {
        return false
      }
    }
    const checkCapabilities = async () => {
      setIsApplicationTemplateCapable(await checkCapability('applicationTemplates'))
    }
    checkCapabilities()
  }, [])

  return (
    <SimpleTabs>
      {isApplicationtemplateCapable && <ApplicationCatalog title='Applications' />}
      <MicroserviceCatalog title='Microservices' />
    </SimpleTabs>
  )
}
