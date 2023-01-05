/** @jsx jsx */
import { jsx } from "@emotion/react"
import { useEffect, useState } from "react"
import { useLocation } from "@gatsbyjs/reach-router"

import FlexSearch from "flexsearch"
import escapeRegExp from "lodash.escaperegexp"
import { i18n, getFilePath, replaceFilePathInUrl } from "../common"
import NestedList from "../components/nestedList"
import TreeControls from "../components/TreeControls"
import Layout from "../components/layout"
import SEO from "../components/seo"

import { style } from "../styles/concepts.css.js"
import { withPrefix } from "gatsby"

const App = ({ pageContext, children }) => {
  const [conceptSchemeId, setConceptSchemeId] = useState(null)
  const [index, setIndex] = useState(FlexSearch.create())
  const [query, setQuery] = useState(null)
  const [tree, setTree] = useState(
    pageContext.node.type === "ConceptScheme" ? pageContext.node : null
  )
  const pathName = useLocation().pathname.slice(0, -8)
  let showTreeControls = false

  if (!showTreeControls && tree && tree.hasTopConcept) {
    for (const topConcept of tree.hasTopConcept) {
      if (topConcept.narrower?.length > 0) {
        showTreeControls = true
        break
      }
    }
  }

  // get concept scheme id
  // things would be alot easier if skos would require collections
  // to belong to a Concept Scheme. Unfortunatley this is not the case.
  useEffect(() => {
    if (pageContext.node.type === "ConceptScheme") {
      setConceptSchemeId(pageContext.node.id)
    } else if (pageContext.node.type === "Concept") {
      setConceptSchemeId(pageContext.node.inScheme.id)
    } else if (pageContext.node.type === "Collection") {
      // members of a collection can either be skos:Concepts or skos:Collection
      // so we need to check each member till we find a concept
      // from which we can derive the languages of the concept scheme
      for (const member of pageContext.node.member) {
        const path = replaceFilePathInUrl(pathName, member.id, "json")
        fetch(path)
          .then((response) => response.json())
          .then((res) => {
            if (res.type === "Concept") {
              setConceptSchemeId(res.inScheme.id)
            }
          })
      }
    }
  }, [
    pageContext.node.type,
    pageContext.node.id,
    pageContext.node.inScheme,
    pageContext.node.member,
    pathName,
  ])

  // Fetch and load the serialized index
  useEffect(() => {
    conceptSchemeId &&
      fetch(
        withPrefix(
          getFilePath(conceptSchemeId, `${pageContext.language}.index`)
        )
      )
        .then((response) => response.json())
        .then((serialized) => {
          const idx = FlexSearch.create()
          // add custom matcher to match umlaute at beginning of string
          idx.addMatcher({
            "[Ää]": "a", // replaces all 'ä' to 'a'
            "[Öö]": "o",
            "[Üü]": "u",
          })
          idx.import(serialized)
          setIndex(idx)
        })
  }, [conceptSchemeId, pageContext.language])

  // Fetch and load the tree
  useEffect(() => {
    conceptSchemeId &&
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
            type="text"
            className="inputStyle"
            onChange={(e) => setQuery(e.target.value || null)}
            placeholder="Search"
            autoFocus
          />
          {showTreeControls && <TreeControls />}
          {tree && (
            <NestedList
              items={tree.hasTopConcept}
              current={pageContext.node.id}
              filter={query ? index.search(query) : null}
              highlight={query ? RegExp(escapeRegExp(query), "gi") : null}
              language={pageContext.language}
            />
          )}
        </nav>
        {children}
      </div>
    </Layout>
  )
}

export default App
