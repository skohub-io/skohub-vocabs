import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

const blogPost = ({ data }) => {

  const post = data.dataJson

  return (
    <Layout>
     <pre style={{
         whiteSpace: 'pre-wrap',
         wordWrap: 'break-word'
     }}>
       {JSON.stringify(post, null, 2)}
    </pre>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    dataJson(fields: { slug: { eq: $slug } }) {
      _id
      _context
      _type
      hasTopConcept {
        _id
        _type
      }
  }
}`

export default blogPost