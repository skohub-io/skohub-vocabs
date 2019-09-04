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
const urlTemplate = require('url-template')
const { t, getPath, getHeaders } = require('./src/common')
const context = require('./src/context')
const queries = require('./src/queries')
const types = require('./src/types')

require('dotenv').config()

const languages = new Set()

exports.sourceNodes = async ({
  getNodes, loadNodeContent, createContentDigest, actions: { createNode }
}) => {
  const writer = new n3.Writer({ format: 'N-Quads' })
  const parser = new n3.Parser()
  const nodes = await Promise.all(getNodes()
    .filter(node => node.internal.mediaType === 'text/turtle')
    .map(async node => loadNodeContent(node)))
  const hubUrlTemplate = urlTemplate.parse(process.env.HUB)
  const inboxUrlTemplate = urlTemplate.parse(process.env.INBOX)

  nodes.forEach(node => parser.parse(node).forEach(quad => {
    writer.addQuad(quad)
    quad.object.language && languages.add(quad.object.language)
  }))

  writer.end(async (error, nquads) => {
    if (error) {
      console.error(error)
      return
    }
    const doc = await jsonld.fromRDF(nquads, {format: 'application/n-quads'})
    const compacted = await jsonld.compact(doc, context)
    compacted['@graph'].forEach((graph, i) => {
      const { narrower, broader, inScheme, topConceptOf, hasTopConcept, ...properties } = graph
      const node = {
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
      }
      node.type === 'Concept' && Object.assign(node, {
        hub: hubUrlTemplate.expand(node),
        inbox: inboxUrlTemplate.expand(node)
      })
      createNode(node)
    })
  })
}

exports.createSchemaCustomization = ({ actions: { createTypes } }) => createTypes(types(languages))

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const conceptSchemes = await graphql(queries.allConceptScheme(languages))

  conceptSchemes.errors && console.error(conceptSchemes.errors)

  conceptSchemes.data.allConceptScheme.edges.forEach(async ({ node }) => {
    const index = flexsearch.create()
    const tree = JSON.stringify(node)
    const htaccess = [
      'AddType text/index .index',
      'AddType application/ld+json .json'
    ]

    const conceptsInScheme = await graphql(queries.allConcept(node.id, languages))
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
      createData({
        path: getPath(node.id, 'json'),
        data: JSON.stringify(omitEmpty(Object.assign({}, node, context), null, 2))
      })
      htaccess.push(getHeaders(unescape(node.inbox), unescape(node.hub), unescape(node.id), getPath(node.id)))
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
    createData({
      path: getPath(node.id, 'json'),
      data: JSON.stringify(omitEmpty(Object.assign({}, node, context), null, 2))
    })
    createData({
      path: getPath(node.id, 'index'),
      data: JSON.stringify(index.export(), null, 2)
    })
    createData({
      path: '/.htaccess',
      data: htaccess.join("\n")
    })
  })
}

const createData = ({path, data}) =>
  fs.outputFile(`public${path}`, data, err => err && console.error(err))
