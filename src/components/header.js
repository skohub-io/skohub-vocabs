import { Link } from "gatsby"
import { css } from "@emotion/react"
import PropTypes from "prop-types"
import React from "react"
import { useLocation } from "@gatsbyjs/reach-router"

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
const Header = ({
  siteTitle,
  languages,
  language,
  pathName = useLocation().pathname.slice(0, -8),
}) => (
  <header css={style}>
    <div className="headerContent">
      <div className="skohubLogo">
        <Link to={`/index.${language}.html`}>
          <img className="skohubImg" src={skohubsvg} alt="SkoHub" />
          <span className="skohubTitle">{siteTitle}</span>
        </Link>
      </div>
      {languages && languages.length > 1 && (
        <ul className="language-menu">
          {languages.map((l) => (
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

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
