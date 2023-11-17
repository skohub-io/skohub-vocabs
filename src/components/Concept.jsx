import Markdown from "markdown-to-jsx"
import { Link } from "gatsby"
import JsonLink from "./JsonLink.jsx"
import { getConceptSchemes } from "../hooks/getConceptSchemes"
import { useSkoHubContext } from "../context/Context.jsx"
import { i18n, getDomId, getFilePath } from "../common"
import ConceptURI from "./ConceptURI.jsx"
import { useEffect, useState } from "react"

const Concept = ({
  pageContext: { node: concept, collections, customDomain },
}) => {
  const conceptSchemes = getConceptSchemes()
  const { data, updateState } = useSkoHubContext()
  const [language, setLanguage] = useState("")

  useEffect(() => {
    setLanguage(data.selectedLanguage)
  }, [data?.selectedLanguage])

  useEffect(() => {
    if (!Object.keys(data.currentScheme).length) {
      updateState({
        ...data,
        currentScheme: concept.inScheme[0],
      })
    }
  }, [])

  return (
    <div className="content block main-block" id={getDomId(concept.id)}>
      <h1>
        {concept.notation && <span>{concept.notation.join(",")}&nbsp;</span>}
        {i18n(language)(concept.prefLabel)}
      </h1>
      <ConceptURI id={concept.id} />
      <JsonLink to={getFilePath(concept.id, "json", customDomain)} />
      {concept.definition && (
        <div className="markdown">
          <h3>Definition</h3>
          <Markdown>
            {i18n(language)(concept.definition) ||
              `*No definition in language "${language}" provided.*`}
          </Markdown>
        </div>
      )}
      {concept.scopeNote && (
        <div className="markdown">
          <h3>Scope Note</h3>
          <Markdown>
            {i18n(language)(concept.scopeNote) ||
              `*No scope note in language "${language}" provided.*`}
          </Markdown>
        </div>
      )}
      {concept.note && (
        <div className="markdown">
          <h3>Note</h3>
          <Markdown>
            {i18n(language)(concept.note) ||
              `*No note in language "${language}" provided.*`}
          </Markdown>
        </div>
      )}
      {concept.altLabel && i18n(language)(concept.altLabel) !== "" && (
        <div>
          <h3 id="alt-label">Alt Label</h3>
          <ul aria-labelledby="alt-label">
            {i18n(language)(concept.altLabel).map((altLabel, i) => (
              <li key={i}>{altLabel}</li>
            ))}
          </ul>
        </div>
      )}
      {concept.hiddenLabel && i18n(language)(concept.hiddenLabel) !== "" && (
        <div>
          <h3 id="hidden-label">Hidden Label</h3>
          <ul aria-labelledby="hidden-label">
            {i18n(language)(concept.hiddenLabel).map((hiddenLabel, i) => (
              <li key={i}>{hiddenLabel}</li>
            ))}
          </ul>
        </div>
      )}
      {concept.example && (
        <div className="markdown">
          <h3>Example</h3>
          <Markdown>
            {i18n(language)(concept.example) ||
              `*No example in language "${language}" provided.*`}
          </Markdown>
        </div>
      )}
      {concept.related && concept.related.length > 0 && (
        <div>
          <h3>Related</h3>
          <ul>
            {concept.related.map((related) => (
              <li key={related.id}>
                <Link
                  to={getFilePath(related.id, `${language}.html`, customDomain)}
                >
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
                <a target="_blank" rel="noreferrer" href={narrowMatch.id}>
                  {narrowMatch.id}
                </a>
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
                <a target="_blank" rel="noreferrer" href={broadMatch.id}>
                  {broadMatch.id}
                </a>
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
                <a target="_blank" rel="noreferrer" href={exactMatch.id}>
                  {exactMatch.id}
                </a>
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
                <a target="_blank" rel="noreferrer" href={closeMatch.id}>
                  {closeMatch.id}
                </a>
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
                <a target="_blank" rel="noreferrer" href={relatedMatch.id}>
                  {relatedMatch.id}
                </a>
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
                <Link to={getFilePath(collection.id, `html`, customDomain)}>
                  {i18n(language)(collection.prefLabel) ||
                    `*No label in language "${language}" provided.*`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {concept.inSchemeAll && (
        <div>
          <h3 id="in-scheme">In Scheme</h3>
          <ul aria-labelledby="in-scheme">
            {concept.inSchemeAll.map((inScheme) => (
              <li key={inScheme.id}>
                {/* 
              check if the concept scheme in that language is present
              otherwise link to first present language
              */}
                {Object.keys(conceptSchemes).includes(inScheme.id) ? (
                  <Link to={getFilePath(inScheme.id, "html", customDomain)}>
                    {inScheme.id}
                  </Link>
                ) : (
                  <a href={inScheme.id}>{inScheme.id}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Concept
