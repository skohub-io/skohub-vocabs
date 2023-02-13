const maybe = require("mjn")
const crypto = require("crypto")
const fetch = require("node-fetch")
const yaml = require("js-yaml")
const fs = require("fs")

const i18n = (lang) => (localized) => localized[lang] || ""

const getFilePath = (url, extension) => {
  let path = url
    .replace(/^https?:\//, "")
    .split("#")
    .shift()
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
const getLinkPath = (path, extension) => {
  const linkPath = "../" + getFilePath(path).split("/").pop() + "." + extension
  return linkPath
}

/**
Replaces the last part (Filepath) of a given url with the last part (Filepath) of another url
@param {string} url
@param {string} replaceId
@param {string} [extension] - extension to be added
@returns {string} path
**/
const replaceFilePathInUrl = (url, replaceId, extension) => {
  // we use getFilePath function to add a missing "index" if necessary
  const path = getFilePath(url)
    .replace(/\/[^\/]*$/, "/" + getFilePath(replaceId).split("/").pop())
    .split("#")
    .shift()
  return extension ? `${path}.${extension}` : path
}

const getPath = (url) => url.replace(/^https?:\/\//, "")

const getFragment = (url) => new URL(url).hash

const getDomId = (url) => {
  const fragment = getFragment(url)
  return fragment ? fragment.substr(1) : url
}

const getHookGitHub = (headers, payload, SECRET) => {
  const obj = {
    type: "github",
    isPush: (headers && headers["x-github-event"] === "push") || false,
    repository: maybe(payload, "repository.full_name", null),
    isSecured:
      (headers &&
        headers["x-hub-signature"] &&
        isSecured(headers["x-hub-signature"], payload, SECRET)) ||
      false,
    ref: (payload && payload.ref) || null,
    headers,
  }
  obj.headers && (obj.headers["x-hub-signature"] = "*******************") // Delete token for report
  return obj
}

const getHookGitLab = (headers, payload, SECRET) => {
  const obj = {
    type: "gitlab",
    isPush: /Push Hook$/.test(headers && headers["x-gitlab-event"]),
    repository: maybe(payload, "project.path_with_namespace", null),
    isSecured:
      (headers &&
        headers["x-gitlab-token"] &&
        headers["x-gitlab-token"] === SECRET) ||
      false,
    ref: (payload && payload.ref) || null,
    headers,
  }
  obj.headers && (obj.headers["x-gitlab-token"] = "*******************") // Delete token for report
  return obj
}

const getHookSkoHub = (headers, payload, SECRET) => {
  const obj = {
    type: "skohub",
    isPush: (headers && headers["x-skohub-event"] === "push") || false,
    repository: maybe(payload, "repository.full_name", null),
    isSecured:
      (headers &&
        headers["x-skohub-token"] &&
        headers["x-skohub-token"] === SECRET) ||
      false,
    ref: (payload && payload.ref) || null,
    filesURL: (payload && payload.files_url) || null,
    headers,
  }
  obj.headers && (obj.headers["x-skohub-token"] = "*******************") // Delete token for report
  return obj
}

const isValid = (hook) => {
  const { isPush, repository, ref } = hook

  return (
    isPush === true && // Only accept push request
    repository !== null &&
    /^[^/]+\/[^/]+$/.test(repository) && // Has a valid repository
    ref !== null &&
    /^refs\/heads|tags\/[^/]+$/.test(ref)
  ) // Has a valid ref
}

const isSecured = (signature, payload, SECRET) => {
  // Is not secured if all the parameters all not present
  if (!signature || !payload || !SECRET) {
    return false
  }

  const hmac = crypto.createHmac("sha1", SECRET)
  const digest = "sha1=" + hmac.update(JSON.stringify(payload)).digest("hex")
  if (signature === digest) {
    return true
  }
  // eslint-disable-next-line no-console
  console.warn("Invalid signature", signature, digest)
  return false
}

const getRepositoryFiles = async ({ type, repository, ref, filesURL }) => {
  let url
  let getLinks

  if (type === "github") {
    url = `https://api.github.com/repos/${repository}/contents/?ref=${ref.replace(
      /refs\/(heads|tags)\//,
      ""
    )}`
    getLinks = formatGitHubFiles
  }

  if (type === "gitlab") {
    url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(
      repository
    )}/repository/tree?ref=${ref}`
    getLinks = formatGitLabFiles
  }

  if (type === "skohub") {
    url = filesURL
    getLinks = (files) => files
  }

  const links = getLinks(await (await fetch(url)).json(), repository, ref)
  return verifyFiles(links)
}

const formatGitHubFiles = (files, repository, ref) => {
  if (files.message) {
    throw new Error(files.message)
  }

  return files
    .filter((file) => file.name.endsWith(".ttl"))
    .map((file) => {
      return {
        path: file.path,
        url: file.download_url,
      }
    })
}

const formatGitLabFiles = (files, repository, ref) => {
  if (files.message) {
    throw new Error(files.message)
  }

  return files
    .filter((file) => file.name.endsWith(".ttl"))
    .map((file) => {
      return {
        path: file.path,
        url: `https://gitlab.com/api/v4/projects/${encodeURIComponent(
          repository
        )}/repository/files/${file.path}/raw?ref=${ref}`,
      }
    })
}

const verifyFiles = (files) => {
  if (files.every((file) => file.path && file.url)) {
    return files
  } else {
    throw Error("Malformed custom files")
  }
}

const getHeaders = (hub, self, path) =>
  `Header set Link "<${hub}>; rel=\\"hub\\", <${self}>; rel=\\"self\\"" "expr=%{REQUEST_URI} =~ m|${path}|"`

/**
 * Parses languages from a json ld graph (Concept or Concept Scheme)
 * @param {array} json
 * @returns {array} languages - found languages
 */
const parseLanguages = (json) => {
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
  parse(json)
  return languages
}

/**
 * Loads and parses the config file.
 * If no configFile is provided it will use the default config file.
 * @param {string} configFile
 * @param {string} defaultFile
 * @returns {object} config
 */
const loadConfig = (configFile, defaultFile) => {
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

  /* the values for these attributes are necessary
  for SkoHub Vocabs to work correctly. Therefore we use
  default values from config.example.yaml if there are 
  no values provided
  */
  const config = {
    title: userConfig.ui.title,
    logo: userConfig.ui.logo || "",
    tokenizer: userConfig.tokenizer || defaults.tokenizer,
    colors: userConfig.ui.colors || defaults.ui.colors,
    fonts: userConfig.ui.fonts || defaults.ui.fonts,
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

module.exports = {
  i18n,
  getPath,
  getFilePath,
  replaceFilePathInUrl,
  getFragment,
  getDomId,
  getHeaders,
  getHookGitHub,
  getHookGitLab,
  getHookSkoHub,
  isValid,
  isSecured,
  getRepositoryFiles,
  getLinkPath,
  parseLanguages,
  loadConfig,
}
