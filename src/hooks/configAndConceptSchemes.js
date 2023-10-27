import { useStaticQuery, graphql } from "gatsby"

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

