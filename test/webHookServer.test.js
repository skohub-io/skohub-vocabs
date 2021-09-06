/* global expect */
/* global describe */
/* global test */
/* global afterEach */
process.env.SECRET = 'secret'
process.env.BUILD_URL = 'http://localhost:8081/build'

const fs = require('fs-extra')
const { server, getFile } = require("../src/webHookServer")
const request = require("supertest")
const nock = require('nock')
const uuidv4 = require('uuid/v4')

const timeout = async ms => new Promise(resolve => setTimeout(resolve, ms))

afterEach(() => {
  server.close()
})

describe("webHookServer", () => {
  test("Should return a bad request without headers or body", async () => {
    const response = await request(server).post("/build")

    expect(response.status).toEqual(400)
    expect(response.type).toEqual("text/plain")
    expect(response.text).toEqual("Bad request, the event header is missing")
  })

  test("Signature is incorrect", async () => {
    const response = await request(server)
      .post("/build")
      .send({foo: 'bar'})
      .set('x-github-event', 'push')
      .set('x-hub-signature', 'wrongToken')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(400)
    expect(response.text).toEqual("Bad request, the token is incorrect")
  })

  test("Push event is incorrect", async () => {
    process.env = Object.assign(process.env, { SECRET: 'secret' });
    const response = await request(server)
      .post("/build")
      .send({foo: 'bar'})
      .set('x-github-event', 'push wrong')
      .set('x-hub-signature', 'sha1=52b582138706ac0c597c315cfc1a1bf177408a4d')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(400)
    expect(response.text).toEqual("Payload was invalid, build not triggered")
  })

  test("Payload is incorrect", async () => {
    const response = await request(server)
      .post("/build")
      .send({foo: 'bar'})
      .set('x-github-event', 'push')
      .set('x-hub-signature', 'sha1=52b582138706ac0c597c315cfc1a1bf177408a4d')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(400)
    expect(response.text).toEqual("Payload was invalid, build not triggered")
  })
})


// describe('processWebhooks', () => {
//   test('Should process a correct hook and create the files for a build ', async () => {

//     const ttlFile = await fs.readFile(`${__dirname}/data/interactivityType.ttl`)

//      // Fake files url
//     nock('https://fakeURL.test')
//       .get('/files')
//       .reply(200, [{
//         path: 'systematik.ttl',
//         url: 'https://fakeURL.test/interactivityType.ttl',
//       }])

//     // Fake ttl file with the one in test
//     nock('https://fakeURL.test')
//       .get('/interactivityType.ttl')
//       .reply(200, ttlFile)

//     const response = await request(server)
//       .post("/build")
//       .send({
//         ref: 'refs/heads/master',
//         repository: {
//           full_name: 'custom/test'
//         },
//         'files_url': 'https://fakeURL.test/files'
//       })
//       .set('x-skohub-event', 'push')
//       .set('x-skohub-token', 'secret')
//       .set('Accept', 'application/json')

//     expect(response.status).toEqual(202)
//     console.log(response.text)
//     expect(response.text.includes('Build triggered:')).toEqual(true)
//     await timeout(40000)

//     // Check if build log exists
//     const id = /id=([a-zA-Z0-9_.-]*)/.exec(response.text.split('?')[1])[1]
//     console.log(`dist/build/${id}.json`)
//     const buildLogExists = await fs.pathExists(`dist/build/${id}.json`)
//     expect(buildLogExists).toBe(true)

//     // data folder should be empty
//     const dataDirContent = (await fs.readdir('data'))
//       .filter(filename  => filename !== '.gitignore')
//     expect(dataDirContent.length).toBe(0)

//     // public folder should be deleted
//     const publicDirExists = await fs.pathExists('public')
//     expect(publicDirExists).toBe(false)

//     // The index should be in the dist for this build
//     const buildExists = await fs.pathExists('dist/custom/test/heads/master/index.en.html')
//     expect(buildExists).toBe(true)
//   }, 50000)
// })

describe('getFile', () => {
  test('Creates the file', async () => {
    const id = uuidv4()
    const cwd = process.cwd()
    process.chdir('/tmp')

    nock('https://fakeURL.test')
      .get('/file')
      .reply(200, {foo: 'bar'})

    await getFile({
      url: 'https://fakeURL.test/file',
      path: 'file'
    }, id)
    const file = await fs.readFile(`/tmp/data/${id}/file`)
    expect(JSON.parse(file)).toStrictEqual({foo: 'bar'})
    process.chdir(cwd)
  })

  test('Should fail with missing parameters', async () => {
    await expect(getFile()).rejects.toThrow("Missing parameters for getFile")
  })
})
