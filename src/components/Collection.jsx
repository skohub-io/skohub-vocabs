import { Link } from "gatsby"
import { i18n, getFilePath } from "../common"
import JsonLink from "./JsonLink"

// TODO add language stuff 
const Collection = ({
  pageContext: { node: collection, customDomain },
}, language = "de") => (
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

export default Collection
