require("dotenv").config()
const { loadConfig } = require("./src/common")

const config = loadConfig("./config.yaml", "./config.default.yaml")

module.exports = {
  siteMetadata: {
    title: `${config.title}`,
    description: `Static site generator for Simple Knowledge Management Systems (SKOS)`,
    author: `Hochschulbibliothekszentrum des Landes Nordrhein-Westfalen (hbz)`,
    tokenizer: config.tokenizer,
    colors: config.colors,
    logo: config.logo,
    fonts: config.fonts,
    searchableAttributes: config.searchableAttributes,
    customDomain: config.customDomain,
    failOnValidation: config.failOnValidation,
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
