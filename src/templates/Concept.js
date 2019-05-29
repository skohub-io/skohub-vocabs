import React from 'react'
import { graphql } from 'gatsby'

const NestedList = ({items}) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        {item.prefLabel[0].value}
        {item.narrower && <NestedList items={item.narrower} />}
      </li>
    ))}
  </ul>
)

const Concept = ({pageContext, data}) => (
  <div className="Concept">
    <h1>Concept</h1>
    <pre>
      {JSON.stringify(pageContext, null, 2)}
      {JSON.stringify(data, null, 2)}
    </pre>
    <NestedList items={JSON.parse(pageContext.node.tree).hasTopConcept} />
  </div>
)

export default Concept

export const query = graphql`
  query($narrower: [String]!) {
    narrower: allConcept(filter: {id: {in: $narrower}}) {
      edges {
        node {
          id,
          prefLabel {
            value
            language
          }
        }
      }
    }
  }
`
