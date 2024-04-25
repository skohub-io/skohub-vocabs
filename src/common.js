const yaml = require("js-yaml")
const fs = require("fs")

const i18n = (lang) => (localized) => localized[lang] || ""

const getFilePath = (url, extension, pattern) => {
  if (!pattern) {
    pattern = /^https?:\//
  } else if (pattern.endsWith("/")) {
    pattern = pattern.slice(0, -1)
  }
  let path = url.replace(pattern, "").split("#").shift()
  path.endsWith("/") && (path += "index")
  return extension ? `${path}.${extension}` : path
}

/**
Get File Path for Gatsby Link component
@param {string} path
@param {string} extension
@returns {string} linkPath
@example
// returns "../1.de.html"
getLinkPath("http://w3id.org/class/hochschulfaecher/1", "de.html")
**/
const getLinkPath = (path, extension, customDomain) => {
  const linkPath =
    "../" +
    getFilePath(path, "", customDomain).split("/").pop() +
    "." +
    extension
  return linkPath
}

/**
Replaces the last part (Filepath) of a given url with the last part (Filepath) of another url
@param {string} url
@param {string} replaceId
@param {string} [extension] - extension to be added
@returns {string} path
**/
const replaceFilePathInUrl = (url, replaceId, extension, customDomain) => {
  // we use getFilePath function to add a missing "index" if necessary
  const path = getFilePath(url)
    .replace(
      /\/[^\/]*$/,
      "/" + getFilePath(replaceId, "", customDomain).split("/").pop()
    )
    .split("#")
    .shift()
  return extension ? `${path}.${extension}` : path
}

const getFragment = (url) => new URL(url).hash

const getDomId = (url) => {
  const fragment = getFragment(url)
  return fragment ? fragment.substr(1) : url
}

/**
 * Parses languages from a json ld graph (Concept or Concept Scheme)
 * @param {array} graph
 * @returns {array} languages - found languages
 */
const parseLanguages = (graph) => {
  const languages = new Set()
  const parse = (arrayOfObj) => {
    for (let obj of arrayOfObj) {
      // Concept Schemes
      obj?.title &&
        Object.keys(obj.title).forEach((l) => obj.title[l] && languages.add(l))
      // Concepts
      obj?.prefLabel &&
        Object.keys(obj.prefLabel).forEach(
          (l) => obj.prefLabel[l] && languages.add(l)
        )
      obj?.altLabel &&
        Object.keys(obj.altLabel).forEach(
          (l) => obj.altLabel[l] && languages.add(l)
        )
      obj?.hiddenLabel &&
        Object.keys(obj.hiddenLabel).forEach(
          (l) => obj.hiddenLabel[l] && languages.add(l)
        )
      obj?.hasTopConcept && parse(obj.hasTopConcept)
      obj?.narrower && parse(obj.narrower)
    }
  }
  parse(graph)
  return languages
}

/**
 * @typedef {Object} Config
 * @property {string} title
 * @property {string} logo
 * @property {string} tokenizer
 * @property {Object} colors
 * @property {string} customDomain
 * @property {string[]} searchableAttributes
 */

/**
 * Loads and parses the config file.
 * If no configFile is provided it will use the default config file.
 * @param {string} configFile
 * @param {string} defaultFile
 * @returns {Config} config
 */
function loadConfig(configFile, defaultFile) {
  let userConfig
  const defaults = yaml.load(fs.readFileSync(defaultFile, "utf8"))

  try {
    userConfig = yaml.load(fs.readFileSync(configFile, "utf8"))
  } catch (e) {
    // eslint-disable-next-line no-console
    // TODO when #253 is further investigated this might be turned on again
    // console.log("no user config provided, using default config")
    userConfig = defaults
  }

  if (!userConfig.ui.title) {
    throw Error("A Title has to be provided! Please check your config.yaml")
  }

  /**
  the values for these attributes are necessary
  for SkoHub Vocabs to work correctly. Therefore we use
  default values from config.example.yaml if there are 
  no values provided
  */

  /** @type Config */
  const config = {
    title: userConfig.ui.title,
    logo: userConfig.ui.logo || "",
    tokenizer: userConfig.tokenizer || defaults.tokenizer,
    colors: userConfig.ui.colors || defaults.ui.colors,
    fonts: userConfig.ui.fonts || defaults.ui.fonts,
    searchableAttributes:
      userConfig.searchableAttributes || defaults.searchableAttributes,
    customDomain: userConfig.custom_domain || "",
    failOnValidation: userConfig.fail_on_validation,
  }

  // check if all relevant colors are contained, otherwise use default colors
  const checkColors = () => {
    const neededColors = [
      "skoHubWhite",
      "skoHubDarkColor",
      "skoHubMiddleColor",
      "skoHubLightColor",
      "skoHubThinColor",
      "skoHubBlackColor",
      "skoHubAction",
      "skoHubNotice",
      "skoHubDarkGrey",
      "skoHubMiddleGrey",
      "skoHubLightGrey",
    ]
    if (neededColors.every((r) => Object.keys(config.colors).includes(r))) {
      return true
    } else {
      // eslint-disable-next-line no-console
      // console.log("some needed colors are not defined, using default colors")
      return false
    }
  }

  const checkFonts = () => {
    const neededProps = ["font_family", "font_style", "font_weight", "name"]
    if (
      neededProps.every((r) => Object.keys(config.fonts.regular).includes(r)) &&
      neededProps.every((r) => Object.keys(config.fonts.bold).includes(r))
    ) {
      return true
    } else {
      // eslint-disable-next-line no-console
      // console.log(
      //   "Some necessary font props were not given, using default fonts"
      // )
      return false
    }
  }

  if (!checkColors()) {
    config.colors = defaults.ui.colors
  }

  if (!checkFonts()) {
    config.fonts = defaults.ui.fonts
  }
  return config
}

/**
 * Location object from reach router, see https://www.gatsbyjs.com/docs/location-data-from-props/
 * @typedef {Object} Location
 * @property {string} key
 * @property {string} pathname
 * @property {string} search
 */

/**
 * Parses the location object for an URL parameter "lang".
 * If multiple "lang" params are given, the first one is taken.
 * @param {Location} location
 * @returns {string|null} parsed language or null if none is given
 */
const getLanguageFromUrl = (location) => {
  const params = new URLSearchParams(location.search)
  const language = params.get("lang")
  return language
}

/**
 * Replaces an oldKey against a new key
 * @param {Object} obj
 * @param {string} oldKey
 * @param {string} newKey
 * @returns {Object}
 */
const replaceKeyInObject = (obj, oldKey, newKey) => {
  if (!(oldKey in obj)) return obj
  const newObject = {}
  delete Object.assign(newObject, obj, { [newKey]: obj[oldKey] })[oldKey]
  return newObject
}

/**
 * Replaces multiple keys of an object.
 * Expects an array of arrays in the form [oldKey, newKey]
 */
const replaceMultipleKeysInObject = (obj, keys) => {
  const replaced = keys.reduce(
    (acc, val) => replaceKeyInObject(acc, val[0], val[1]),
    obj
  )
  return replaced
}

module.exports = {
  i18n,
  getFilePath,
  replaceFilePathInUrl,
  getFragment,
  getDomId,
  getLinkPath,
  parseLanguages,
  loadConfig,
  getLanguageFromUrl,
  replaceKeyInObject,
  replaceMultipleKeysInObject,
}
