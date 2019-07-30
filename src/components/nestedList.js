import PropTypes from "prop-types"
import React from "react"
import { t } from '../common'

const NestedList = ({items, current, baseURL}) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <a
          className={item.id === current ? 'current' : ''}
          href={`${item.id.replace('http://', `/${baseURL}`).replace('#', '')}.html`}
        >
          {t(item.prefLabel)}
        </a>
        {item.narrower && <NestedList items={item.narrower} current={current} baseURL={baseURL} />}
      </li>
    ))}
  </ul>
)

export default NestedList
