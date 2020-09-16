const { nextI18NextRewrites } = require('next-i18next/rewrites')

const localeSubpaths = {
  zh: "zh"
}

module.exports = {
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
}
