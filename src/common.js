const t = localized => localized
  && (Object.entries(localized).filter(([, value]) => !!value).shift() || []).pop()
  || ''

const getPath = (url, extension) => {
  let path = url.replace(/^https?:\//, "").replace(/#$/, "")
  path.endsWith('/') && (path += 'index')
  return extension ? `${path}.${extension}` : path
}

module.exports = { t, getPath }
