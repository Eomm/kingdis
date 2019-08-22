'use strict'

const { test } = require('tap')
const { buildCommand } = require('../helper')

test('publish to multiple channel', t => {
  t.plan(7)

  const messages = [
    'Publishing test/messages.txt file',
    'Published line 2 on channels [A,B], payload: message two',
    /Sent 3 lines to A in 0.\d+ sec/m,
    /Sent 3 lines to B in 0.\d+ sec/m,
    /0 subscribers received the messages from A in 0.\d+ sec/m,
    /0 subscribers received the messages from B in 0.\d+ sec/m,
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

  command.run(['pub', '-c', 'A', '-c', 'B', '-f', 'test/messages.txt', '-n', '2'])
})
