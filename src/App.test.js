import React from 'react'
import ReactDOM from 'react-dom'
import { render } from '@testing-library/react'
import App from './App'

/* globals it, expect */

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('renders Agents list', () => {
  const { getByText } = render(<App />)
  expect(getByText('Agents')).toBeInTheDocument()
})

it('renders Active resources', () => {
  const { getByText } = render(<App />)
  expect(getByText('Active resources')).toBeInTheDocument()
  expect(getByText('Applications')).toBeInTheDocument()
  expect(getByText('Microservices')).toBeInTheDocument()
})
