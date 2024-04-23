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

  // got some hash uri to show
  if (pathname.hash) {
    const filtered = embed.filter((c) => c.json.id.endsWith(pathname.hash))
    return (
      <div id={getDomId(conceptScheme.id)}>
        <Concept pageContext={{ node: filtered[0].json, language }} />
      </div>
    )
  } else {
    return (
      <div id={getDomId(conceptScheme.id)}>
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
}

export default ConceptScheme
