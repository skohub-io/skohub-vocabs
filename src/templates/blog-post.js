import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import { css } from "@emotion/core"

const blogPost = ({ data }) => {

  const { hasTopConcept } = data.dataJson

  const style = css`

    h2 {
      font-size: 1.2rem;
    }

    pre {
      display: none;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    > div:target {

      pre {
        display: block;
      }
    }
  `

  return (
    <Layout>
      <div css={style}>
      {hasTopConcept.map(concept => (
        <div id={concept._id.split('#').slice(-1)} key={concept._id}>
          <a href={`#${concept._id.split('#').slice(-1)}`}>
            <h2>{concept.name.filter(name => name._language === 'en').shift()._value}</h2>
          </a>
          <pre>
            {JSON.stringify(concept, null, 2)}
          </pre>
        </div>
      ))}
      </div>
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
        name {
          _language
          _value
        }
      }
  }
}`

export default blogPost