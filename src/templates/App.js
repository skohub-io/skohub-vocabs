/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useEffect, useState } from 'react'

import FlexSearch from 'flexsearch'
import escapeRegExp from 'lodash.escaperegexp'
import { t, getPath } from '../common'
import NestedList from '../components/nestedList'
import TreeControls from '../components/TreeControls'
import Layout from '../components/layout'
import SEO from '../components/seo'

import { style } from '../styles/concepts.css.js'

const App = ({pageContext, children}) => {
  const conceptSchemeId = pageContext.node.type === 'ConceptScheme'
    ? pageContext.node.id
    : pageContext.node.inScheme.id
  const [index, setIndex] = useState(FlexSearch.create('speed'))
  const [query, setQuery] = useState(null)
  const [tree, setTree] = useState(pageContext.node.type === 'ConceptScheme' ? pageContext.node : null)

  // Fetch and load the serialized index
  useEffect(() => {
    fetch(pageContext.baseURL +  getPath(conceptSchemeId, 'index'))
      .then(response => response.json())
      .then(serialized => {
        const idx = FlexSearch.create()
        idx.import(serialized)
        setIndex(idx)
        console.log("index loaded", idx.info())
      })
  }, [])

  // Fetch and load the tree
  useEffect(() => {
    pageContext.node.type !== 'ConceptScheme'
      && fetch(pageContext.baseURL + getPath(conceptSchemeId, 'json'))
        .then(response => response.json())
        .then(tree => setTree(tree))
  }, [])

  // Scroll current item into view
  useEffect(() => {
    const current = document.querySelector(".current")
    current && current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  })

  return (
    <Layout>
      <SEO
        title={t(pageContext.node.prefLabel || pageContext.node.title)}
        keywords={['Concept', t(pageContext.node.prefLabel || pageContext.node.title)]}
      />
      <div
        className="Concept"
        css={style}
      >
        <nav className="block">
          <input
            type="text"
            className="inputStyle"
            onChange={e => setQuery(e.target.value || null)}
            placeholder="Search"
            autoFocus
          />
          <TreeControls/>
          {tree && (
            <NestedList
              items={tree.hasTopConcept}
              current={console.log(pageContext.node.id) || pageContext.node.id}
              baseURL={pageContext.baseURL}
              filter={query ? index.search(query) : null}
              highlight={query ? RegExp(escapeRegExp(query), 'gi'): null}
            />
          )}
        </nav>
        {children}
      </div>
    </Layout>
  )
}

export default App
