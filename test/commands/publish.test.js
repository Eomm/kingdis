'use strict'

const { test } = require('tap')
const { buildCommand, runCommand } = require('../helper')

test('publish help', async t => {
  t.plan(2)
  try {
    await runCommand(['pub', '-h'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 0)
  }
})

test('publish missing mandatory parameters', async t => {
  t.plan(2)
  try {
    await runCommand(['publish'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 2)
  }
})

test('publish bad line-handler', async t => {
  t.plan(2)
  try {
    await runCommand(['publish', '-c', 'cha', '-f', 'README.md', '-l', 'not-exist'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 2)
  }
})

test('publish bad line-handler', async t => {
  t.plan(2)
  try {
    await runCommand(['publish', '-c', 'cha', '-f', 'README.md', '-l', 'test/line-handler-bad.js'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 2)
  }
})

test('publish to a channel', t => {
  t.plan(4)

  const messages = [
    'Publishing test/messages.txt file',
    /Sent 3 lines to channelz in 0.\d+ sec/m,
    /0 subscribers received the messages from channelz in 0.\d+ sec/m,
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

  command.run(['pub', '-c', 'channelz', '-f', 'test/messages.txt'])
})
