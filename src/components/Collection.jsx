import { Link } from "gatsby"
import { i18n, getFilePath } from "../common"
import JsonLink from "./JsonLink"
import { useSkoHubContext } from "../context/Context"
import { useEffect, useState } from "react"
import { replaceFilePathInUrl } from "../common"
import { useLocation } from "@gatsbyjs/reach-router"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"

const Collection = ({ pageContext: { node: collection, customDomain } }) => {
  const { data, updateState } = useSkoHubContext()
  const [language, setLanguage] = useState("")
  const pathName = useLocation().pathname.slice(0, -5)
  const { config } = getConfigAndConceptSchemes()

  useEffect(() => {
    ;(async function () {
      for await (const member of collection.member) {
        const path = replaceFilePathInUrl(
          pathName,
          member.id,
          "json",
          config.customDomain
        )
        const res = await (await fetch(path)).json()
        const cs = res.inScheme[0]
        if (res.type === "Concept") {
          updateState({
            ...data,
            currentScheme: cs,
          })
          break
        }
      }
    })()
    if (data.selectedLanguage !== "") {
      setLanguage(data.selectedLanguage)
    }
  }, [data?.selectedLanguage])

  return (
    <div className="content block main-block">
      <h1>{i18n(language)(collection.prefLabel)}</h1>
      <h2>{collection.id}</h2>
      <JsonLink to={getFilePath(collection.id, "json", customDomain)} />
      <ul>
        {collection.member.map((member) => (
          <li key={member.id}>
            <Link to={getFilePath(member.id, `html`, customDomain)}>
              {i18n(language)(member.prefLabel) ||
                `*No label in language "${language}" provided.*`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Collection
