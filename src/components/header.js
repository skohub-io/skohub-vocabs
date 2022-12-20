import { Link } from "gatsby"
import { css } from "@emotion/react"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { useLocation } from "@gatsbyjs/reach-router"
import { getFilePath, replaceFilePathInUrl } from "../common"

import { colors as c } from "../styles/variables"
import skohubsvg from "../images/skohub-signet-color.svg"

const style = css`
  background: ${c.skoHubWhite};

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
      color: ${c.skoHubDarkGreen};
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
        color: ${c.skoHubMiddleGrey};
        border: 1px solid ${c.skoHubMiddleGrey};
        border-radius: 30px;

        &:hover {
          color: ${c.skoHubAction};
          border: 1px solid ${c.skoHubAction};
        }
      }

      .currentLanguage {
        font-weight: bold;
        display: inline-block;
        padding: 5px;
        border: 1px solid ${c.skoHubLightGreen};
        border-radius: 30px;
      }
    }
  }
`

const Header = ({ siteTitle, languages, language }) => {
  const [conceptScheme, setConceptScheme] = useState({})
  const [langs, setLangs] = useState(new Set())
  const pathName = useLocation().pathname.slice(0, -8)

  // to display the concept scheme title in the header
  // we have to retrieve concept scheme info in this component
  useEffect(() => {
    function parseLanguages(arrayOfObj) {
      for (let obj of arrayOfObj) {
        for (let k of Object.keys(obj)) {
          if (k === "hasTopConcept" || k === "narrower") {
            // Concept Schemes
            obj?.title &&
              Object.keys(obj.title).forEach((t) =>
                setLangs((prev) => new Set(prev.add(t)))
              )
            // Concepts
            obj?.prefLabel &&
              Object.keys(obj.prefLabel).forEach((t) =>
                setLangs((prev) => new Set(prev.add(t)))
              )
            obj?.altLabel &&
              Object.keys(obj.altLabel).forEach((t) =>
                setLangs((prev) => new Set(prev.add(t)))
              )
            obj?.hiddenLabel &&
              Object.keys(obj.hiddenLabel).forEach((t) =>
                setLangs((prev) => new Set(prev.add(t)))
              )

            obj?.hasTopConcept && parseLanguages(obj?.hasTopConcept)
            obj?.narrower && parseLanguages(obj?.narrower)
          }
        }
      }
    }

    fetch(pathName + ".json")
      .then((response) => response.json())
      .then((r) => {
        if (r.type === "ConceptScheme") {
          setConceptScheme((prev) => ({ ...prev, ...r }))
          parseLanguages([r])
        } else if (r.type === "Concept") {
          const cs = r.inScheme
          setConceptScheme((prev) => ({ ...prev, ...cs }))
          const path = replaceFilePathInUrl(pathName, cs.id, "json")
          fetch(path)
            .then((response) => response.json())
            .then((res) => {
              parseLanguages([res])
            })
        } else if (r.type === "Collection") {
          // members of a collection can either be skos:Concepts or skos:Collection
          // so we need to check each member till we find a concept
          // from which we can derive the languages of the concept scheme
          for (const member of r.member) {
            const path = replaceFilePathInUrl(pathName, member.id, "json")
            fetch(path)
              .then((response) => response.json())
              .then((res) => {
                if (res.type === "Concept") {
                  console.log("found concept")
                  const cs = res.inScheme
                  setConceptScheme((prev) => ({ ...prev, ...cs }))
                  const path = replaceFilePathInUrl(pathName, cs.id, "json")
                  fetch(path)
                    .then((response) => response.json())
                    .then((res) => {
                      parseLanguages([res])
                    })
                }
              })
          }
        } else {
          languages.forEach((l) => setLangs((prev) => new Set(prev.add(l))))
        }
      })
  }, [pathName, languages])

  return (
    <header css={style}>
      <div className="headerContent">
        <div className="skohubLogo">
          <Link to={`/index.${language}.html`}>
            <img className="skohubImg" src={skohubsvg} alt="SkoHub" />
            <span className="skohubTitle">{siteTitle}</span>
          </Link>
          {conceptScheme && conceptScheme.id && (
            <div className="conceptScheme">
              <Link to={getFilePath(conceptScheme.id, `${language}.html`)}>
                {conceptScheme?.title?.language || conceptScheme.id}
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
                  <a href={`${pathName}.${l}.html`}>{l}</a>
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
