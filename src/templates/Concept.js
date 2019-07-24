/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { t } from '../common'
import NestedList from '../components/nestedList'

const Concept = ({pageContext}) => {

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
      <NestedList items={JSON.parse(pageContext.node.tree).hasTopConcept} current={pageContext.node.id} />
    </nav>
    <div className="content">
      <h1>{t(pageContext.node.prefLabel)}</h1>
      <h2>{pageContext.node.id}</h2>
      {pageContext.node.definition
        && (
          <div className="markdown">
            <h3>Definition</h3>
            <Markdown>
              {t(pageContext.node.definition)}
            </Markdown>
          </div>
        )
      }
      {pageContext.node.scopeNote
        && (
          <div className="markdown">
            <h3>Scope Note</h3>
            <Markdown>
              {t(pageContext.node.scopeNote)}
            </Markdown>
          </div>
        )
      }
    </div>
    </div>
  </div>
)}

export default Concept
