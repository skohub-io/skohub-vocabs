
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')
const exec = require('child_process').exec
const fetch = require("node-fetch")

const {
  getHookGitHub,
  getHookGitLab,
  getHookSkoHub,
  isValid,
  getRepositoryFiles,
} = require('./common')

require('dotenv').config()
require('colors')

const { PORT, SECRET, BUILD_URL } = process.env
const app = new Koa()
const router = new Router()

const webhooks = []
let processingWebhooks = false

const getFile = async (file, repository) => {

  if (!file || !repository) {
    throw new Error('Missing parameters for getFile')
  }

  try {
    const response = await fetch(file.url)
    const data = await response.text()
    const path = `data/${repository}/`
    await fs.outputFile(`${path}${file.path}`, data)
    console.info("Created file:".green, file.path)
  } catch (error) {
    console.error(error)
  }
}

router.post('/build', async (ctx) => {
  const { body, headers } = ctx.request

  let hook
  if (headers['x-github-event']) {
    hook = getHookGitHub(headers, body, SECRET)
  } else if (headers['x-gitlab-event']) {
    hook = getHookGitLab(headers, body, SECRET)
  } else if (headers['x-skohub-event']) {
    hook = getHookSkoHub(headers, body, SECRET)
  } else {
    console.warn('Bad request, the event header is missing')
    ctx.status = 400
    ctx.body = 'Bad request, the event header is missing'
    return
  }

  // Check if the given signature is valid
  if (!hook.isSecured) {
    console.warn('Bad request, the token is incorrect')
    ctx.status = 400
    ctx.body = 'Bad request, the token is incorrect'
    return
  }

  // Check if the given event is valid
  if (isValid(hook)) {
    const id = uuidv4()
    const { type, repository, headers, ref, filesURL } = hook
    webhooks.push({
      id,
      body,
      repository,
      headers,
      date: new Date().toISOString(),
      status: "processing",
      log: [],
      type,
      filesURL,
      ref
    })
    ctx.status = 202
    ctx.body = `Build triggered: ${BUILD_URL}?id=${id}`
    console.log('Build triggered')
  } else {
    ctx.status = 400
    ctx.body = 'Payload was invalid, build not triggered'
    console.log('Payload was invalid, build not triggered')
  }
})

const processWebhooks = async () => {
  if (processingWebhooks === false) {
    if (webhooks.length > 0) {
      processingWebhooks = true
      console.log(`Processing`.green)
      const webhook = webhooks.shift()
      const branch = webhook.ref.replace('refs/heads/', '')

      try {
        // Fetch urls for the repository files
        const files = await getRepositoryFiles(webhook)

        // see https://github.com/eslint/eslint/issues/12117
        // Fetch each one of the repository files
        // eslint-disable-next-line no-unused-vars
        for (const file of files) {
          await getFile({url: file.url, path: file.path}, webhook.repository)
        }
      } catch (error) {
        // If there is an error fetching the files,
        // stop the current webhook and return
        console.error(error)
        webhook.log.push({
          date: new Date(),
          text: error.message,
          warning: true
        })
        webhook.status = "error"
        fs.writeFile(`${__dirname}/../dist/build/${webhook.id}.json`, JSON.stringify(webhook))
        processingWebhooks = false
        return
      }

      const build = exec(`BASEURL=/${webhook.repository}/${branch} CI=true npm run build`, {encoding: "UTF-8"})
      build.stdout.on('data', (data) => {
        console.log('gatsbyLog: ' + data.toString())
        webhook.log.push({
          date: new Date(),
          text: data.toString()
        })
        fs.writeFile(`${__dirname}/../dist/build/${webhook.id}.json`, JSON.stringify(webhook))
      })
      build.stderr.on('data', (data) => {
        console.log('gatsbyError: ' + data.toString())
        if (!data.toString().includes('warning Deprecation')) {
          webhook.log.push({
            date: new Date(),
            text: data.toString(),
            warning: true
          })
          webhook.status = "error"
          fs.writeFile(`${__dirname}/../dist/build/${webhook.id}.json`, JSON.stringify(webhook))
        }
      })
      build.on('exit', async () => {
        if (webhook.status !== "error") {
          webhook.status = "complete"
          webhook.log.push({
            date: new Date(),
            text: "Build Finish"
          })
        }
        fs.writeFile(`${__dirname}/../dist/build/${webhook.id}.json`, JSON.stringify(webhook))
        fs.removeSync(`${__dirname}/../.cache`)
        fs.readdirSync(`${__dirname}/../data/`)
          .filter(filename  => filename !== '.gitignore')
          .forEach(filename => fs.removeSync(`${__dirname}/../data/${filename}`))
        fs.removeSync(`${__dirname}/../dist/${webhook.repository}/${branch}/`)
        fs.moveSync(`${__dirname}/../public/`, `${__dirname}/../dist/${webhook.repository}/${branch}/`)
        console.info("Build Finish".yellow)
        processingWebhooks = false
      })
    }
  }
}

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = app.listen(PORT, () => console.info(`⚡ Listening on localhost:${PORT}`.green))

// Loop to processing requests
setInterval(() => {
  processWebhooks()
}, 1)

module.exports = { server, getFile }