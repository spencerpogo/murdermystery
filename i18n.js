/*import NextI18Next from "next-i18next";
import config from "next/config";

const { localeSubpaths } = config.default().publicRuntimeConfig;*/

const NextI18Next = require('next-i18next').default
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig

const path = require('path')

module.exports = new NextI18Next({
  otherLanguages: ['zh'],
  localeSubpaths,
  localePath: path.resolve('./public/static/locales')
})
