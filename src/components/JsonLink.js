import { withPrefix } from "gatsby"
import React from "react"
import jsonpng from "../images/jsonld.png"

const JsonLink = ({ to }) => (
  <a className="json-png" href={withPrefix(to)}>
    <img src={jsonpng} alt="JSON" />
  </a>
)

export default JsonLink
