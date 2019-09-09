/** @jsx jsx */
import { useState, useEffect } from 'react'
import { jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'
import FlexSearch from 'flexsearch'
import escapeRegExp from 'lodash.escaperegexp'
import { t, getPath } from '../common'
import NestedList from '../components/nestedList'
import TreeControls from '../components/TreeControls'

import { style } from '../styles/concepts.css.js'

import "../components/layout.css"

const ConceptScheme = ({pageContext}) => {
  const [index, setIndex] = useState(FlexSearch.create('speed'))
  const [query, setQuery] = useState(null)

  // Fetch and load the serialized index
  useEffect(() => {
    fetch(pageContext.baseURL + getPath(pageContext.node.id, 'index'))
      .then(response => response.json())
      .then(serialized => {
        const idx = FlexSearch.create()
        idx.import(serialized)
        setIndex(idx)
        console.log("index loaded", idx.info())
      })
  }, [])

  return (
    <div className="Concept">

      <div className="layout"
       css={style}>
      <nav>
        <input
          type="text"
          onChange={e => setQuery(e.target.value || null)}
          placeholder="Search"
        />
        <TreeControls/>
        <NestedList
          items={JSON.parse(pageContext.tree).hasTopConcept}
          baseURL={pageContext.baseURL}
          filter={query ? index.search(query) : null}
          highlight={RegExp(escapeRegExp(query), 'gi')}
        />
      </nav>
      <div className="content">
        <h1>{t(pageContext.node.title)}</h1>
        <h2>{pageContext.node.id}</h2>
        {pageContext.node.description
          && (
            <div className="markdown">
              <Markdown>
                {t(pageContext.node.description)}
              </Markdown>
            </div>
          )
        }
      </div>
      </div>
    </div>
  )
}

export default ConceptScheme
