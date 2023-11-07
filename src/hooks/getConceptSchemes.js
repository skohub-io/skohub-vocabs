import { useStaticQuery, graphql } from "gatsby"
/**
 * @typedef {Object} ConceptSchemes
 * @property {object} nodeId - An object with the languages field as the value.
 * @property {string[]} nodeId.languages - An array of strings representing the languages associated with the node.
 */

/**
 * Maps over an array of edges and returns an object with the id of each node as the key and an object with the languages field as the value.
 * @returns {ConceptSchemes} An object with the id of each node as the key and an object with the languages field as the value.
 */
export const getConceptSchemes = () => {
  const { allConceptScheme } = useStaticQuery(graphql`
    query ConceptSchemes {
      allConceptScheme {
        edges {
          node {
            id
            fields {
              languages
            }
          }
        }
      }
    }
  `)

  /** @type {ConceptSchemes} */
  const conceptSchemes = allConceptScheme.edges
    .map(({ node }) => ({
      [node.id]: { languages: node.fields.languages },
    }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})
  return conceptSchemes
}
