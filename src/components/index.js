import React from "react"
import { Link } from "gatsby"
import { i18n, getFilePath } from '../common'

import Layout from "./layout"
import SEO from "./seo"

const IndexPage = ({ pageContext: { conceptSchemes, language, languages } }) => (
  <Layout languages={languages} language={language}>
    <SEO title="Concept Schemes" keywords={['conceptSchemes']} />
    <div className="centerPage block">
      <ul>
        {conceptSchemes.map(conceptScheme => (
          <li key={conceptScheme.id}>
            <Link to={(process.env.BASEURL || '') + getFilePath(conceptScheme.id, `${language}.html`)}>
              {conceptScheme.title ? i18n(language)(conceptScheme.title) : conceptScheme.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
)

export default IndexPage
