import React from 'react'
import { css, jsx } from '@emotion/core'
import NestedList from '../components/nestedList'

const ConceptScheme = ({pageContext}) => {

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
      <NestedList items={JSON.parse(pageContext.node.tree).hasTopConcept} />
    </nav>
    <div className="content">
      <h1>{pageContext.node.title}</h1>
      <span>{pageContext.node.id}</span>
    </div>
    </div>
  </div>
)}

export default ConceptScheme
