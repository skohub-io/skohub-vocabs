import { useStaticQuery, graphql } from "gatsby"

/**
 * @returns {{
 *   config: {
 *     colors: {
 *       skoHubWhite: string,
 *       skoHubDarkColor: string,
 *       skoHubMiddleColor: string,
 *       skoHubLightColor: string,
 *       skoHubThinColor: string,
 *       skoHubBlackColor: string,
 *       skoHubAction: string,
 *       skoHubNotice: string,
 *       skoHubDarkGrey: string,
 *       skoHubMiddleGrey: string,
 *       skoHubLightGrey: string
 *     },
 *     logo: string,
 *     title: string,
 *     fonts: {
 *       bold: {
 *         font_family: string,
 *         font_style: string,
 *         font_weight: string,
 *         name: string
 *       },
 *       regular: {
 *         font_family: string,
 *         font_style: string,
 *         font_weight: string,
 *         name: string
 *       }
 *     },
 *     searchableAttributes: string[],
 *     customDomain: string,
 *     failOnValidation: boolean
 *   },
 *   conceptSchemes: Object<string, { languages: string[] }>
 * }} An object containing `config` and `conceptSchemes`
 *
 */
export const getConfigAndConceptSchemes = () => {
  const { site, allConceptScheme } = useStaticQuery(graphql`
    query Colors {
      site {
        siteMetadata {
          colors {
            skoHubWhite
            skoHubDarkColor
            skoHubMiddleColor
            skoHubLightColor
            skoHubThinColor
            skoHubBlackColor
            skoHubAction
            skoHubNotice
            skoHubDarkGrey
            skoHubMiddleGrey
            skoHubLightGrey
          }
          logo
          title
          fonts {
            bold {
              font_family
              font_style
              font_weight
              name
            }
            regular {
              font_family
              font_style
              font_weight
              name
            }
          }
          searchableAttributes
          customDomain
          failOnValidation
        }
      }
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
  return { config: site.siteMetadata, conceptSchemes }
}
