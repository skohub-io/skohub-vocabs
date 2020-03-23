import React from "react"
import { Link } from "gatsby"
import { t, getFilePath } from '../common'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ pageContext }) => {

  const { edges } = pageContext.allConceptScheme
  const conceptSchemes = edges.map(node => node.node)

  return (
  <Layout>
    <SEO title="Concept Schemes" keywords={['conceptSchemes']} />
    <div className="centerPage block">
    <ul>
      {conceptSchemes.map(conceptScheme => (
        <li key={conceptScheme.id}>
          <Link to={(process.env.BASEURL || '') + getFilePath(conceptScheme.id, 'html')}>
            {conceptScheme.title ? t(conceptScheme.title) : conceptScheme.id}
          </Link>
        </li>
      ))}
    </ul>
    </div>
  </Layout>
)}

export default IndexPage
