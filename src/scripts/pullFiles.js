const fetch = require("node-fetch")
const fs = require("fs")
const { promisify } = require('util')

const writeFile = promisify(fs.writeFile)
console.log("ENVIROMENT", process.env && process.env.INCOMING_HOOK_BODY)

const repository = process.env.INCOMING_HOOK_BODY ? JSON.parse(decodeURI(process.env.INCOMING_HOOK_BODY)).repository.full_name : "dobladov/testTTTL"

const pullFiles = async () => {
  const response = await fetch(`https://api.github.com/repos/${repository}/contents/data`)
  const json = await response.json()

  console.log(json)
  const files = json.map(file => {
    return {url: file.download_url, name: file.name}
  })

  for (const file of files) {
    getFile(file)
  }
}

const getFile = async (file) => {
  try {
    const response = await fetch(file.url)
    const data = await response.text()
    await writeFile(`/tmp/ttl/${file.name}`, data)
    console.log("Created file:", file.name)
  } catch (error) {
    console.log(error)
  }
}

if (repository) {
  pullFiles()
}