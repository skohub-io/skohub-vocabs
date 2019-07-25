module.exports = {
  siteMetadata: {
    title: `SkoHub-SSG`,
    description: `Static site generator for Simple Knowledge Management Systems (SKOS)`,
    author: `@gatsbyjs`,
  },
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
        name: 'data',
        path: `${__dirname}/data/${process.env.GITHUB_REPOSITORY || ''}`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // 'gatsby-plugin-offline',
  ],
}
