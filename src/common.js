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

module.exports = {
  i18n,
  getPath,
  getFilePath,
  replaceFilePathInUrl,
  getFragment,
  getDomId,
  getLinkPath,
  parseLanguages,
}
