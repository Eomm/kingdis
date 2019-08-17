'use strict'

const { EventEmitter } = require('events')

module.exports = function plotter (printer) {
  const ee = new EventEmitter()
  ee.on('print', printer)
  return ee
}
