import React, { useEffect, useState } from "react"
import escapeRegExp from "lodash.escaperegexp"
import {
  i18n,
  getFilePath,
  getLanguageFromUrl,
  replaceFilePathInUrl,
} from "../common"
import NestedList from "../components/nestedList"
import TreeControls from "../components/TreeControls"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Search from "../components/Search"

import { conceptStyle } from "../styles/concepts.css.js"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { getUserLang } from "../hooks/getUserLanguage"
import { useSkoHubContext } from "../context/Context.jsx"
import { withPrefix } from "gatsby"
import { handleKeypresses, importIndex } from "./helpers"

const App = ({ pageContext, children, location }) => {
  const { data, updateState } = useSkoHubContext()
  const { config, conceptSchemes } = getConfigAndConceptSchemes()
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

  const [language, setLanguage] = useState("")
  const [currentScheme, setCurrentScheme] = useState(null)

  // get current scheme
  useEffect(() => {
    const fetchConceptSchemeForCollection = async (collection) => {
      for (const member of collection.member) {
        const path = replaceFilePathInUrl(
          location.pathname,
          member.id,
          "json",
          config.customDomain
        )
        const res = await (await fetch(path)).json()
        const cs = res.inScheme[0]
        if (res.type === "Concept") {
          return cs
        }
      }
    }

    const getCurrentScheme = async () => {
      if (pageContext.node.type === "ConceptScheme")
        setCurrentScheme(pageContext.node)
      else if (pageContext.node.type === "Concept")
        setCurrentScheme(pageContext.node.inScheme[0])
      else if (pageContext.node.type === "Collection") {
        const cs = await fetchConceptSchemeForCollection(pageContext.node)
        setCurrentScheme(cs)
      } else return {}
    }
    getCurrentScheme()
  }, [])

  // set language stuff
  useEffect(() => {
    if (currentScheme) {
      const languageFromUrl = getLanguageFromUrl(location)

      if (languageFromUrl && !data.selectedLanguage) {
        const userLang = getUserLang({
          availableLanguages: conceptSchemes[currentScheme.id].languages,
          selectedLanguage: languageFromUrl,
        })
        setLanguage(userLang)
        updateState({
          ...data,
          currentScheme,
          indexPage: false,
          selectedLanguage: userLang,
          availableLanguages: conceptSchemes[currentScheme.id].languages,
        })
      } else {
        const userLang = getUserLang({
          availableLanguages: conceptSchemes[currentScheme.id].languages,
          selectedLanguage: data?.selectedLanguage || null,
        })
        setLanguage(userLang)
        updateState({
          ...data,
          currentScheme,
          indexPage: false,
          selectedLanguage: userLang,
          availableLanguages: conceptSchemes[currentScheme.id].languages,
        })
      }
    }
  }, [data?.languages, data?.selectedLanguage, currentScheme])

  // useEffect(() => {
  //   data?.conceptSchemeLanguages && setLanguage(data.selectedLanguage)
  // }, [data?.selectedLanguage])

  // Fetch and load the serialized index
  useEffect(() => {
    importIndex(
      data?.currentScheme?.id,
      labels,
      data.selectedLanguage,
      setIndex,
      config
    )
  }, [data, language, labels])

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
  const title =
    pageContext.node?.prefLabel ||
    pageContext.node?.title ||
    pageContext.node?.dc_title

  return (
    <Layout>
      <SEO
        title={i18n(language)(title)}
        keywords={["Concept", i18n(language)(title)]}
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
                language={language}
                topLevel={true}
                customDomain={config.customDomain}
              />
            )}
          </div>
        </nav>
        <div className="content concept block main-block">{children}</div>
      </div>
    </Layout>
  )
}

export default App
