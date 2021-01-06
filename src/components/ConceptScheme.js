/** @jsx jsx */
import { jsx } from '@emotion/core'
import Markdown from 'markdown-to-jsx'
import jsonpng from "../images/jsonld.png"

import Concept from './Concept'
import { t, getDomId, getFilePath } from '../common'

const ConceptScheme = ({ pageContext: { node: conceptScheme, embed } }) => (
  <div className="content concept block" id={getDomId(conceptScheme.id)}>
    {embed &&
      embed.map((concept) => (
        <Concept key={concept.json.id} pageContext={{ node: concept.json }} />
      ))}
    <div>
      <h1>{t(conceptScheme.title)}</h1>
      <h2>{conceptScheme.id}</h2>
      <a href={getFilePath(conceptScheme.id, "json")}>
        <img src={jsonpng} alt="JSON"></img>
      </a>
      {conceptScheme.description && (
        <div className="markdown">
          <Markdown>{t(conceptScheme.description)}</Markdown>
        </div>
      )}
    </div>
  </div>
)

export default ConceptScheme
