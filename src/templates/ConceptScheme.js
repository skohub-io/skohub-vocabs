/** @jsx jsx */
import { useState, useEffect } from 'react'
import { css, jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'
import FlexSearch from 'flexsearch'
import escapeRegExp from 'lodash.escaperegexp'
import { t, getPath } from '../common'
import NestedList from '../components/nestedList'
import TreeControls from '../components/TreeControls'

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
       css={css`
        display: flex;
        max-height: 100vh;
        font-size: 16px;
        font-family: futura-pt,sans-serif,sans-serif;
        color: hsl(0, 0%, 24%);

        a {
          text-decoration: none;
          color: hsl(0, 0%, 24%);
        }

        a.current {
          color: tomato;
          font-weight: bold;
        }

        .btn {
          background-color: hsl(0, 0%, 24%);
          color: white;
          border: none;
          cursor: pointer;

          &:hover,
          &:focus {
            background-color: hsl(0, 0%, 40%);
          }
        }

        & > nav {
          flex: 1;
          border-right: 1px solid black;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;

          input[type=text] {
            width: 100%;
            border: 1px solid black;
            border-left: none;
            border-right: none;
            padding: 5px 10px;
          }

          & > ul {
            overflow: auto;
            margin: 0;
            padding: 10px;
          }
        }

        .content {
          padding: 20px;
          flex: 3;
        }

        .markdown {
          padding-top: 10px;
        }
      `}>
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
