import React, { useEffect, useState } from "react"
import { Link } from "gatsby"
import { i18n, getFilePath, getLanguageFromUrl } from "../common"
import { useSkoHubContext } from "../context/Context"
import { getUserLang } from "../hooks/getUserLanguage"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes.js"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ location }) => {
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
      const languages = Array.from(
        new Set([...csData.flatMap((cs) => cs.languages)])
      )
      updateState({ ...data, languages: languages, indexPage: true })
    }
    fetchConceptData()
  }, [])

  // set language stuff
  useEffect(() => {
    const languageFromUrl = getLanguageFromUrl(location)
    if (languageFromUrl && !data.selectedLanguage) {
      const userLang = getUserLang({
        availableLanguages: data.languages,
        selectedLanguage: languageFromUrl,
      })

      setLanguage(userLang)
      updateState({
        ...data,
        selectedLanguage: userLang,
        indexPage: true,
        currentScheme: {},
      })
    } else {
      const userLang = getUserLang({
        availableLanguages: data.languages,
        selectedLanguage: data?.selectedLanguage || null,
      })
      setLanguage(userLang)
      updateState({
        ...data,
        selectedLanguage: userLang,
        indexPage: true,
        currentScheme: {},
      })
    }
  }, [data?.languages, data?.selectedLanguage])

  const getTitle = (conceptScheme) => {
    const title =
      i18n(language)(
        conceptScheme?.title ||
          conceptScheme?.prefLabel ||
          conceptScheme?.dc_title
      ) || conceptScheme.id
    if (title) {
      return title
    }
    return conceptScheme.id
  }

  return (
    <Layout language={language}>
      <SEO title="Concept Schemes" keywords={["conceptSchemes"]} />
      <div className="centerPage block">
        <ul>
          {conceptSchemes.map((conceptScheme) => (
            <li key={conceptScheme.id}>
              <Link
                onClick={() =>
                  updateState({
                    ...data,
                    conceptSchemeLanguages: [...conceptScheme.languages],
                    currentScheme: conceptScheme,
                    selectedLanguage: conceptScheme.languages.includes(language)
                      ? language
                      : conceptScheme.languages[0],
                  })
                }
                to={getFilePath(conceptScheme.id, `html`, customDomain)}
              >
                {getTitle(conceptScheme)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default IndexPage
