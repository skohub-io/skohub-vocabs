/* global expect */
/* global describe */
/* global test */
/* global beforeEach */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { StaticQuery } from 'gatsby'
import { createHistory, createMemorySource, LocationProvider } from '@reach/router'
import Layout from '../src/components/layout'

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) =>
    render({
      site: {
        siteMetadata: {
          title: `Default Starter`,
        },
      },
    })
  )
})

const data = {
  site: {
    siteMetadata: {
      title: "Gatsby Starter Blog",
    },
  },
}

describe('Layout', () => {
  const wrapper = shallow(
    <LocationProvider history={createHistory(createMemorySource('/'))}>
      <Layout data={data}>
        <div>Test Layout</div>
      </Layout>
    </LocationProvider>
  )

  test('Renders', () => {
    const html = wrapper.html()
    expect(wrapper.exists()).toBe(true)
    expect(html.includes('header')).toBe(true)
    expect(html.includes('Test Layout')).toBe(true)
  })

})
