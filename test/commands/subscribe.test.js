'use strict'

const { test } = require('tap')
const { buildCommand, runCommand } = require('../helper')

test('subscribe help', async t => {
  t.plan(2)
  try {
    await runCommand(['sub', '-h'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 0)
  }
})

test('subscribe missing mandatory parameters', async t => {
  t.plan(2)
  try {
    await runCommand(['subscribe'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 2)
  }
})

test('subscribe to a channel', t => {
  t.plan(4)

  const messages = [
    'Subscribed to 1 channels',
    'Channel aaaaa received 0 of 0 msg in 1 sec',
    'Channel aaaaa received 0 of 0 msg in 1 sec',
    'Channel aaaaa received 0 of 0 msg in 1 sec'
  ]

  const command = buildCommand((msg) => {
    t.equals(messages.shift(), msg)
    if (messages.length === 0) {
      process.emit('SIGINT')
    }
  })

  command.run(['sub', '-c', 'aaaaa'])
})
