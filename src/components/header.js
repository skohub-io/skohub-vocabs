import { Link, withPrefix } from "gatsby"
import { css } from "@emotion/react"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { useLocation } from "@gatsbyjs/reach-router"
import { getFilePath, getLinkPath, replaceFilePathInUrl } from "../common"

import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"

const Header = ({ siteTitle, languages, language }) => {
  const { config, conceptSchemes } = getConfigAndConceptSchemes()

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
      .conceptScheme {
        padding: 15px 0 0 0;
        font-size: 24px;
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

  const [conceptScheme, setConceptScheme] = useState({})
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
          setConceptScheme((prev) => ({ ...prev, ...r }))
          setLangs(() => new Set(conceptSchemes[r.id].languages))
        } else if (r.type === "Concept") {
          // FIXME how to handle inScheme as array?
          const cs = r.inScheme[0]
          setConceptScheme((prev) => ({ ...prev, ...cs }))
          setLangs(() => new Set(conceptSchemes[cs.id].languages))
        } else if (r.type === "Collection") {
          // members of a collection can either be skos:Concepts or skos:Collection
          // so we need to check each member till we find a concept
          // from which we can derive the languages of the concept scheme
          for (const member of r.member) {
            const path = replaceFilePathInUrl(pathName, member.id, "json")
            const res = await (await fetch(path)).json()
            const cs = res.inScheme[0]
            if (res.type === "Concept") {
              setConceptScheme((prev) => ({ ...prev, ...cs }))
              setLangs(() => new Set(conceptSchemes[cs.id].languages))
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
        languages.forEach((l) => setLangs((prev) => new Set(prev.add(l))))
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
                src={`${withPrefix("/images/" + config.logo)}`}
                alt="SkoHub Logo"
              />
            )}
            <span className="skohubTitle">{siteTitle}</span>
          </Link>
          {conceptScheme && conceptScheme.id && (
            <div className="conceptScheme">
              <Link to={getFilePath(conceptScheme.id, `${language}.html`)}>
                {conceptScheme?.title?.[language] || conceptScheme.id}
              </Link>
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

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
