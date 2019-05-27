/* global expect */
/* global describe */
/* global test */
/* global beforeEach */

import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import BlogPost from '../src/templates/blog-post'
import organizations from '../src/data/organizations'
import { StaticQuery } from 'gatsby';

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

const replaceKeysInObj =  (obj)  => {
for (const key in obj) {
  const value = obj[key]
  obj[key.replace('@', '_')] = value
  delete obj[key]
  if (typeof value === 'object') {
    obj[key] = replaceKeysInObj(value)
  }
}
  return obj
}


replaceKeysInObj(organizations, '', 'NEW');

const data = {
  dataJson: {
    ...organizations
  },
}

describe('Layout', () => {
  const wrapper = shallow(
    <BlogPost data={data}/>
  )

  test('Renders', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.BlogPost').children().length).toBe(14)
  })

})
