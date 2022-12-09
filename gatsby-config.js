require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: `SkoHub Vocabs`,
    description: `Static site generator for Simple Knowledge Management Systems (SKOS)`,
    author: `@gatsbyjs`,
  },
  pathPrefix: `${process.env.BASEURL || ""}`,
  plugins: [
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: "data",
        path: `${__dirname}/data`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Skohub Vocabs`,
        short_name: `Skohub Vocabs`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#26c884`,
        display: `minimal-ui`,
        icon: `src/images/skohub-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
