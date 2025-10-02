import Markdown from "markdown-to-jsx"
import Concept from "./Concept"
import { i18n, getDomId, getFilePath } from "../common"
import JsonLink from "./JsonLink"
import ConceptURI from "./ConceptURI"
import { useSkoHubContext } from "../context/Context"
import { useEffect, useState } from "react"
import { useLocation } from "@gatsbyjs/reach-router"

const ConceptScheme = ({
  pageContext: { node: conceptScheme, embed, customDomain },
}) => {
  const { data } = useSkoHubContext()
  const [language, setLanguage] = useState("")
  useEffect(() => {
    setLanguage(data.selectedLanguage)
  }, [data?.selectedLanguage])

  const pathname = useLocation()
  const description =
    conceptScheme?.description || conceptScheme?.dc_description
  const title =
    conceptScheme?.title || conceptScheme?.dc_title || conceptScheme?.prefLabel
  // got some hash uri to show
  if (pathname.hash) {
    const filtered = embed.find((c) => c.json.id.endsWith(pathname.hash))
    return (
      <div id={getDomId(conceptScheme.id)}>
        <Concept pageContext={{ node: filtered.json, language }} />
      </div>
    )
  } else {
    return (
      <div id={getDomId(conceptScheme.id)}>
        <div>
          <h1>{title && i18n(language)(title)}</h1>
          <ConceptURI id={conceptScheme.id} />
          <JsonLink to={getFilePath(conceptScheme.id, "json", customDomain)} />
          {description && (
            <div className="markdown">
              <Markdown>{i18n(language)(description)}</Markdown>
            </div>
          )}
          {conceptScheme.publisher && (
            <div>
              <h3>Publisher</h3>
              <a href={conceptScheme.publisher.id}>
                {conceptScheme.publisher.id}
              </a>
            </div>
          )}
          {conceptScheme.issued && (
            <div>
              <h3>Issued</h3>
              <p>{conceptScheme.issued}</p>
            </div>
          )}
          {conceptScheme.license && (
            <div>
              <h3>License</h3>
              <a href={conceptScheme.license.id}>{conceptScheme.license.id}</a>
            </div>
          )}
          {conceptScheme.preferredNamespaceUri && (
            <div>
              <h3>Preferred Namespace URI</h3>
              <p>{conceptScheme.preferredNamespaceUri}</p>
            </div>
          )}
          {conceptScheme.preferredNamespacePrefix && (
            <div>
              <h3>Preferred Namespace Prefix</h3>
              <p>{conceptScheme.preferredNamespacePrefix}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default ConceptScheme
