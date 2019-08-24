'use strict'

const { test } = require('tap')
const { buildCommand, cleanTearDown } = require('../helper')

test('push with line handler', t => {
  t.plan(3)

  const messages = [
    'Pushing to left the test/messages.txt file',
    'Pushed line 2 on list [leftx]. Total length 2, payload: {"line":"message two"}',
    /Pushed 3 lines to leftx in 0.\d+ sec/m
  ]

  const command = buildCommand((msg) => {
    const val = messages.shift()
    if (val instanceof RegExp) {
      t.match(msg, val)
    } else {
      t.equals(msg, val)
    }
  })

  command.run(['push', '-S', 'left', '-L', 'leftx', '-f', 'test/messages.txt', '-n', '2', '-l', 'test/line-handler.js'])
  cleanTearDown(t, 'leftx')
})
