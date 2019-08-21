'use strict'

const { EventEmitter } = require('events')

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

module.exports = {
  buildCommand,
  runCommand (args, onPrint) {
    return buildCommand(onPrint).run(args)
  }
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
