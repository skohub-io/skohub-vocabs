import { css } from "@emotion/react"
import PropTypes from "prop-types"
import React from "react"

import { getConfigAndConceptSchemes } from "../hooks/configAndConceptSchemes"
import { commitUrl, formatBuildTime, shortSha } from "../buildInfo"

const Footer = () => {
  const { config, buildTime } = getConfigAndConceptSchemes()
  const { repositoryUrl, gitCommit } = config

  const formattedTime = formatBuildTime(buildTime)
  const sha = shortSha(gitCommit)
  const href = commitUrl(repositoryUrl, gitCommit)

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

  // Get links from config.yaml, if available
  const links = config?.footer?.links || []

  return (
    <footer css={style}>
      <div className="footerContent">
        <ul>
          {repositoryUrl && (
            <li>
              <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </li>
          )}
          {formattedTime && (
            <li>
              Last built: {formattedTime}
              {sha && href && (
                <>
                  {" ("}
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {sha}
                  </a>
                  {")"}
                </>
              )}
              {sha && !href && ` (${sha})`}
            </li>
          )}
          {links.map((link, idx) => (
            <li key={idx} className={idx === 0 ? "push-right" : ""}>
              <a
                href={link.url}
                target={link.target || undefined}
                rel={link.rel || undefined}
              >
                {link.title}
              </a>
            </li>
          ))}
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
