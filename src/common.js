module.exports.t = localized => localized
  && (Object.entries(localized).filter(([, value]) => !!value).shift() || []).pop()
  || ''

module.exports.getPath = (url, extension) => {
  let path = url.replace(/^https?:\//, "").replace(/#$/, "")
  path.endsWith('/') && (path += 'index')
  return `${path}.${extension}`
}
