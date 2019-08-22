'use strict'

const { test } = require('tap')
const { buildCommand } = require('../helper')

test('subscribe to multiple channels', t => {
  t.plan(7)

  const messages = [
    'Subscribed to 3 channels',
    'Channel one received 0 of 0 msg in 1 sec',
    'Channel two received 0 of 0 msg in 1 sec',
    'Channel three received 0 of 0 msg in 1 sec',
    'Channel one received 0 of 0 msg in 1 sec',
    'Channel two received 0 of 0 msg in 1 sec',
    'Channel three received 0 of 0 msg in 1 sec'
  ]

  const command = buildCommand((msg) => {
    t.equals(messages.shift(), msg)
    if (messages.length === 0) {
      process.emit('SIGINT')
    }
  })

  command.run(['sub', '-c', 'one', '-c', 'two', '-c', 'three']).catch(console.log)
})
