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

export const wrapPageElement = ({ element, props }) =>
  props.pageContext.node ? <App {...props}>{element}</App> : element
