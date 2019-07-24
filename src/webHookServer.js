
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require("node-fetch")
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')
const exec = require('child_process').exec
require('dotenv').config()
require('colors')

const { PORT, SECRET } = process.env
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

const isSecured = (signature, payload) => {
  const hmac = crypto.createHmac('sha1', SECRET)
  const digest = 'sha1=' + hmac.update(JSON.stringify(payload)).digest('hex')
  console.log(signature, digest)
  return signature === digest
}

router.post('/build', async (ctx) => {
  const { body } = ctx.request
  const signature = ctx.request.headers['x-hub-signature']
  const repository = (body && body.repository && body.repository.full_name ) || null

  // Check if the given signature is valid
  if (isSecured(signature, body)) {
    if (repository) {

      webhooks.push({
        id: uuidv4(),
        signature,
        body,
        repository,
        date: new Date().toISOString()
      })

      ctx.body = 'Files Created'
    } else {
      ctx.status = 400
      ctx.message = 'Error creating the files'
    }
  } else {
    console.warn("The signature does not match")
  }
})

const processWebhook = async (webhook) => {
  const response = await fetch(`https://api.github.com/repos/${webhook.repository}/contents/data`)
  const files = await response.json()
  for (const file of files) {
    await getFile({url: file.download_url, path: file.path}, webhook.repository)
  }
}

const processWebhooks = async () => {
  if (processingWebhooks === false) {
    if (webhooks.length > 0) {
      processingWebhooks = true
      console.log(`Processing`.green)
      const webhook = webhooks.shift()
      await processWebhook(webhook)

      const build = exec('npm run build')
      build.stdout.on('data', (data) => console.log('gatsbyLog: ' + data.toString()))
      build.stderr.on('data', (data) => console.log('gatsbyError: ' + data.toString()))
      build.on('exit', (code) => {
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
  .listen(PORT, () => console.info(`⚡ Listening on localhost:${PORT}`))

// Loop to processing requests
setInterval(() => {
  processWebhooks()
}, 1)
