'use strict'

const fs = require('fs')

const t = require('tap')
const Redis = require('ioredis')

const { buildCommand } = require('../helper')

t.beforeEach((done, t) => {
  const redis = new Redis({ lazyConnect: true })
  redis.connect()
    .then(() => {
      t.context.redis = redis
      done()
    })
})

t.afterEach((done, t) => {
  t.context.redis.quit()
  done()
})

t.test('subscribe and save the messages', t => {
  t.plan(6)

  const messages = [
    'Subscribed to 1 channels',
    /^Saving messages to*/gi,
    'Message on channel file, payload: this is a message',
    'Channel file received 1 of 1 msg in 1 sec',
    'Channel file received 0 of 1 msg in 1 sec'
  ]
  const allMsg = messages.length

  let savedFile
  const command = buildCommand((msg) => {
    if (messages.length === 0) {
      process.emit('SIGINT')
      t.equals(fs.existsSync(savedFile), true)
      return
    }

    if (messages.length === allMsg) {
      t.context.redis.publish('file', 'this is a message')
    }

    const val = messages.shift()
    if (val instanceof RegExp) {
      t.match(msg, val)
      savedFile = msg.match(/\s[^ ]*bak$/m).pop().trim()
    } else {
      t.equals(msg, val)
    }
  })

  command.run(['sub', '-c', 'file', '-s', '-n', '1']).catch(console.log)
})
