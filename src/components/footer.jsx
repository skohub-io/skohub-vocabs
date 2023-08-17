import { css } from "@emotion/react"
import PropTypes from "prop-types"
import React from "react"

import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"

const Footer = () => {
  const { config } = getConfigAndConceptSchemes()

  const style = css`
    background: ${config.colors.skoHubMiddleColor};
    color: ${config.colors.skoHubWhite};

    .footerContent {
      padding: 20px;
      text-align: right;

      @media only screen and (max-width: 800px) {
        text-align: center;
      }

      ul {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          display: inline-block;
          padding: 0 20px 0 0px;
          margin: 0;
        }

        .push-right {
          margin-left: auto;
        }
      }

      a {
        color: ${config.colors.skoHubWhite};
        font-weight: 700;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `
  return (
    <footer css={style}>
      <div className="footerContent">
        <ul>
          {process.env.GATSBY_RESPOSITORY_URL && (
            <li>
              <a
                href={process.env.GATSBY_RESPOSITORY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </li>
          )}
          <li className="push-right">
            <a
              href="https://www.hbz-nrw.de/impressum"
              target="_blank"
              rel="noopener noreferrer"
            >
              Impressum
            </a>
          </li>
          <li>
            &copy;{" "}
            <a
              href="https://skohub.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              SkoHub
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
