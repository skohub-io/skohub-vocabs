
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

  const hook = headers['x-github-event']
    ? getHookGitHub(headers, body, SECRET)
    : getHookGitLab(headers, body, SECRET)

  // Check if the given signature is valid
  if (!hook.isSecured) {
    ctx.status = 400
    ctx.body = 'Bad request'
    return
  }

  // Check if the given event is valid
  if (isValid(hook)) {
    const id = uuidv4()
    const { type, repository, headers, ref } = hook
    webhooks.push({
      id,
      body,
      repository,
      headers,
      date: new Date().toISOString(),
      status: "processing",
      log: [],
      type,
      ref
    })
    ctx.body = `Build triggered: ${BUILD_URL}?id=${id}`
    console.log('Build triggered')
  } else {
    ctx.body = 'Payload was not for master, build not triggered'
    console.log('Payload was not for master, build not triggered')
  }
  ctx.status = 202
})

const processWebhook = async (webhook) => {
  const files = await getRepositoryFiles(webhook)

  // see https://github.com/eslint/eslint/issues/12117
  // eslint-disable-next-line no-unused-vars
  for (const file of files) {
    await getFile({url: file.url, path: file.path}, webhook.repository)
  }
}

const processWebhooks = async () => {
  if (processingWebhooks === false) {
    if (webhooks.length > 0) {
      processingWebhooks = true
      console.log(`Processing`.green)
      const webhook = webhooks.shift()
      await processWebhook(webhook)

      const build = exec(`BASEURL=/${webhook.repository} CI=true npm run build`, {encoding: "UTF-8"})
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
        webhook.log.push({
          date: new Date(),
          text: data.toString(),
          warning: true
        })
        if (!data.toString().includes('warning Deprecation')) {
          webhook.status = "error"
        }
        fs.writeFile(`${__dirname}/../dist/build/${webhook.id}.json`, JSON.stringify(webhook))
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
        fs.removeSync(`${__dirname}/../dist/${webhook.repository}/`)
        fs.moveSync(`${__dirname}/../public/`, `${__dirname}/../dist/${webhook.repository}`)
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
  .listen(PORT, () => console.info(`⚡ Listening on localhost:${PORT}`.green))

// Loop to processing requests
setInterval(() => {
  processWebhooks()
}, 1)
