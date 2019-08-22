'use strict'

const { test } = require('tap')
const { buildCommand } = require('../helper')

test('publish with line handler', t => {
  t.plan(7)

  const messages = [
    'Publishing test/messages.txt file',
    'Published line 1 on channels [line], payload: {"line":"message one"}',
    'Published line 2 on channels [line], payload: {"line":"message two"}',
    'Published line 3 on channels [line], payload: {"line":"message three"}',
    /Sent 3 lines to line in 0.\d+ sec/m,
    /0 subscribers received the messages from line in 0.\d+ sec/m,
    'Published 3 lines'
  ]

  const command = buildCommand((msg) => {
    const val = messages.shift()
    if (val instanceof RegExp) {
      t.match(msg, val)
    } else {
      t.equals(msg, val)
    }
  })

  command.run(['pub', '-c', 'line', '-f', 'test/messages.txt', '-n', '1', '-l', 'test/line-handler.js'])
})
