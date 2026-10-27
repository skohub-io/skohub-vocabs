import { Link } from "gatsby"
import { i18n, getFilePath } from "../common"
import JsonLink from "./JsonLink"
import { useSkoHubContext } from "../context/Context"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { sortConcepts } from "../sortConcepts"
import { useEffect, useState } from "react"

const Collection = ({ pageContext: { node: collection, customDomain } }) => {
  const { data } = useSkoHubContext()
  const { config } = getConfigAndConceptSchemes()
  const [language, setLanguage] = useState("")

  useEffect(() => {
    if (data.selectedLanguage !== "") {
      setLanguage(data.selectedLanguage)
    }
  }, [data?.selectedLanguage])

  const sortBy = data?.sortBy ?? config?.sortBy ?? "prefLabel"
  const sortedMembers = sortConcepts(collection.member, sortBy, language)

  return (
    <div>
      <h1>{i18n(language)(collection.prefLabel)}</h1>
      <h2>{collection.id}</h2>
      <JsonLink to={getFilePath(collection.id, "json", customDomain)} />
      <ul>
        {sortedMembers.map((member) => (
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
