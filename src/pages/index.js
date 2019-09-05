import React from "react"
import { Link, graphql } from "gatsby"
import { t, getPath } from '../common'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {

  const { edges } = data.allConceptScheme
  console.log(edges)

  return (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <ul>
      {edges.map(node => (
        <li key={node.node.id}>
          <Link to={(process.env.BASEURL || '') + getPath(node.node.id, 'html')}>{t(node.node.title)}</Link>
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
          }
        }
      }
    }
  }
`

export default IndexPage
