module.exports = {
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-netlify-cms",
    {
      resolve:"gatsby-plugin-typography",
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./_data/`,
      },
    },
    `gatsby-transformer-yaml`,
  ]
}