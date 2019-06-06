
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const fetch = require("node-fetch")
const { promisify } = require('util')

const exec = require('child_process').exec
const writeFile = promisify(require("fs").writeFile)

const port = 3000
const app = new Koa()
const router = new Router()

const getFile = async (file) => {
  try {
    const response = await fetch(file.url)
    const data = await response.text()
    await writeFile(`test/data/${file.name}`, data)
    console.info("Created file:", file.name)
  } catch (error) {
    console.error(error)
  }
}

router.post('/build', async (ctx, next) => {
  await next()
  const body = ctx.request.body
  const repository = (body && body.repository && body.repository.full_name ) || null
  if (repository) {
    const response = await fetch(`https://api.github.com/repos/${repository}/contents/data`)
    const json = await response.json()

    const files = json.map(file => {
      return {url: file.download_url, name: file.name}
    })

    for (const file of files) {
      await getFile(file)
    }
    ctx.body = 'Files Created'

    const build = exec('npm run build')
    build.stdout.on('data', (data) => console.log('gatsbyLog: ' + data.toString()))
    build.stderr.on('data', (data) => console.log('gatsbyError: ' + data.toString()))
    build.on('exit', (code) => console.info("Build Finish"))
  } else {
    ctx.status = 400
    ctx.message = 'Error creating the files'
  }
})

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port, () => console.info(`⚡ Listening on localhost:${port}`))