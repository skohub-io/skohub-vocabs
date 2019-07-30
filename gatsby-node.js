/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const jsonld = require('jsonld')
const n3 = require('n3')
const path = require('path')
const fs = require('fs-extra')
const flexsearch = require('flexsearch')
const t = require('./src/common').t
const context = require('./src/context')
const queries = require('./src/queries')

const frame = Object.assign({'@type': 'ConceptScheme'}, context)

exports.sourceNodes = async ({ getNodes, loadNodeContent, createContentDigest, actions }) => {
  const writer = new n3.Writer({ format: 'N-Quads' })
  const parser = new n3.Parser()
  const nodes = await Promise.all(getNodes()
    .filter(node => node.internal.mediaType === 'text/turtle')
    .map(async node => loadNodeContent(node)))

  nodes.forEach(node => parser.parse(node).forEach(quad => writer.addQuad(quad)))
  writer.end(async (error, nquads) => {
    if (error) {
      console.error(error)
      return
    }
    const doc = await jsonld.fromRDF(nquads, {format: 'application/n-quads'})
    const framed = await jsonld.frame(doc, frame)
    const compacted = await jsonld.compact(doc, context)
    compacted['@graph'].forEach((graph, i) => {
      const obj = Object.assign(graph, {
        tree: JSON.stringify(framed['@graph'][0]),
        json: JSON.stringify(Object.assign({}, context, graph), null, 2)
      })
      actions.createNode({
        ...obj,
        id: obj.id,
        children: (obj.narrower || obj.hasTopConcept || []).map(narrower => narrower.id),
        parent: (obj.broader && obj.broader.id) || null,
        inScheme___NODE: (obj.inScheme && obj.inScheme.id) || null,
        narrower___NODE: (obj.narrower || []).map(narrower => narrower.id),
        hasTopConcept___NODE: (obj.hasTopConcept || []).map(topConcept => topConcept.id),
        broader___NODE: (obj.broader && obj.broader.id) || null,
        internal: {
          contentDigest: createContentDigest(obj),
          type: obj.type,
        },
      })
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(queries).then(result => {
    const index = flexsearch.create('speed')

    result.data.allConcept.edges.forEach(({ node }) => {
      createPage({
        path: getPath(node, 'html'),
        component: path.resolve(`./src/templates/Concept.js`),
        context: {
          node,
          narrower: node.narrower ? node.narrower.map(narrower => narrower.id) : [],
          baseURL: process.env.BASEURL || ''
        }
      })
      createJson({
        path: getPath(node, 'json'),
        data: node.json
      })
      index.add(node.id, t(node.prefLabel))
    })
    result.data.allConceptScheme.edges.forEach(({ node }) => {
      createPage({
        path: getPath(node, 'html'),
        component: path.resolve(`./src/templates/ConceptScheme.js`),
        context: {
          node,
          hasTopConcept: node.hasTopConcept ? node.hasTopConcept.map(topConcept => topConcept.id) : [],
          baseURL: process.env.BASEURL || ''
        }
      })
      createJson({
        path: getPath(node, 'json'),
        data: node.json
      })
      createJson({
        path: getPath(node, 'index.json'),
        data: JSON.stringify(index.export())
      })
    })
  })
}

const getPath = (node, extension) => node.id.replace("http:/", "").replace("#", "") + '.' + extension

const createJson = ({path, data}) =>
  fs.outputFile(`public${path}`, data, err => err && console.error(err))
