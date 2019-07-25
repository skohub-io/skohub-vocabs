import PropTypes from "prop-types"
import React from "react"

const NestedList = ({items, current, baseURL}) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <a
          className={item.id === current ? 'current' : ''}
          href={`${item.id.replace('http://', `/${baseURL}`).replace('#', '')}.html`}
        >
          {item.prefLabel[Object.keys(item.prefLabel)[0]]}
        </a>
        {item.narrower && <NestedList items={item.narrower} current={current} baseURL={baseURL} />}
      </li>
    ))}
  </ul>
)

export default NestedList
