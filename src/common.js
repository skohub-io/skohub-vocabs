module.exports.t = localized => localized
  && (Object.entries(localized).filter(([, value]) => !!value).shift() || []).pop()
  || ''
module.exports.getPath = (url, extension) => url.replace("http:/", "").replace("#", "") + '.' + extension
