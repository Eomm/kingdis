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

test('publish to a channel', t => {
  // TODO
})
