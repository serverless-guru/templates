'use strict'

const path = require('path')
const fsPromises = require('fs').promises
const YAML = require('js-yaml')

const getFunctions = async ({ options, resolveVariable }) => {
  const fctFiles = await getAllFiles('./src/handlers', 'yml')

  const elements = {}
  for (const file of fctFiles) {
    if (file.endsWith('.doc.yml')) {
      continue
    }
    const fileContent = await fsPromises.readFile(file, 'utf8')
    const document = YAML.load(fileContent)
    if (document) {
      delete document.properties
      const methodName = getMethodName(file, 2)
      elements[methodName] = document
    }
  }
  return elements
}

const getResources = async ({ options, resolveVariable }) => {
  const elements = {}

  const resFiles = await getAllFiles('./resources', 'yml')

  for (const file of resFiles) {
    const fileContent = await fsPromises.readFile(file, 'utf8')
    const doc = YAML.load(fileContent)

    if (doc) {
      delete doc.Outputs
      const methodName = getMethodName(file)
      elements[methodName] = doc
    }
  }
  const fctFiles = await getAllFiles('./src/handlers', 'yml')
  for (const file of fctFiles) {
    const fileContent = await fsPromises.readFile(file, 'utf8')
    const doc = YAML.load(fileContent)
    if (doc && doc.properties) {
      for (const resourceName in doc.properties) {
        const property = doc.properties[resourceName]
        const methodName = getMethodName(file, 2) + ucFirst(resourceName)
        elements[methodName] = { ...elements[methodName], Properties: property.Pr }
      }
    }
  }
  return elements
}

const getOutputs = async ({ options, resolveVariable }) => {
  console.log('=== outputs')
  console.log(options)
  const stage = await resolveVariable('sls:stage')
  const region = await resolveVariable('opt:region, self:provider.region, "us-east-1"')
  const accountId = await resolveVariable('aws:accountId')
  console.log('===>')
  console.log({ stage, region, accountId })

  return {}
}

const getAllFiles = async (startPath, extension) => {
  try {
    const statStartPath = await fsPromises.lstat(startPath)
    if (!statStartPath.isDirectory()) {
      return {}
    }
  } catch {
    return {}
  }

  let fileList = []
  const files = await fsPromises.readdir(startPath)

  for (const file of files) {
    const filename = path.join(startPath, file)
    const stat = await fsPromises.lstat(filename)
    if (stat.isDirectory()) {
      const subFileList = await getAllFiles(filename, extension)
      fileList = [...fileList, ...subFileList]
    } else if (filename.endsWith(`.${extension}`)) {
      fileList.push(filename)
    }
  }
  return fileList
}

const ucFirst = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const getMethodName = (filePath, n = 1) => {
  return filePath
    .split('/')
    .slice(n)
    .map((name) => {
      return ucFirst(name.replace(/^fct\./i, '').replace(/\.yml$/i, ''))
    })
    .join('')
}

module.exports = {
  getFunctions,
  getResources,
  getOutputs,
}
