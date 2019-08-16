const t = localized => localized
  && (Object.entries(localized).filter(([, value]) => !!value).shift() || []).pop()
  || ''

const getPath = (url, extension) => {
  let path = url.replace(/^https?:\//, "").replace(/#$/, "")
  path.endsWith('/') && (path += 'index')
  return extension ? `${path}.${extension}` : path
}

const getHeaders = (inbox, hub, self, path) => `Header set Link "<${inbox}>; rel=\\"http://www.w3.org/ns/ldp#inbox\\", <${hub}>; rel=\\"hub\\", <${self}>; rel=\\"self\\"" "expr=%{REQUEST_URI} =~ m|${path}|"`

module.exports = { t, getPath, getHeaders }
