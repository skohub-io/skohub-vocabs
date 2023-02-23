import { useStaticQuery, graphql } from "gatsby"

export const getConceptSchemes = () => {
  const { allConceptScheme } = useStaticQuery(graphql`
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
  const conceptSchemes = allConceptScheme.edges
    .map(({ node }) => ({
      [node.id]: { languages: node.fields.languages },
    }))
    .reduce((prev, curr) => ({ ...prev, ...curr }), {})
  return conceptSchemes
}
