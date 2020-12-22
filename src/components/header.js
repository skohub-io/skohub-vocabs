import { Link } from "gatsby"
import { css } from '@emotion/core'
import PropTypes from "prop-types"
import React from "react"
import { useLocation } from '@reach/router'

import { colors as c } from '../styles/variables'

const style = css`
  background: #11998e;
  background: linear-gradient(to right, #27CA84, #11998e);

  h1 {
    margin: 0;
    display: inline;

    a {
      text-decoration: none;
      color: white;
    }
  }

  ul, li {
    display: inline;
    margin-right: 5px;
  }

  .wave {
    overflow: hidden;
    position: relative;
    height: 50px;
  }

  .headerContent {
    padding: 20px 20px 5px 20px;
  }

  .currentLanguage {
    font-weight: bold;
  }

  svg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 49px;
    fill: ${c.base};
  }
`
const Header = ({ siteTitle, languages, language, pathName = useLocation().pathname.slice(0, -8) }) => (
  <header
    css={style}
  >
    <div className="headerContent">
      <h1>
        <Link to={`/index.${language}.html`} >
          {siteTitle}
        </Link>
      </h1>
      {languages && languages.length > 1 && (
        <ul>
          {languages.map(l => (
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

    <div className="wave">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 279.24"
        preserveAspectRatio="none">
          <path
            d="M1000 0S331.54-4.18 0 279.24h1000z"
            opacity=".25"
          />
          <path
            d="M1000 279.24s-339.56-44.3-522.95-109.6S132.86 23.76 0 25.15v254.09z"
          />
        </svg>
    </div>

  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
