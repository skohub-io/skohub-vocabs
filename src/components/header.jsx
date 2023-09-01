import React, { useEffect, useState } from "react"
import { css } from "@emotion/react"
import { useLocation } from "@gatsbyjs/reach-router"
import { Link, withPrefix } from "gatsby"
import { getFilePath, getLinkPath, replaceFilePathInUrl } from "../common"
import { useSkoHubContext } from "../context/Context.jsx"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"

const Header = ({ siteTitle, languages, language }) => {
  const { config, conceptSchemes: conceptSchemesData } =
    getConfigAndConceptSchemes()
  const { data, updateState } = useSkoHubContext()
  const style = css`
    background: ${config.colors.skoHubWhite};

    .headerContent {
      padding: 20px 20px 0 20px;
      display: flex;
    }

    .skohubLogo {
      margin: 0;
      display: inline-block;
      width: calc(100% - 80px);

      a {
        text-decoration: none;
        color: ${config.colors.skoHubDarkColor};
      }

      .skohubImg {
        display: inline-block;
        vertical-align: middle;
        width: 30px;
        height: 30px;
      }

      .skohubTitle {
        display: inline-block;
        vertical-align: middle;
        padding: 0 0 0 15px;
        font-size: 24px;
        line-height: 24px;
        font-weight: 700;

        @media only screen and (max-width: 800px) {
          padding: 0 0 0 8px;
          font-size: 18px;
        }
      }
      .conceptSchemes {
        display: flex;
      }

      .conceptScheme {
        padding: 15px 15px 0 0;
        font-size: 24px;
      }
      .conceptScheme:not(:last-child):after {
        content: ", ";
      }
    }

    ul.language-menu {
      margin: 0;
      padding: 0;
      list-style: none;
      display: inline-block;
      width: 80px;
      text-align: right;

      li {
        margin: 0 0 0 5px;
        display: inline;

        a {
          display: inline-block;
          padding: 5px;
          color: ${config.colors.skoHubMiddleGrey};
          border: 1px solid ${config.colors.skoHubMiddleGrey};
          border-radius: 30px;

          &:hover {
            color: ${config.colors.skoHubAction};
            border: 1px solid ${config.colors.skoHubAction};
          }
        }

        .currentLanguage {
          font-weight: bold;
          display: inline-block;
          padding: 5px;
          border: 1px solid ${config.colors.skoHubLightColor};
          border-radius: 30px;
        }
      }
    }
  `

  const [langs, setLangs] = useState(new Set())
  const pathName = useLocation().pathname.slice(0, -8)

  /**
   * To display the concept scheme title in the header
   * we have to retrieve concept scheme info in this component.
   * We do this by getting the path of the component and looking up
   * its information in the JSON data
   * */
  useEffect(() => {
    fetch(pathName + ".json")
      .then((response) => response.json())
      .then(async (r) => {
        if (r.type === "ConceptScheme") {
          updateState({ ...data, currentScheme: r })
          setLangs(() => new Set(conceptSchemesData[r.id].languages))
        } else if (r.type === "Concept") {
          // FIXME how to handle inScheme as array? Currently we fetch the first scheme
          // this could also be cached in local storage but that might also be a bit overkill
          const cs = r.inScheme[0]
          Object.keys(data.currentScheme).length === 0 &&
            updateState({ ...data, currentScheme: cs })
          setLangs(() => new Set(conceptSchemesData[cs.id].languages))
        } else if (r.type === "Collection") {
          // members of a collection can either be skos:Concepts or skos:Collection
          // so we need to check each member till we find a concept
          // from which we can derive the languages of the concept scheme
          for (const member of r.member) {
            const path = replaceFilePathInUrl(pathName, member.id, "json")
            const res = await (await fetch(path)).json()
            const cs = res.inScheme[0]
            if (res.type === "Concept") {
              updateState({ ...data, currentScheme: cs })
              setLangs(() => new Set(conceptSchemesData[cs.id].languages))
              break
            }
          }
        } else {
          languages.forEach((l) => setLangs((prev) => new Set(prev.add(l))))
        }
      })
      .catch((err) => {
        /* FIXME Currently there is no general index.json
         * that we can use to retrieve languages when using header on the
         * index page so we need to set languages hard
         */
        if (typeof languages !== "undefined") {
          languages.forEach((l) => setLangs((prev) => new Set(prev.add(l))))
        }
      })
  }, [pathName, languages])

  return (
    <header css={style}>
      <div className="headerContent">
        <div className="skohubLogo">
          <Link to={`/index.${language}.html`}>
            {config.logo && (
              <img
                className="skohubImg"
                src={`${withPrefix("/img/" + config.logo)}`}
                alt="SkoHub Logo"
              />
            )}
            <span className="skohubTitle">{siteTitle}</span>
          </Link>
          {data?.currentScheme?.id && (
            <div className="conceptSchemes">
              <div
                key={data.currentScheme.id}
                className="conceptScheme"
                onClick={() => {
                  updateState({ ...data, currentScheme: data.currentScheme })
                }}
              >
                <Link
                  to={getFilePath(data.currentScheme.id, `${language}.html`)}
                >
                  {data.currentScheme?.title?.[language] ||
                    data.currentScheme.id}
                </Link>
              </div>
            </div>
          )}
        </div>
        {langs && Array.from(langs).length > 1 && (
          <ul className="language-menu">
            {Array.from(langs).map((l) => (
              <li key={l}>
                {l === language ? (
                  <span className="currentLanguage">{l}</span>
                ) : (
                  <Link to={getLinkPath(pathName, `${l}.html`)}>{l}</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}

export default Header
