'use strict'

const fs = require('fs')
const path = require('path')
const { CLIError } = require('@oclif/errors')

module.exports = function lineHandler (modulePath) {
  if (!modulePath) {
    return _ => _
  }

  const theFile = path.join(process.cwd(), modulePath)
  if (!fs.existsSync(theFile)) {
    throw new CLIError(`line-handler ${theFile} not found!`)
  }

  const func = require(theFile)
  if (typeof func !== 'function') {
    throw new CLIError('line-handler must export a function!')
  }

  return func
}
