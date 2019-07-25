import React from 'react'
import { css, jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'
import { t } from '../common'
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
        flex: 1;
        border-right: 1px solid black;
      }

      .content {
        padding: 0 20px;
        flex: 2;
      }

      .markdown {
        padding-top: 10px;
      }

    `}>
    <nav>
      <NestedList
        items={JSON.parse(pageContext.node.tree).hasTopConcept}
        baseURL={pageContext.baseURL}
      />
    </nav>
    <div className="content">
      <h1>{pageContext.node.title[Object.keys(pageContext.node.title)[0]]}</h1>
      <h2>{pageContext.node.id}</h2>
      {pageContext.node.description
        && (
          <div className="markdown">
            <Markdown>
              {t(pageContext.node.description)}
            </Markdown>
          </div>
        )
      }
    </div>
    </div>
  </div>
)}

export default ConceptScheme
