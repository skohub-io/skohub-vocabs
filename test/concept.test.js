/* global expect */
/* global describe */
/* global test */
/* global beforeEach */

import React from "react"
import Enzyme, { shallow } from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import pageContext from "../test/data/pageContext"
import Concept from "../src/components/Concept"
import { StaticQuery } from "gatsby"

Enzyme.configure({ adapter: new Adapter() })

describe("Concept", () => {
  const wrapper = shallow(<Concept pageContext={pageContext} />)

  test("Renders", () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find(".content>h1").text()).toBe("Konstruktionstechnik")
  })
})
