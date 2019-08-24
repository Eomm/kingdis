'use strict'

const { test } = require('tap')
const { buildCommand, runCommand, cleanTearDown } = require('../helper')

test('push help', async t => {
  t.plan(2)
  try {
    await runCommand(['pub', '-h'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 0)
  }
})

test('push missing mandatory parameters', async t => {
  t.plan(2)
  try {
    await runCommand(['push'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 2)
  }
})

test('push bad line-handler', async t => {
  t.plan(2)
  try {
    await runCommand(['push', '-c', 'cha', '-f', 'README.md', '-l', 'not-exist'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 2)
  }
})

test('push bad line-handler', async t => {
  t.plan(2)
  try {
    await runCommand(['push', '-c', 'cha', '-f', 'README.md', '-l', 'test/line-handler-bad.js'])
  } catch (error) {
    t.ok(error.oclif)
    t.equals(error.oclif.exit, 2)
  }
})

test('push to a list', t => {
  t.plan(2)

  const messages = [
    'Pushing to right the test/messages.txt file',
    /Pushed 3 lines to listz in 0.\d+ sec/m
  ]

  const command = buildCommand((msg) => {
    const val = messages.shift()
    if (val instanceof RegExp) {
      t.match(msg, val)
    } else {
      t.equals(msg, val)
    }
  })

  command.run(['push', '-L', 'listz', '-f', 'test/messages.txt'])
  cleanTearDown(t, 'listz')
})
