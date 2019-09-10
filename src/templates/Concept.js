/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useEffect, useState } from 'react'
import Markdown from 'markdown-to-jsx'
import FlexSearch from 'flexsearch'
import escapeRegExp from 'lodash.escaperegexp'
import { t, getPath } from '../common'
import NestedList from '../components/nestedList'
import TreeControls from '../components/TreeControls'

import "../components/layout.css"

const Concept = ({pageContext}) => {
  const [index, setIndex] = useState(FlexSearch.create('speed'))
  const [query, setQuery] = useState(null)

  // Fetch and load the serialized index
  useEffect(() => {
    fetch(pageContext.baseURL +  getPath(pageContext.node.inScheme.id, 'index'))
      .then(response => response.json())
      .then(serialized => {
        const idx = FlexSearch.create()
        idx.import(serialized)
        setIndex(idx)
        console.log("index loaded", idx.info())
      })
  }, [])

  useEffect(() => {
    const current = document.querySelector(".current")
    current && current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  })

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
          height: 100%;
        }

        & > ul:before {
          content: none;
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
        current={pageContext.node.id}
        baseURL={pageContext.baseURL}
        filter={query ? index.search(query) : null}
        highlight={RegExp(escapeRegExp(query), 'gi')}
      />
    </nav>
    <div className="content">
      <h1>
        {pageContext.node.notation &&
          <span>{pageContext.node.notation.join(',')}&nbsp;</span>
        }
        {t(pageContext.node.prefLabel)}
      </h1>
      <h2>{pageContext.node.id}</h2>
      <p>
        <a href={`/deck/?hub=wss://test.skohub.io&topic=${encodeURIComponent(pageContext.node.id)}`}>Subscribe</a>
      </p>
      <p>
        <a href={pageContext.node.inbox}>Inbox</a>
      </p>
      {pageContext.node.definition
        && (
          <div className="markdown">
            <h3>Definition</h3>
            <Markdown>
              {t(pageContext.node.definition)}
            </Markdown>
          </div>
        )
      }
      {pageContext.node.scopeNote
        && (
          <div className="markdown">
            <h3>Scope Note</h3>
            <Markdown>
              {t(pageContext.node.scopeNote)}
            </Markdown>
          </div>
        )
      }
      {pageContext.node.note
        && (
          <div className="markdown">
            <h3>Note</h3>
            <Markdown>
              {t(pageContext.node.note)}
            </Markdown>
          </div>
        )
      }
    </div>
    </div>
  </div>
)}

export default Concept
