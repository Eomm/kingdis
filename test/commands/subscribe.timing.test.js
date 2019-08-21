'use strict'

const { test } = require('tap')
const { buildCommand } = require('../helper')

test('subscribe to multiple channels with interval', t => {
  t.plan(5)

  const messages = [
    'Subscribed to 2 channels',
    'Channel one received 0 of 0 msg in 2.5 sec',
    'Channel two received 0 of 0 msg in 2.5 sec',
    'Channel one received 0 of 0 msg in 2.5 sec',
    'Channel two received 0 of 0 msg in 2.5 sec'
  ]

  const command = buildCommand((msg) => {
    t.equals(messages.shift(), msg)
    if (messages.length === 0) {
      process.emit('SIGINT')
    }
  })

  command.run(['sub', '-c', 'one', '-c', 'two', '-i', '2500']).catch(console.log)
})
