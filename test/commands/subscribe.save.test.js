'use strict'

const { test } = require('tap')
const { buildCommand } = require('../helper')
const fs = require('fs')

test('subscribe and save the messages', t => {
  t.plan(4)

  const messages = [
    'Subscribed to 1 channels',
    /^Saving messages to*/gi,
    'Channel file received 0 of 0 msg in 1 sec'
  ]

  let savedFile
  const command = buildCommand((msg) => {
    if (messages.length === 0) {
      process.emit('SIGINT')
      t.equals(fs.existsSync(savedFile), true)
      return
    }

    const val = messages.shift()
    if (val instanceof RegExp) {
      t.match(msg, val)
      savedFile = msg.match(/\s[^ ]*bak$/m).pop().trim()
    } else {
      t.equals(msg, val)
    }
  })

  command.run(['sub', '-c', 'file', '-s']).catch(console.log)
})
