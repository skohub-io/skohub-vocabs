import React, { useEffect, useState } from "react"
import escapeRegExp from "lodash.escaperegexp"
import { i18n, getFilePath } from "../common"
import NestedList from "../components/nestedList"
import TreeControls from "../components/TreeControls"
import Layout from "../components/layout"
import SEO from "../components/seo"
import LabelFilter from "../components/LabelFilter"

import { conceptStyle } from "../styles/concepts.css.js"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { useSkoHubContext } from "../context/Context.jsx"
import { withPrefix } from "gatsby"
import { handleKeypresses, importIndex } from "./helpers"

const App = ({ pageContext, children }) => {
  const { data } = useSkoHubContext()
  const { config } = getConfigAndConceptSchemes()
  const style = conceptStyle(config.colors)
  const [conceptSchemeId, setConceptSchemeId] = useState(
    data?.currentScheme?.id
  )
  const [index, setIndex] = useState({})
  const [query, setQuery] = useState(null)
  const [tree, setTree] = useState(
    pageContext.node.type === "ConceptScheme" ? pageContext.node : null
  )
  let showTreeControls = false

  const [labels, setLabels] = useState(
    Object.fromEntries(
      config.searchableAttributes.map((attr) => [
        attr,
        attr === "prefLabel" ? true : false,
      ])
    )
  )

  handleKeypresses(labels, setLabels)

  if (!showTreeControls && tree && tree.hasTopConcept) {
    for (const topConcept of tree.hasTopConcept) {
      if (topConcept.narrower?.length > 0) {
        showTreeControls = true
        break
      }
    }
  }

  // get concept scheme id from context
  useEffect(() => {
    if (data?.currentScheme?.id) {
      setConceptSchemeId(data.currentScheme.id)
    }
  }, [data])

  // Fetch and load the serialized index
  useEffect(() => {
    conceptSchemeId &&
      importIndex(conceptSchemeId, labels, setIndex, pageContext.language)
  }, [conceptSchemeId, pageContext.language, labels])

  // Fetch and load the tree
  useEffect(() => {
    conceptSchemeId &&
      // if node.type would be concept scheme the tree would already have been set
      pageContext.node.type !== "ConceptScheme" &&
      fetch(withPrefix(getFilePath(conceptSchemeId, "json")))
        .then((response) => response.json())
        .then((tree) => setTree(tree))
  }, [conceptSchemeId, pageContext.node.type])

  // Scroll current item into view
  useEffect(() => {
    const current = document.querySelector(".current")
    current &&
      current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      })
  })

  const toggleClick = (e) => setLabels({ ...labels, [e]: !labels[e] })

  return (
    <Layout languages={pageContext.languages} language={pageContext.language}>
      <SEO
        title={i18n(pageContext.language)(
          pageContext.node.prefLabel || pageContext.node.title
        )}
        keywords={[
          "Concept",
          i18n(pageContext.language)(
            pageContext.node.prefLabel || pageContext.node.title
          ),
        ]}
      />
      <div className="Concept" css={style}>
        <nav className="block nav-block">
          <input
            id="searchInput"
            type="text"
            className="inputStyle"
            onChange={(e) => setQuery(e.target.value || null)}
            placeholder="Search (Ctrl-k)"
            autoFocus
          />
          {/* filter labels to search */}
          <LabelFilter labels={labels} toggleClick={(e) => toggleClick(e)} />
          {showTreeControls && <TreeControls />}
          <div className="concepts">
            {tree && (
              <NestedList
                items={tree.hasTopConcept}
                current={pageContext.node.id}
                queryFilter={
                  query && index?.search ? index.search(query) : null
                }
                highlight={query ? RegExp(escapeRegExp(query), "gi") : null}
                language={pageContext.language}
                topLevel={true}
              />
            )}
          </div>
        </nav>
        {children}
      </div>
    </Layout>
  )
}

export default App
