import React from 'react'
import {Link} from 'gatsby'
import jsonpng from '../images/jsonld.png'

const JsonLink = ({to}) => (
  <Link className="json-png" to={to}>
    <img src={jsonpng} alt="JSON" />
  </Link>
)

export default JsonLink