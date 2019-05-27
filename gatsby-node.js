/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const jsonld = require('jsonld')
const n3 = require('n3')
const path = require(`path`)

const parser = new n3.Parser()
const writer = new n3.Writer({ format: 'N-Quads' })

const frame = {
  "@context": {
    "id": "@id",
    "type": "@type",
    "language": "@language",
    "value": "@value",
    "@vocab": "http://www.w3.org/2004/02/skos/core#",
    "name": {
      "@id": "http://www.w3.org/2004/02/skos/core#prefLabel",
      "@container": "@set"
    }
  }
}

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    """
    Concept Node
    """
    type Concept implements Node @infer {
      name: [Name!]!
    }

    """
    ConceptScheme Node
    """
    type ConceptScheme implements Node @infer {
      name: [Name!]!
    }

    """
    Multilingual Name
    """
    type Name @infer {
      language: String!
      value: String!
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = async ({ node, loadNodeContent, actions, createContentDigest}, pluginOptions) => {

  const { createNode, createParentChildLink } = actions

  if (node.internal.mediaType === 'text/turtle') {
    const content = await loadNodeContent(node)

    parser.parse(content, (error, quad, prefixes) => {
      if (quad) {
        writer.addQuad(quad)
      } else if (prefixes) {
        writer.end((error, nquads) => {
          if (!error) {
            jsonld.fromRDF(nquads, {format: 'application/n-quads'}, (err, doc) => {
              if (err) throw err;
              jsonld.compact(doc, frame, (err, framed) => {
                if (err) throw err;

                const parsedContent = framed['@graph']

                parsedContent.forEach((obj, i) => {
                  transformObject(
                    obj,
                    obj.id,
                    obj.type
                  )
                })
              })
            })
          } else {
            console.error(error)
          }
        })
      } else if (error) {
        console.error(error)
      }
    })
  }

  function transformObject(obj, id, type) {

    const ttlNode = {
      ...obj,
      id,
      children: [],
      parent: node.id,
      internal: {
        contentDigest: createContentDigest(obj),
        type,
      },
    }
    createNode(ttlNode)
    createParentChildLink({ parent: node, child: ttlNode })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(`
    {
	  allConcept {
    edges {
      node {
        id
      }
    }
  }
}
`).then(result => {
  result.data.allConcept.edges.forEach(({ node }) => {
    createPage({
      path: node.id.replace("http:/", "").replace("#", ""),
      component: path.resolve(`./src/templates/concept.js`),
      context: {
      },
    })
  })
})}