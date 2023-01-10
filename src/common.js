const maybe = require("mjn")
const crypto = require("crypto")
const fetch = require("node-fetch")

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
  // we use getFilePath method to add a missing "index" if necessary
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
 * Parses languages from a json ld graph
 * @param {string} cs
 * @param {array} arrayOfObj
 * @returns {array} languages - found languages
 */
const parseLanguages = function (cs, arrayOfObj) {
  const languages = new Set()
  for (let obj of arrayOfObj) {
    // Concept Schemes
    obj?.title && Object.keys(obj.title).forEach((l) => languages.add(l))
    // Concepts
    obj?.prefLabel &&
      Object.keys(obj.prefLabel).forEach((l) => languages.add(l))
    obj?.altLabel && Object.keys(obj.altLabel).forEach((l) => languages.add(l))
    obj?.hiddenLabel &&
      Object.keys(obj.hiddenLabel).forEach((l) => languages.add(l))

    obj?.hasTopConcept && parseLanguages(cs, obj?.hasTopConcept)
    obj?.narrower && parseLanguages(cs, obj?.narrower)
  }
  return languages
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
}
