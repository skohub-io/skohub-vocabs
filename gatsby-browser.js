/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import React from "react"
import App from "./src/templates/App"
import { ContextProvider } from "./src/context/Context"

export const wrapRootElement = ({ element }) => (
  <ContextProvider>{element}</ContextProvider>
)

// if the pageContext contains node data, e.g. it's a concept scheme,
// concept or collection it gets wrapped in the App component
// otherwise the present page is delivered (in our case the index page)
export const wrapPageElement = ({ element, props }) => {
  return props.pageContext.node ? <App {...props}>{element}</App> : element
}
