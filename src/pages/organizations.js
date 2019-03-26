import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { StaticQuery, graphql } from "gatsby"

const IndexPage = () => {
  return (
    <StaticQuery
    query={graphql`
    query {
      dataJson {
        _type
        _context
        _id
        hasTopConcept {
          _id
          _type
        }
      }
    }
    `}
    render={data => {
      return (
        <Layout>
          <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
          <h2>Organizations</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Layout>
      )
    }}
  />
)}

export default IndexPage
