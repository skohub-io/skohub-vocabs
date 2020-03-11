/** @jsx jsx */
import { jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'

import { t, getPath } from '../common'

const ConceptScheme = ({ pageContext: { node: conceptScheme } }) => (
  <div className="content block">
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
  </div>
)

export default ConceptScheme
