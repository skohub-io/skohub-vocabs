/** @jsx jsx */
import { jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'

import { t, getDomId, getFilePath } from '../common'

const Concept = ({ pageContext: { node: concept } }) => (
  <div className="content block" id={getDomId(concept.id)}>
    <h1>
      {concept.notation &&
        <span>{concept.notation.join(',')}&nbsp;</span>
      }
      {t(concept.prefLabel)}
    </h1>
    <h2>{concept.id}</h2>
    <a href={getFilePath(concept.id, 'json')}>JSON</a>
    <p>
      <a href={concept.inbox}>Inbox</a>
    </p>
    {concept.definition
      && (
        <div className="markdown">
          <h3>Definition</h3>
          <Markdown>
            {t(concept.definition)}
          </Markdown>
        </div>
      )
    }
    {concept.scopeNote
      && (
        <div className="markdown">
          <h3>Scope Note</h3>
          <Markdown>
            {t(concept.scopeNote)}
          </Markdown>
        </div>
      )
    }
    {concept.note
      && (
        <div className="markdown">
          <h3>Note</h3>
          <Markdown>
            {t(concept.note)}
          </Markdown>
        </div>
      )
    }
  </div>
)

export default Concept
