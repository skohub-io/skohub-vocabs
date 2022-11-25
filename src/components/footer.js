import { Link } from "gatsby"
import { css } from '@emotion/react'
import PropTypes from "prop-types"
import React from "react"
import { useLocation } from "@gatsbyjs/reach-router"

import { colors as c } from '../styles/variables'

const style = css`
  background: ${c.skoHubMiddleGreen};
  color: ${c.skoHubWhite};

  .footerContent {
    padding: 20px;
    text-align: right;
    
    @media only screen and (max-width: 800px) {
      text-align: center;
    }
    
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      
      li {
          display: inline-block;
          padding: 0 20px 0 0;
          margin: 0;
      }        
    }
    
    a {
      color: ${c.skoHubWhite};
      font-weight: 700;
        
      &:hover {
        text-decoration: underline;
      }
    }
  }
`
const Footer = ({ siteTitle, languages, language, pathName = useLocation().pathname.slice(0, -8) }) => (
  <footer
    css={style}
  >
    <div className="footerContent">
        <ul>
            <li><a href="https://www.hbz-nrw.de/impressum" target="_blank">Impressum</a></li>
            <li>&copy; <a href="https://skohub.io" target="_blank">SkoHub</a></li>
        </ul>
    </div>
  </footer>
)

Footer.propTypes = {
  siteTitle: PropTypes.string,
}

Footer.defaultProps = {
  siteTitle: ``,
}

export default Footer
