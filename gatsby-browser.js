/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

 import react from 'react'
 import App from './src/templates/App'

 export const wrapPageElement = ({ element, props }) => props.pageContext.node ? (
   <App {...props}>{element}</App>
 ) : element
