'use strict'

const { EventEmitter } = require('events')
const Redis = require('ioredis')

const monkeyPlotter = monkeyPatchPlotter()

function buildCommand (onPrint) {
  const theCommand = require('../src/index')

  if (onPrint) {
    monkeyPlotter.on('print', onPrint)
    // theCommand.endTest = function () {
    //   monkeyPlotter.removeListener('print', onPrint)
    // }
  }

  return theCommand
}

function cleanTearDown (t, keys, connection) {
  t.tearDown(async () => {
    const redis = new Redis(connection)
    await redis.del(keys)
    redis.quit()
  })
}

module.exports = {
  buildCommand,
  runCommand (args, onPrint) {
    return buildCommand(onPrint).run(args)
  },
  cleanTearDown
}

function monkeyPatchPlotter () {
  require('../src/plotter')

  const resolved = require('path').resolve('./src/plotter.js')
  const testPlotter = new EventEmitter()

  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: function () { return testPlotter }
  }

  return testPlotter
}
