/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { Global, css } from '@emotion/core'
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"

import { colors as c } from '../styles/variables'

import Header from "./header"

const style = css`
  height: 100vh;
  display: flex;
  flex-direction: column;

  main {
    flex: 1;
    overflow: auto;
    padding: 20px;
  }

  .centerPage {
    max-width: 1200px;
    margin: 0 auto;
  }

  .forkMe {
    position: fixed;
    background-color: hsl(212, 28%, 9%);
    color: white;
    padding: 10px 50px;
    transform: rotate(45deg);
    top: 32px;
    font-size: 10px;
    font-weight: bold;
    border: 1px solid white;
    right: -56px;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  }
`

const Layout = ({ children, languages, language }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <div
        className="wrapper"
        css={style}
      >
        <Global
          styles={css`
            html {
              -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
              box-sizing: border-box;
            }

            *, *:before, *:after {
              -webkit-box-sizing: inherit;
              -moz-box-sizing: inherit;
              box-sizing: inherit;
            }

            html,
            body {
              height: 100%; /* needed for proper layout */
            }

            body {
              padding: 0;
              margin: 0;
              word-wrap: break-word;
              font-size: 16px;
              font-family: futura-pt, sans-serif, sans-serif;
              color: ${c.text};
              overflow: hidden;
              background-color: ${c.base};
            }

            li > ul {
              margin-left: 1.45rem;
              margin-bottom: calc(1.45rem / 2);
              margin-top: calc(1.45rem / 2);
            }

            li {
              margin-bottom: calc(1.45rem / 2);
            }

            a {
              text-decoration: none;
              color: ${c.primary};

              &:hover {
                color: ${c.accent};
              }
            }

            .inputStyle {
              background-color: ${c.inputBase};
              box-shadow: 2px 2px 0 0 ${c.primary};
              border: none;
              cursor: pointer;
              border: 1px solid ${c.primary};
              color: ${c.primary};

              &:hover,
              &:focus {
                background-color: ${c.inputAction};
              }
            }

            .block {
              background-color: ${c.blockBase};
              box-shadow: 0 2px 4px 0 hsla(198, 45%, 10%, .12);
              padding: 20px;
              border-radius: 8px;
            }
          `}
        />
        <Header
          siteTitle={data.site.siteMetadata.title}
          languages={languages}
          language={language}
        />
        <main>{children}</main>

        {process.env.GATSBY_RESPOSITORY_URL && (
          <a
            href={process.env.GATSBY_RESPOSITORY_URL}
            className="forkMe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fork this vocab on {process.env.GATSBY_RESPOSITORY_URL.includes('github') ? 'GitHub' : 'GitLab'}
          </a>
        )}

      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
