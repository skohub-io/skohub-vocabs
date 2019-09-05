import React from "react"
import { Link, graphql } from "gatsby"
import { t, getPath } from '../common'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {

  const { edges } = data.allConceptScheme
  const conceptSchemes = edges.map(node => node.node)

  return (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <ul>
      {conceptSchemes.map(conceptScheme => (
        <li key={conceptScheme.id}>
          <Link
            to={(process.env.BASEURL || '') + getPath(conceptScheme.id, 'html')}>{conceptScheme.title
              ? t(conceptScheme.title) : conceptScheme.id}
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)}

export const query = graphql`
  query HomePageQuery {
    allConceptScheme {
      edges {
        node {
          id
          title {
            de
            en_us
            en
          }
        }
      }
    }
  }
`

export default IndexPage
