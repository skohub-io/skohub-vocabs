
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require("node-fetch")
const crypto = require('crypto')
const uuidv4 = require('uuid/v4')
const fs = require('fs-extra')
const exec = require('child_process').exec
const stripAnsi = require('strip-ansi')
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

const isSecured = (signature, payload) => {
  const hmac = crypto.createHmac('sha1', SECRET)
  const digest = 'sha1=' + hmac.update(JSON.stringify(payload)).digest('hex')
  console.log(signature, digest)
  return signature === digest
}

const isCorrectEvent = (headers, payload) => {
  return (headers['x-github-event'] === 'push')
    && payload
    && payload.repository
    && payload.repository.full_name
    && (payload.ref === `refs/heads/${payload.repository.master_branch}`)
}

router.post('/build', async (ctx) => {
  const { body, headers } = ctx.request
  const signature = headers['x-hub-signature']

  // Check if the given signature is valid
  if (!isSecured(signature, body)) {
    ctx.status = 400
    ctx.body = 'Bad request'
    return
  }

  // Check if the given event is valid
  if (isCorrectEvent(headers, body)) {
    const repository = body.repository.full_name
    const id = uuidv4()
    webhooks.push({
      id,
      signature,
      body,
      repository,
      headers,
      date: new Date().toISOString(),
      status: "processing",
      log: []
    })
    ctx.body = `Build triggered: ${BUILD_URL}?id=${id}`
  } else {
    ctx.body = 'Payload was not for master, build not triggered'
  }
  ctx.status = 202
})

const processWebhook = async (webhook) => {
  const response = await fetch(`https://api.github.com/repos/${webhook.repository}/contents/`)
  const files = await response.json()
  // see https://github.com/eslint/eslint/issues/12117
  // eslint-disable-next-line no-unused-vars
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

      const build = exec(`BASEURL=/${webhook.repository} npm run build`, {encoding: "UTF-8"})
      build.stdout.on('data', (data) => {
        console.log('gatsbyLog: ' + data.toString())
        webhook.log.push({
          date: new Date() ,
          text: stripAnsi(data.toString())
        })
        fs.writeFile(`${__dirname}/../dist/build/${webhook.id}.json`, JSON.stringify(webhook))
      })
      build.stderr.on('data', (data) => {
        console.log('gatsbyError: ' + data.toString())
        webhook.log.push({
          date: new Date() ,
          text: stripAnsi(data.toString())
        })
        webhook.status = "error"
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
        fs.emptyDir(`${__dirname}/../data/`)
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
  .listen(PORT, () => console.info(`⚡ Listening on localhost:${PORT}`))

// Loop to processing requests
setInterval(() => {
  processWebhooks()
}, 1)
