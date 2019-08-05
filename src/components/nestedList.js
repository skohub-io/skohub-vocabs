import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { t } from '../common'

const getNestedItems = item => {
  let ids = [item.id]
  if (item.narrower) {
    item.narrower.forEach(narrower => {
      ids = ids.concat(getNestedItems(narrower))
    })
  }
  return ids
}

const NestedList = ({ items, current, baseURL, filter, highlight }) => {
  const filteredItems = filter
    ? items.filter(item => !filter || filter.some(filter => getNestedItems(item).includes(filter)))
    : items

  return (
    <ul>
      {filteredItems.map(item => (
        <li
          key={item.id}
        >
          <a
            className={item.id === current ? 'current' : ''}
            href={`${item.id.replace('http://', `${baseURL}/`).replace('#', '')}.html`}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: t(item.prefLabel).replace(highlight, str => `<strong>${str}</strong>`)
              }}
            />
          </a>
          {item.narrower &&
            <NestedList
              items={item.narrower}
              current={current}
              baseURL={baseURL}
              filter={filter}
              highlight={highlight}
            />
          }
        </li>
      ))}
    </ul>
  )
}

export default NestedList
