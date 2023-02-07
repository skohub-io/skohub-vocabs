import { useStaticQuery, graphql } from "gatsby"

export const useConfig = () => {
  const { site } = useStaticQuery(graphql`
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
        }
      }
    }
  `)
  return site.siteMetadata
}
