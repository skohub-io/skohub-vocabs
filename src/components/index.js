import React from "react"
import { Link } from "gatsby"
import { i18n, getFilePath } from "../common"

import Layout from "./layout"
import SEO from "./seo"

const IndexPage = ({
  pageContext: { conceptSchemes, language, languagesByCS },
}) => {
  const languages = Array.from(new Set([...Object.values(languagesByCS).flat()]))

  return (
    <Layout languages={languages} language={language}>
      <SEO title="Concept Schemes" keywords={["conceptSchemes"]} />
      <div className="centerPage block">
        <ul>
          {conceptSchemes.map((conceptScheme) => (
            <li key={conceptScheme.id}>
              <Link
                to={getFilePath(
                  conceptScheme.id,
                  `${
                    languagesByCS[conceptScheme.id].includes(language)
                      ? language
                      : languagesByCS[conceptScheme.id][0] // take first available language if the one chosen from lang tag is not available
                  }.html`
                )}
              >
                {i18n(language)(conceptScheme.title) || conceptScheme.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default IndexPage
