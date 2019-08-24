'use strict'

const { test } = require('tap')
const { buildCommand } = require('../helper')

test('rpush to a list', t => {
  t.plan(2)

  const messages = [
    'Pushing to right the test/messages.txt file',
    /Pushed 3 lines to right:list in 0.\d+ sec/m
  ]

  const command = buildCommand((msg) => {
    const val = messages.shift()
    if (val instanceof RegExp) {
      t.match(msg, val)
    } else {
      t.equals(msg, val)
    }
  })

  command.run(['rpush', '-L', 'right:list', '-f', 'test/messages.txt'])
})
