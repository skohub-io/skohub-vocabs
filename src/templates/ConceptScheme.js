import React, { useState, useEffect } from 'react'
import { css, jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'
import FlexSearch from 'flexsearch'
import { t, getPath } from '../common'
import NestedList from '../components/nestedList'

const ConceptScheme = ({pageContext}) => {
  const [index, setIndex] = useState(FlexSearch.create('speed'))
  const [query, setQuery] = useState(null)

  // Fetch and load the serialized index
  useEffect(() => {
    fetch(getPath(pageContext.node.id, 'index.json'))
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
       css={css`
        display: flex;
        max-height: 100vh;
        padding: 20px;

        a.current {
          color: tomato;
          font-weight: bold;
        }

        nav {
          overflow: auto;
          flex: 1;
          border-right: 1px solid black;
        }

        .content {
          padding: 0 20px;
          flex: 2;
        }

        .markdown {
          padding-top: 10px;
        }

      `}>
      <nav>
        <input type="text" onChange={e => setQuery(e.target.value || null)} />
        <NestedList
          items={JSON.parse(pageContext.tree).hasTopConcept}
          baseURL={pageContext.baseURL}
          filter={query ? index.search(query) : null}
          highlight={RegExp(query, 'gi')}
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
