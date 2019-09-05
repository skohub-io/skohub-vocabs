import React from "react"
import { Link, graphql } from "gatsby"
import { t, getPath } from '../common'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {

  const { nodes } = data.allConcept

  return (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <ul>
      {nodes.map(node => (
        <li key={node.id}>
          <Link to={(process.env.BASEURL || '') + getPath(node.id, 'html')}>{t(node.prefLabel)}</Link>
        </li>
      ))}
    </ul>
  </Layout>
)}

export const query = graphql`
  query HomePageQuery {
    allConcept {
      nodes {
        id
        prefLabel {
          de
          en_us
        }
      }
	  }
  }
`

export default IndexPage
