import Markdown from "markdown-to-jsx"

import Concept from "./Concept"
import { i18n, getDomId, getFilePath } from "../common"
import JsonLink from "./JsonLink"
import ConceptURI from "./ConceptURI"
import { getUserLang } from "../hooks/getUserLanguage"
import { useSkoHubContext } from "../context/Context"

const ConceptScheme = ({
  pageContext: { node: conceptScheme, embed, customDomain, availableLanguages },
}) => {
  const { data, _ } = useSkoHubContext()
  const language = getUserLang({availableLanguages, selectedLanguage: data?.selectedLanguage})

  return (
    <div
      className="content concept block main-block"
      id={getDomId(conceptScheme.id)}
    >
      {
        /*
        we use embed here for embedding hashURI concepts
      */
        embed &&
          embed.map((concept) => (
            <Concept
              key={concept.json.id}
              pageContext={{ node: concept.json, language }}
            />
          ))
      }
      <div>
        <h1>{i18n(language)(conceptScheme.title)}</h1>
        <ConceptURI id={conceptScheme.id} />
        <JsonLink to={getFilePath(conceptScheme.id, "json", customDomain)} />
        {conceptScheme.description && (
          <div className="markdown">
            <Markdown>{i18n(language)(conceptScheme.description)}</Markdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConceptScheme
