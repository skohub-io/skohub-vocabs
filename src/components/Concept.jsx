import Markdown from "markdown-to-jsx"
import { Link } from "gatsby"
import JsonLink from "./JsonLink.jsx"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes.js"
import { useSkoHubContext } from "../context/Context.jsx"
import { i18n, getDomId, getFilePath } from "../common"
import ConceptURI from "./ConceptURI.jsx"
import { useEffect, useState } from "react"

const Concept = ({
  pageContext: { node: concept, collections, customDomain },
}) => {
  const { config, conceptSchemes } = getConfigAndConceptSchemes()
  const { data } = useSkoHubContext()
  const [language, setLanguage] = useState("")
  const definition =
    concept?.definition || concept?.description || concept?.dcdescription
  const title = concept?.prefLabel || concept?.title || concept?.dctitle

  useEffect(() => {
    setLanguage(data.selectedLanguage)
  }, [data?.selectedLanguage])

  return (
    <div id={getDomId(concept.id)}>
      <h1 style={{ color: config.colors.skoHubAction }}>
        {concept.deprecated ? "Deprecated" : ""}
      </h1>
      <h1>
        {concept.notation && <span>{concept.notation.join(",")}&nbsp;</span>}
        {title && i18n(language)(title)}
      </h1>
      <ConceptURI id={concept.id} />
      <JsonLink to={getFilePath(concept.id, "json", customDomain)} />
      {concept.isReplacedBy && concept.isReplacedBy.length > 0 && (
        <div>
          <h3>Is replaced by</h3>
          <ul>
            {concept.isReplacedBy.map((isReplacedBy) => (
              <li key={isReplacedBy.id}>
                <Link to={getFilePath(isReplacedBy.id, `html`, customDomain)}>
                  {isReplacedBy.id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {definition && (
        <div className="markdown">
          <h3>Definition</h3>
          <Markdown>
            {i18n(language)(definition) ||
              `*No definition in language "${language}" provided.*`}
          </Markdown>
        </div>
      )}
      {concept.note && i18n(language)(concept.note) !== "" && (
        <div className="markdown">
          <h3 id="note">Note</h3>
          <ul aria-labelledby="note">
            {i18n(language)(concept.note).map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
      {concept.changeNote && i18n(language)(concept.changeNote) !== "" && (
        <div className="markdown">
          <h3 id="changenote">ChangeNote</h3>
          <ul aria-labelledby="changenote">
            {i18n(language)(concept.changeNote).map((changeNote, i) => (
              <li key={i}>{changeNote}</li>
            ))}
          </ul>
        </div>
      )}
      {concept.editorialNote &&
        i18n(language)(concept.editorialNote) !== "" && (
          <div className="markdown">
            <h3 id="editorialnote">EditorialNote</h3>
            <ul aria-labelledby="editorialnote">
              {i18n(language)(concept.editorialNote).map((editorialNote, i) => (
                <li key={i}>{editorialNote}</li>
              ))}
            </ul>
          </div>
        )}
      {concept.historyNote && i18n(language)(concept.historyNote) !== "" && (
        <div className="markdown">
          <h3 id="historynote">HistoryNote</h3>
          <ul aria-labelledby="historynote">
            {i18n(language)(concept.historyNote).map((historyNote, i) => (
              <li key={i}>{historyNote}</li>
            ))}
          </ul>
        </div>
      )}
      {concept.scopeNote && i18n(language)(concept.scopeNote) !== "" && (
        <div className="markdown">
          <h3 id="scopenote">ScopeNote</h3>
          <ul aria-labelledby="scopenote">
            {i18n(language)(concept.scopeNote).map((scopeNote, i) => (
              <li key={i}>{scopeNote}</li>
            ))}
          </ul>
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
                <Link to={getFilePath(related.id, `html`, customDomain)}>
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
