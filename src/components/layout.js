/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { Global, css } from "@emotion/react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, withPrefix } from "gatsby"

import { colors as c } from "../styles/variables"

import Header from "./header"
import Footer from "./footer"

const style = css`
  height: 100vh;
  display: flex;
  flex-direction: column;

  main {
    flex: 1;
    overflow: auto;
    padding: 20px;

    @media only screen and (max-width: 1024px) {
      overflow: visible;
    }
  }

  .centerPage {
    max-width: 1200px;
    margin: 0 auto;
  }

  .forkMe {
    position: fixed;
    background-color: ${c.skoHubDarkGreen};
    color: ${c.skoHubWhite};
    padding: 0 60px;
    height: 40px;
    transform: rotate(45deg);
    font-size: 14px;
    line-height: 40px;
    font-weight: 700;
    bottom: 60px;
    left: -60px;
    box-shadow: 0 10px 20px ${c.skoHubBlackGreen};
  }
`

const Layout = ({ children, languages, language }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <div className="wrapper" css={style}>
      <Global
        styles={css`
          /* ubuntu-regular - latin */
          @font-face {
            font-family: "Ubuntu";
            font-style: normal;
            font-weight: 400;
            src: url(${withPrefix("/fonts/ubuntu-v20-latin-regular.woff2")})
                format("woff2"),
              url(${withPrefix("/fonts/ubuntu-v20-latin-regular.woff")})
                format("woff"),
              url(${withPrefix("/fonts/ubuntu-v20-latin-regular.ttf")})
                format("truetype");
          }

          /* ubuntu-700 - latin */
          @font-face {
            font-family: "Ubuntu";
            font-style: normal;
            font-weight: 700;
            src: url(${withPrefix("/fonts/ubuntu-v20-latin-700.woff2")})
                format("woff2"),
              url(${withPrefix("/fonts/ubuntu-v20-latin-700.woff")})
                format("woff"),
              url(${withPrefix("/fonts/ubuntu-v20-latin-700.ttf")})
                format("truetype");
          }

          html {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
          }

          *,
          *:before,
          *:after {
            -webkit-box-sizing: inherit;
            -moz-box-sizing: inherit;
            box-sizing: inherit;
          }

          * {
            -webkit-transition: all 0.5s ease;
            -moz-transition: all 0.5s ease;
            transition: all 0.5s ease;
          }

          html,
          body {
            height: 100%; /* needed for proper layout */
          }

          body {
            padding: 0;
            margin: 0;
            border: 0 none;
            overflow: hidden;
            background-color: ${c.skoHubWhite};
            font-family: "Ubuntu", sans-serif;
            font-weight: 400;
            word-wrap: break-word;
            font-size: 16px;
            line-height: 20px;
            color: ${c.skoHubDarkGreen};
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;

            @media only screen and (max-width: 1024px) {
              overflow: auto;
            }
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
            color: ${c.skoHubDarkGreen};

            &:hover {
              color: ${c.skoHubAction};
            }
          }

          .inputStyle {
            background-color: ${c.skoHubWhite};
            cursor: pointer;
            border: 1px solid ${c.skoHubDarkGrey};
            border-radius: 30px;
            color: ${c.skoHubDarkGreen};

            &:hover,
            &:focus {
              background-color: ${c.skoHubLightGrey};
            }

            &[type="button"] {
              background: ${c.skoHubLightGrey};
              border: 1px solid ${c.skoHubLightGrey};
              font-weight: 700;

              &:hover {
                background: ${c.skoHubMiddleGreen};
                border: 1px solid ${c.skoHubMiddleGreen};
                color: ${c.skoHubWhite};
              }
            }
          }
        `}
      />
      <Header
        siteTitle={data.site.siteMetadata.title}
        languages={languages}
        language={language}
      />
      <main>{children}</main>

      <Footer
        siteTitle={data.site.siteMetadata.title}
        languages={languages}
        language={language}
      />
    </div>
  )
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
