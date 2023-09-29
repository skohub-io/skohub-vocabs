import React, { useEffect, useState } from "react"
import escapeRegExp from "lodash.escaperegexp"
import { i18n, getFilePath } from "../common"
import NestedList from "../components/nestedList"
import TreeControls from "../components/TreeControls"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Search from "../components/Search"

import { conceptStyle } from "../styles/concepts.css.js"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { useSkoHubContext } from "../context/Context.jsx"
import { withPrefix } from "gatsby"
import { handleKeypresses, importIndex } from "./helpers"

const App = ({ pageContext, children }) => {
  const { data } = useSkoHubContext()
  const { config } = getConfigAndConceptSchemes()
  const style = conceptStyle(config.colors)
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

  // Fetch and load the serialized index
  useEffect(() => {
    importIndex(
      data?.currentScheme?.id,
      labels,
      pageContext.language,
      setIndex,
      config.customDomain
    )
  }, [data, pageContext.language, labels])

  // Fetch and load the tree
  useEffect(() => {
    data?.currentScheme?.id &&
      // if node.type would be concept scheme the tree would already have been set
      pageContext.node.type !== "ConceptScheme" &&
      fetch(
        withPrefix(
          getFilePath(data?.currentScheme?.id, "json", config.customDomain)
        )
      )
        .then((response) => response.json())
        .then((tree) => setTree(tree))
  }, [data, pageContext.node.type])

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
          <Search
            handleQueryInput={(e) => setQuery(e.target.value || null)}
            labels={labels}
            onLabelClick={(e) => toggleClick(e)}
          />
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
                customDomain={config.customDomain}
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
