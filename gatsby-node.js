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
const { t, getPath, getFilePath } = require('./src/common')
const context = require('./src/context')
const queries = require('./src/queries')
const types = require('./src/types')

require('dotenv').config()

const languages = new Set()
let conceptSchemes

jsonld.registerRDFParser('text/turtle', ttlString => {
  const quads = (new n3.Parser()).parse(ttlString)
  quads.forEach(quad => {
    quad.object.language && languages.add(quad.object.language.replace("-", "_"))
  })
  return quads
})

exports.sourceNodes = async ({
  getNodes, loadNodeContent, createContentDigest, actions: { createNode }
}) => {
  const nodes = await Promise.all(getNodes()
    .filter(node => node.internal.mediaType === 'text/turtle')
    .map(async node => loadNodeContent(node)))
  const followersUrlTemplate = urlTemplate.parse(process.env.FOLLOWERS)
  const inboxUrlTemplate = urlTemplate.parse(process.env.INBOX)

  const doc = await jsonld.fromRDF(nodes.join('\n'), {format: 'text/turtle'})

  const htaccess = [
    'DirectoryIndex index',
    'AddType text/index .index',
    'AddType application/json .json',
    'AddType application/ld+json .jsonld',
    'AddType application/activity+json .jsonas'
  ]
  createData({
    path: '/.htaccess',
    data: htaccess.join("\n")
  })
  const compacted = await jsonld.compact(doc, context.jsonld)
  compacted['@graph'].forEach((graph, i) => {
    const {
      narrower, narrowerTransitive, broader, broaderTransitive, inScheme, topConceptOf,
      hasTopConcept, ...properties
    } = graph
    const type = Array.isArray(properties.type)
      ? properties.type.find(t => ['Concept', 'ConceptScheme'])
      : properties.type
    const node = {
      ...properties,
      type,
      children: (narrower || hasTopConcept || []).map(narrower => narrower.id),
      parent: (broader && broader.id) || null,
      inScheme___NODE: (inScheme && inScheme.id) || (topConceptOf && topConceptOf.id) || null,
      topConceptOf___NODE: (topConceptOf && topConceptOf.id) || null,
      narrower___NODE: (narrower || []).map(narrower => narrower.id),
      narrowerTransitive___NODE: (narrowerTransitive || []).map(narrowerTransitive => narrowerTransitive.id),
      hasTopConcept___NODE: (hasTopConcept || []).map(topConcept => topConcept.id),
      broader___NODE: (broader && broader.id) || null,
      broaderTransitive___NODE: (broaderTransitive && broaderTransitive.id) || null,
      internal: {
        contentDigest: createContentDigest(graph),
        type,
      },
    }
    if (type === 'Concept') {
      Object.assign(node, {
       followers: followersUrlTemplate.expand({
         id: `${process.env.BASEURL || ''}/${getPath(node.id)}`.substr(1)
       }),
       inbox: inboxUrlTemplate.expand({
         id: `${process.env.BASEURL || ''}/${getPath(node.id)}`.substr(1)
       })
     })
    }
    ['Concept', 'ConceptScheme'].includes(type) && createNode(node)
  })

}

exports.createSchemaCustomization = ({ actions: { createTypes } }) => createTypes(types(languages))

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const actorUrlTemplate = urlTemplate.parse(process.env.ACTOR)
  conceptSchemes = await graphql(queries.allConceptScheme(languages))

  conceptSchemes.errors && console.error(conceptSchemes.errors)

  conceptSchemes.data.allConceptScheme.edges.forEach(async ({ node: conceptScheme }) => {
    const index = flexsearch.create()

    const conceptsInScheme = await graphql(queries.allConcept(conceptScheme.id, languages))
    const embeddedConcepts = []
    conceptsInScheme.data.allConcept.edges.forEach(({ node: concept }) => {
      const json = omitEmpty(Object.assign({}, concept, context.jsonld))
      const jsonld = omitEmpty(Object.assign({}, concept, context.jsonld))
      const actorPath = `${process.env.BASEURL || ''}/${getPath(concept.id)}`.substr(1)
      const actor = actorUrlTemplate.expand({ path: actorPath })
      const jsonas = Object.assign(omitEmpty({
        id: actor,
        type: 'Service',
        name: t(concept.prefLabel),
        preferredUsername: Buffer.from(actorPath).toString('hex'),
        inbox: concept.inbox,
        followers: concept.followers,
        publicKey: {
          id: `${actor}#main-key`,
          owner: actor,
          publicKeyPem: process.env.PUBLIC_KEY
        }
      }), context.as)

      if (getFilePath(concept.id) === getFilePath(conceptScheme.id)) {
        // embed concepts in concept scheme
        embeddedConcepts.push({ json, jsonld, jsonas })
      } else {
        // create pages and data
        createPage({
          path: getFilePath(concept.id, 'html'),
          component: path.resolve(`./src/components/Concept.js`),
          context: {
            node: concept,
            baseURL: process.env.BASEURL || ''
          }
        })
        createData({
          path: getFilePath(concept.id, 'json'),
          data: JSON.stringify(json, null, 2)
        })
        createData({
          path: getFilePath(concept.id, 'jsonld'),
          data: JSON.stringify(jsonld, null, 2)
        })
        createData({
          path: getFilePath(concept.id, 'jsonas'),
          data: JSON.stringify(jsonas, null, 2)
        })
      }
      index.add(concept.id, t(concept.prefLabel))
    })

    console.log("Built index", index.info())

    createPage({
      path: getFilePath(conceptScheme.id, 'html'),
      component: path.resolve(`./src/components/ConceptScheme.js`),
      context: {
        node: conceptScheme,
        embed: embeddedConcepts,
        baseURL: process.env.BASEURL || ''
      }
    })
    createData({
      path: getFilePath(conceptScheme.id, 'json'),
      data: JSON.stringify(omitEmpty(Object.assign({}, conceptScheme, context.jsonld), null, 2))
    })
    createData({
      path: getFilePath(conceptScheme.id, 'jsonld'),
      data: JSON.stringify(omitEmpty(Object.assign({}, conceptScheme, context.jsonld), null, 2))
    })
    createData({
      path: getFilePath(conceptScheme.id, 'index'),
      data: JSON.stringify(index.export(), null, 2)
    })
  })
}

const createData = ({path, data}) =>
  fs.outputFile(`public${path}`, data, err => err && console.error(err))

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions
  // Pass allConceptScheme to the pageContext of /pages/index.js
  if (page.component && page.component.endsWith('src/pages/index.js')) {
    deletePage(page)
    const { allConceptScheme } = conceptSchemes.data
    createPage({
      ...page,
      context: {
        ...page.context,
        allConceptScheme
      },
    })
  }
}
