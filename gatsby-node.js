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
const omitEmpty = require('omit-empty')
const { t, getPath } = require('./src/common')
const context = require('./src/context')
const queries = require('./src/queries')
const types = require('./src/types')

exports.createSchemaCustomization = ({ actions: { createTypes } }) => createTypes(types)

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
    const compacted = await jsonld.compact(doc, context)
    compacted['@graph'].forEach((graph, i) => {
      const { narrower, broader, inScheme, topConceptOf, hasTopConcept, ...properties } = graph
      actions.createNode({
        ...properties,
        children: (narrower || hasTopConcept || []).map(narrower => narrower.id),
        parent: (broader && broader.id) || null,
        inScheme___NODE: (inScheme && inScheme.id) || (topConceptOf && topConceptOf.id) || null,
        topConceptOf___NODE: (topConceptOf && topConceptOf.id) || null,
        narrower___NODE: (narrower || []).map(narrower => narrower.id),
        hasTopConcept___NODE: (hasTopConcept || []).map(topConcept => topConcept.id),
        broader___NODE: (broader && broader.id) || null,
        internal: {
          contentDigest: createContentDigest(graph),
          type: properties.type,
        },
      })
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const conceptSchemes = await graphql(queries.allConceptScheme)

  conceptSchemes.errors && console.error(conceptSchemes.errors)

  conceptSchemes.data.allConceptScheme.edges.forEach(async ({ node }) => {
    const index = flexsearch.create()
    const tree = JSON.stringify(node)

    const conceptsInScheme = await graphql(queries.allConcept(node.id))
    conceptsInScheme.data.allConcept.edges.forEach(({ node }) => {
      createPage({
        path: getPath(node.id, 'html'),
        component: path.resolve(`./src/templates/Concept.js`),
        context: {
          node,
          tree,
          baseURL: process.env.BASEURL || ''
        }
      })
      createJson({
        path: getPath(node.id, 'json'),
        data: omitEmpty(Object.assign({}, node, context))
      })
      index.add(node.id, t(node.prefLabel))
    })

    console.log("Built index", index.info())

    createPage({
      path: getPath(node.id, 'html'),
      component: path.resolve(`./src/templates/ConceptScheme.js`),
      context: {
        node,
        tree,
        baseURL: process.env.BASEURL || ''
      }
    })
    createJson({
      path: getPath(node.id, 'json'),
      data: omitEmpty(Object.assign({}, node, context))
    })
    createJson({
      path: getPath(node.id, 'index'),
      data: index.export()
    })

  })
}

const createJson = ({path, data}) =>
  fs.outputFile(`public${path}`, JSON.stringify(data, null, 2), err => err && console.error(err))
