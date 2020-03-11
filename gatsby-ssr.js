/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const react = require('react')
const App = require('./src/templates/App').default

exports.wrapPageElement = ({ element, props }) => (
 <App {...props}>{element}</App>
)
