const maybe = require('mjn')
const crypto = require('crypto')
const fetch = require("node-fetch")

const t = localized => localized
  && (Object.entries(localized).filter(([, value]) => !!value).shift() || []).pop()
  || ''

const getPath = (url, extension) => {
  let path = url.replace(/^https?:\//, "").replace(/#$/, "")
  path.endsWith('/') && (path += 'index')
  return extension ? `${path}.${extension}` : path
}

const getHookGitHub = (headers, payload, SECRET) => {
  const obj = {
    type: 'github',
    isPush: headers['x-github-event'] === 'push',
    repository: maybe(payload, 'repository.full_name'),
    isSecured: headers['x-hub-signature'] && isSecured(headers['x-hub-signature'], payload, SECRET),
    ref: payload.ref,
    headers
  }
  obj.headers['x-hub-signature'] = '*******************' // Delete token for report
  return obj
}

const getHookGitLab = (headers, payload, SECRET) => {
  const obj = {
    type: 'gitlab',
    isPush: headers['x-gitlab-event'] === 'Push Hook',
    repository: maybe(payload, 'project.path_with_namespace'),
    isSecured: headers['x-gitlab-token'] === SECRET,
    ref: payload.ref,
    headers
  }
  obj.headers['x-gitlab-token'] = '*******************' // Delete token for report
  return obj
}

const getHookSkoHub = (headers, payload, SECRET) => {
  const obj = {
    type: 'skohub',
    isPush: headers['x-skohub-event'] === 'push',
    repository: maybe(payload, 'repository.full_name'),
    isSecured: headers['x-skohub-token'] === SECRET,
    ref: payload.ref,
    filesURL: payload.files_url,
    headers
  }
  obj.headers['x-skohub-token'] = '*******************' // Delete token for report
  return obj
}

const isValid = (hook) => {
  const { isPush, repository, ref } = hook

  return isPush // Only accept push request
    && (repository !== null && /^[^\/]+\/[^\/]+$/.test(repository)) // Has a valid repository
    && (ref !== null && /^refs\/heads\/[^\/]+$/.test(ref)) // Has a valid ref
}

const isSecured = (signature, payload, SECRET) => {
  const hmac = crypto.createHmac('sha1', SECRET)
  const digest = 'sha1=' + hmac.update(JSON.stringify(payload)).digest('hex')
  if (signature === digest) {
    return true
  }
  console.warn('Invalid signature'.red, signature, digest)
}

const getRepositoryFiles = async ({type, repository, ref, filesURL}) => {
  let url
  let getLinks

  if (type === 'github') {
    url = `https://api.github.com/repos/${repository}/contents/?ref=${ref.replace('refs/heads/', '')}`
    getLinks = formatGitHubFiles
  }

  if (type === 'gitlab') {
    url = `https://gitlab.com/api/v4/projects/${encodeURIComponent(repository)}/repository/tree?ref=${ref}`
    getLinks = formatGitLabFiles
  }

  if (type === 'skohub') {
    url = filesURL
    getLinks = files => files
  }

  try {
    return getLinks(await (await fetch(url)).json(), repository, ref)
  } catch (error) {
    console.log(error)
    console.error('Error fetching data')
  }
}

const formatGitHubFiles = (files, repository, ref) => {
  return files
    .filter(file => file.name.endsWith('.ttl'))
    .map(file => {
      return {
        path: file.path,
        url: file.download_url
      }
    })
}

const formatGitLabFiles = (files, repository, ref) => {
  return files
    .filter(file => file.name.endsWith('.ttl'))
    .map(file => {
      return {
        path: file.path,
        url: `https://gitlab.com/api/v4/projects/${encodeURIComponent(repository)}/repository/files/${file.path}/raw?ref=${ref}`
      }
    })
}

const getHeaders = (inbox, hub, self, path) => `Header set Link "<${inbox}>; rel=\\"http://www.w3.org/ns/ldp#inbox\\", <${hub}>; rel=\\"hub\\", <${self}>; rel=\\"self\\"" "expr=%{REQUEST_URI} =~ m|${path}|"`

module.exports = {
  t,
  getPath,
  getHeaders,
  getHookGitHub,
  getHookGitLab,
  getHookSkoHub,
  isValid,
  getRepositoryFiles,
}
