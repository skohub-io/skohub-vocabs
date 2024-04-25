import React, { useEffect, useState } from "react"
import { css } from "@emotion/react"
import { Link, withPrefix } from "gatsby"
import { getFilePath } from "../common"
import { useSkoHubContext } from "../context/Context.jsx"
import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { getUserLang } from "../hooks/getUserLanguage"

const Header = ({ siteTitle }) => {
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

        button {
          background: none;
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
          color: black;
          font-weight: bold;
          display: inline-block;
          padding: 5px;
          border: 1px solid ${config.colors.skoHubLightColor};
          border-radius: 30px;
        }
      }
    }
  `
  const [languages, setLanguages] = useState([])
  const [language, setLanguage] = useState("")
  const [title, setTitle] = useState("")

  // set page language
  useEffect(() => {
    if (typeof languages !== "undefined" && languages.length) {
      if (!data.selectedLanguage) {
        const userLang = getUserLang({
          availableLanguages: languages,
        })
        setLanguage(userLang)
        // updateState({ ...data, selectedLanguage: userLang })
      } else {
        setLanguage(data.selectedLanguage)
      }
    }
  }, [data])

  // Set Languages
  useEffect(() => {
    if (!data?.currentScheme?.id) {
      setLanguages(data.languages)
    } else {
      setLanguages(conceptSchemesData[data.currentScheme.id].languages)
    }
  }, [data])

  // set title
  useEffect(() => {
    const title =
      data.currentScheme?.title?.[data.selectedLanguage] ||
      data.currentScheme?.prefLabel?.[data.selectedLanguage] ||
      data.currentScheme?.dc_title?.[data.selectedLanguage] ||
      data.currentScheme?.id
    setTitle(title)
  }, [data])

  return (
    <header css={style}>
      <div className="headerContent">
        <div className="skohubLogo">
          <Link
            to={`/`}
            onClick={() => updateState({ ...data, currentScheme: {} })}
          >
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
                  to={getFilePath(
                    data.currentScheme.id,
                    `html`,
                    config.customDomain
                  )}
                >
                  {title}
                </Link>
              </div>
            </div>
          )}
        </div>
        {languages && languages.length > 1 && (
          <ul className="language-menu">
            {languages.map((l) => (
              <li key={l}>
                {l === data.selectedLanguage ? (
                  <button className="currentLanguage">{l}</button>
                ) : (
                  <button
                    onClick={() => {
                      updateState({ ...data, selectedLanguage: l })
                      setLanguage(l)
                    }}
                  >
                    {l}
                  </button>
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
