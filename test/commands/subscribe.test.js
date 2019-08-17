'use strict'

const { test } = require('tap')

const Command = require('../../src/index')

test('subscribe', async t => {
  const exec = Command.run(['sub', '-h'])
  try {
    await exec
  } catch (error) {
    console.log({ error })
    console.log(error.oclif.exit)
  }
})

test('subscribe missing mandatory parameters', async t => {
  const exec = Command.run(['sub'])
  try {
    await exec
  } catch (error) {
    console.log({ error })
    console.log(error.oclif.exit)
  }
})
