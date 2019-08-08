module.exports.t = localized => localized[Object.keys(localized)[0]]
module.exports.getPath = (url, extension) => url.replace("http:/", "").replace("#", "") + '.' + extension
