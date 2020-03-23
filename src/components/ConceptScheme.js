/** @jsx jsx */
import { jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'

import Concept from './Concept'
import { t, getDomId } from '../common'

const ConceptScheme = ({ pageContext: { node: conceptScheme, embed } }) => (
  <div className="content block" id={getDomId(conceptScheme.id)}>
    <h1>{t(conceptScheme.title)}</h1>
    <h2>{conceptScheme.id}</h2>
    {conceptScheme.description
      && (
        <div className="markdown">
          <Markdown>
            {t(conceptScheme.description)}
          </Markdown>
        </div>
      )
    }
    {embed && (
      <div className="embedded">
        {embed.map(concept => (
          <Concept key={concept.json.id} pageContext={{ node: concept.json }} />
        ))}
      </div>
    )}
  </div>
)

export default ConceptScheme
