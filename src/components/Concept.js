/** @jsx jsx */
import { jsx } from '@emotion/react'
import Markdown from 'markdown-to-jsx'
import { Link } from 'gatsby'
import JsonLink from './JsonLink'

import { i18n, getDomId, getFilePath } from '../common'

const Concept = ({ pageContext: { node: concept, language, collections, baseURL } }) => (
  <div className="content block" id={getDomId(concept.id)}>
    <h1>
      {concept.notation &&
        <span>{concept.notation.join(',')}&nbsp;</span>
      }
      {i18n(language)(concept.prefLabel)}
    </h1>
    <h2>{concept.id}</h2>
    <JsonLink
      to={baseURL + getFilePath(concept.id, "json")}
    />
    {concept.definition
      && (
        <div className="markdown">
          <h3>Definition</h3>
          <Markdown>
            {i18n(language)(concept.definition) || `*No definition in language "${language}" provided.*`}
          </Markdown>
        </div>
      )
    }
    {concept.scopeNote
      && (
        <div className="markdown">
          <h3>Scope Note</h3>
          <Markdown>
            {i18n(language)(concept.scopeNote)  || `*No scope note in language "${language}" provided.*`}
          </Markdown>
        </div>
      )
    }
    {concept.note
      && (
        <div className="markdown">
          <h3>Note</h3>
          <Markdown>
            {i18n(language)(concept.note)  || `*No note in language "${language}" provided.*`}
          </Markdown>
        </div>
    )}
    {concept.altLabel && i18n(language)(concept.altLabel) !== '' && (
      <div>
        <h3>Alt Label</h3>
          <ul>
          {i18n(language)(concept.altLabel).map((altLabel, i) => (
              <li key={i}>{altLabel}</li>
            ))}
          </ul>
      </div>
    )}
    {concept.example && (
        <div className="markdown">
          <h3>Example</h3>
          <Markdown>
            {i18n(language)(concept.example) || `*No example in language "${language}" provided.*`}
          </Markdown>
        </div>
      )
    }
    {concept.related && concept.related.length > 0 && (
      <div>
        <h3>Related</h3>
        <ul>
          {concept.related.map((related) => (
            <li key={related.id}>
              <Link to={getFilePath(related.id, `${language}.html`)}>
                {i18n(language)(related.prefLabel) || related.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
    {concept.narrowMatch && concept.narrowMatch.length > 0 && (
      <div>
        <h3>Narrow Match</h3>
        <ul>
          {concept.narrowMatch.map((narrowMatch) => (
            <li key={narrowMatch.id}>
              <a href={narrowMatch.id}>{narrowMatch.id}</a>
            </li>
          ))}
        </ul>
      </div>
    )}
    {concept.broadMatch && concept.broadMatch.length > 0 && (
      <div>
        <h3>Broad Match</h3>
        <ul>
          {concept.broadMatch.map((broadMatch) => (
            <li key={broadMatch.id}>
              <a href={broadMatch.id}>{broadMatch.id}</a>
            </li>
          ))}
        </ul>
      </div>
    )}
    {concept.exactMatch && concept.exactMatch.length > 0 && (
      <div>
        <h3>Exact Match</h3>
        <ul>
          {concept.exactMatch.map((exactMatch) => (
            <li key={exactMatch.id}>
              <a href={exactMatch.id}>{exactMatch.id}</a>
            </li>
          ))}
        </ul>
      </div>
    )}
    {concept.closeMatch && concept.closeMatch.length > 0 && (
      <div>
        <h3>Close Match</h3>
        <ul>
          {concept.closeMatch.map((closeMatch) => (
            <li key={closeMatch.id}>
              <a href={closeMatch.id}>{closeMatch.id}</a>
            </li>
          ))}
        </ul>
      </div>
    )}
    {concept.relatedMatch && concept.relatedMatch.length > 0 && (
      <div>
        <h3>Related Match</h3>
        <ul>
          {concept.relatedMatch.map((relatedMatch) => (
            <li key={relatedMatch.id}>
              <a href={relatedMatch.id}>{relatedMatch.id}</a>
            </li>
          ))}
        </ul>
      </div>
    )}
      {collections && collections.length > 0 && (
        <div className="collections">
            <h3>in Collections</h3>
            <ul>
                {collections.map((collection) => (
                  <li key={collection.id}>
                      <Link to={getFilePath(collection.id, `${language}.html`)}>
                          {i18n(language)(collection.prefLabel || `*No label in language ${language} provided.*`)}
                      </Link>
                  </li>
                ))}
            </ul>
        </div>
      )}
  </div>
)

export default Concept
