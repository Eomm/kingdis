'use strict'

const { test } = require('tap')
const { buildCommand } = require('../helper')

test('lpush to a list', t => {
  t.plan(2)

  const messages = [
    'Pushing to left the test/messages.txt file',
    /Pushed 3 lines to left:list in 0.\d+ sec/m
  ]

  const command = buildCommand((msg) => {
    const val = messages.shift()
    if (val instanceof RegExp) {
      t.match(msg, val)
    } else {
      t.equals(msg, val)
    }
  })

  command.run(['lpush', '-L', 'left:list', '-f', 'test/messages.txt'])
})
