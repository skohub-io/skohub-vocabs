import React from 'react'
import jsonpng from '../images/jsonld.png'

const JsonLink = ({to}) => (
  <a className="json-png" href={(process.env.BASEURL || "") + to}>
    <img src={jsonpng} alt="JSON" />
  </a>
)

export default JsonLink