import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { i18n, getFilePath } from "../common"
import { useSkoHubContext } from "../context/Context"
import { getUserLang } from "../hooks/getUserLanguage"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes.js"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  const [conceptSchemes, setConceptSchemes] = useState([])
  const [language, setLanguage] = useState("")
  const { data, updateState } = useSkoHubContext()
  const { config } = getConfigAndConceptSchemes()
  const customDomain = config.customDomain

  useEffect(() => {
    async function fetchConceptData() {
      const res = await fetch("index.json")
      const csData = await res.json()
      setConceptSchemes(csData)
      const languages = Array.from(new Set([...csData.flatMap(cs => cs.languages)]))
      updateState({ ...data, languages: languages })
    }
    fetchConceptData()
  }, [])

  // set language stuff
  useEffect(() => {
    if (data?.languages) setLanguage(getUserLang({ availableLanguages: data.languages, selectedLanguage: data.selectedLanguage ?? null }))
  }, [data?.selectedLanguage])

  return (
    <Layout language={language}>
      <SEO title="Concept Schemes" keywords={["conceptSchemes"]} />
      <div className="centerPage block">
        <ul>
          {conceptSchemes.map((conceptScheme) => (
            <li key={conceptScheme.id}>
              <Link
                to={getFilePath(
                  conceptScheme.id,
                  `html`,
                  customDomain
                )}
              >
                {conceptScheme.title && i18n(language)(conceptScheme.title) || conceptScheme.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default IndexPage
