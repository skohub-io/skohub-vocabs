/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const jsonld = require('jsonld')
const n3 = require('n3')
const { DataFactory } = n3
const { namedNode } = DataFactory
const path = require('path')
const fs = require('fs-extra')
const flexsearch = require('flexsearch')
const omitEmpty = require('omit-empty')
const urlTemplate = require('url-template')
const { i18n, getPath, getFilePath } = require('./src/common')
const context = require('./src/context')
const queries = require('./src/queries')
const types = require('./src/types')

require('dotenv').config()
require('graceful-fs').gracefulify(require('fs'))

const languages = new Set()
const inverses = {
  'http://www.w3.org/2004/02/skos/core#narrower': 'http://www.w3.org/2004/02/skos/core#broader',
  'http://www.w3.org/2004/02/skos/core#broader': 'http://www.w3.org/2004/02/skos/core#narrower',
  'http://www.w3.org/2004/02/skos/core#related': 'http://www.w3.org/2004/02/skos/core#related'
}

jsonld.registerRDFParser('text/turtle', ttlString => {
  const quads = (new n3.Parser()).parse(ttlString)
  const store = new n3.Store()
  store.addQuads(quads)
  quads.forEach(quad => {
    quad.object.language && languages.add(quad.object.language.replace("-", "_"))
    inverses[quad.predicate.id] && store.addQuad(
      quad.object,
      namedNode(inverses[quad.predicate.id]),
      quad.subject,
      quad.graph
    )
  })
  return store.getQuads()
})

const createData = ({ path, data }) =>
  fs.outputFile(`./public${path.startsWith('/') ? path : '/' + path}`, data, err => err && console.error(err))

const getTurtleFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getTurtleFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      file.endsWith(".ttl") && arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })
  return arrayOfFiles
}

exports.onPreBootstrap = async ({createContentDigest, actions}) => {
  const { createNode } = actions
  const ttlFiles = getTurtleFiles('./data', [])
  console.info(`Found these turtle files:`)
  ttlFiles.forEach(e => console.info(e))
  ttlFiles.forEach(async f => {
    const followersUrlTemplate = urlTemplate.parse(process.env.FOLLOWERS)
    const inboxUrlTemplate = urlTemplate.parse(process.env.INBOX)
    
    const ttlString = fs.readFileSync(f).toString()
    const doc = await jsonld.fromRDF(ttlString, { format: 'text/turtle' })
    const compacted = await jsonld.compact(doc, context.jsonld)
    await compacted['@graph'].forEach(graph => {
      const {
        narrower, narrowerTransitive, narrowMatch, broader, broaderTransitive,
        broadMatch, exactMatch, closeMatch, related, relatedMatch,
        inScheme, topConceptOf, hasTopConcept, prefLabel, ...properties
      } = graph
      const type = Array.isArray(properties.type)
        ? properties.type.find(t => ['Concept', 'ConceptScheme'])
        : properties.type
      const node = {
        ...properties,
        prefLabel: (prefLabel || {}),
        type,
        children: (narrower || hasTopConcept || []).map(narrower => narrower.id),
        parent: (broader && broader.id) || null,
        inScheme___NODE: (inScheme && inScheme.id) || (topConceptOf && topConceptOf.id) || null,
        topConceptOf___NODE: (topConceptOf && topConceptOf.id) || null,
        narrower___NODE: (narrower || []).map(narrower => narrower.id),
        narrowerTransitive___NODE: (narrowerTransitive || []).map(narrowerTransitive => narrowerTransitive.id),
        narrowMatch,
        hasTopConcept___NODE: (hasTopConcept || []).map(topConcept => topConcept.id),
        broader___NODE: (broader && broader.id) || null,
        broaderTransitive___NODE: (broaderTransitive && broaderTransitive.id) || null,
        broadMatch,
        exactMatch,
        closeMatch,
        related___NODE: (related || []).map(related => related.id),
        relatedMatch,
        internal: {
          contentDigest: createContentDigest(graph),
          type,
        }
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
  })
}

exports.sourceNodes = async ({ actions }) => {
  const { createTypes } = actions
  const htaccess = [
    'DirectoryIndex index',
    'AddType text/index .index',
    'AddType application/json .json',
    'AddType application/ld+json .jsonld',
    'AddType application/activity+json .jsonas'
  ]
  await createData({
    path: '/.htaccess',
    data: htaccess.join("\n")
  })
  createTypes(types(languages))
}

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const actorUrlTemplate = urlTemplate.parse(process.env.ACTOR)
  const conceptSchemes = await graphql(queries.allConceptScheme(languages))

  conceptSchemes.errors && console.error(conceptSchemes.errors)

  await Promise.all(conceptSchemes.data.allConceptScheme.edges.map(async ({ node: conceptScheme }) => {
    const indexes = Object.fromEntries([...languages].map(l => {
      const index = flexsearch.create({
        tokenize: "full",
      })
      return [l, index]
    }))

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
        name: i18n(languages[0])(concept.prefLabel || ''), // FIXME: which lang should we use?
        preferredUsername: Buffer.from(actorPath).toString('hex'),
        inbox: concept.inbox,
        followers: concept.followers,
        publicKey: {
          id: `${actor}#main-key`,
          owner: actor,
          publicKeyPem: process.env.PUBLIC_KEY
        }
      }), context.as)
      // FIXME the following prohibits other concepts to be pushed here
      // I already pulled it out the if clause
      embeddedConcepts.push({ json, jsonld, jsonas })
      if (getFilePath(concept.id) === getFilePath(conceptScheme.id)) {
        // embed concepts in concept scheme
      } else {
        // create pages and data
        languages.forEach(language => createPage({
          path: getFilePath(concept.id, `${language}.html`),
          component: path.resolve(`./src/components/Concept.js`),
          context: {
            language,
            languages: Array.from(languages),
            node: concept,
            baseURL: process.env.BASEURL || ''
          }
        }))
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
      languages.forEach(language => indexes[language].add(concept.id, i18n(language)(concept.prefLabel || '')))
    })

    languages.forEach(l => {
      console.log(`Built index for language "${l}"`, indexes[l].info())
    })

    languages.forEach(language => createPage({
      path: getFilePath(conceptScheme.id, `${language}.html`),
      component: path.resolve(`./src/components/ConceptScheme.js`),
      context: {
        language,
        languages: Array.from(languages),
        node: conceptScheme,
        embed: embeddedConcepts,
        baseURL: process.env.BASEURL || ''
      }
    }))
    createData({
      path: getFilePath(conceptScheme.id, 'json'),
      data: JSON.stringify(omitEmpty(Object.assign({}, conceptScheme, context.jsonld), null, 2))
    })
    createData({
      path: getFilePath(conceptScheme.id, 'jsonld'),
      data: JSON.stringify(omitEmpty(Object.assign({}, conceptScheme, context.jsonld), null, 2))
    })
    languages.forEach(language => createData({
      path: getFilePath(conceptScheme.id, `${language}.index`),
      data: JSON.stringify(indexes[language].export(), null, 2)
    }))
  }))

  // Build index pages
  languages.forEach(language => createPage({
    path: `/index.${language}.html`,
    component: path.resolve(`./src/components/index.js`),
    context: {
      language,
      languages: Array.from(languages),
      conceptSchemes: conceptSchemes.data.allConceptScheme.edges.map(node => node.node)
    },
  }))
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
  })
}
