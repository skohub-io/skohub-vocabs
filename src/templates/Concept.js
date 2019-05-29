/** @jsx jsx */
import { graphql } from 'gatsby'
import { css, jsx } from '@emotion/core'
import { useEffect } from 'react'

const NestedList = ({items, current}) => (
  <ul>
    {items.map(item => (
      <li key={item.id}>
        <a
          className={item.id === current ? 'current' : ''}
          href={`${item.id.replace('http:/', '').replace('#', '')}.html`}
        >
          {item.prefLabel[0].value}
        </a>
        {item.narrower && <NestedList items={item.narrower} current={current} />}
      </li>
    ))}
  </ul>
)

const Concept = ({pageContext, data}) => {

  useEffect(() => {
    document.querySelector(".current")
      .scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  })

  return (
  <div className="Concept">

    <div className="layout"
     css={css`
      display: flex;
      max-height: 100vh;
      padding: 20px;

      a.current {
        color: tomato;
        font-weight: bold;
      }

      nav {
        overflow: auto;
        border-right: 1px solid black;
      }

      .content {
        padding: 0 20px;
      }

    `}>
    <nav>
      <NestedList items={JSON.parse(pageContext.node.tree).hasTopConcept} current={pageContext.node.id} />
    </nav>
    <div className="content">
      <h1>{pageContext.node.prefLabel[0].value}</h1>
      <span>{pageContext.node.id}</span>
    </div>
    </div>
  </div>
)}

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
