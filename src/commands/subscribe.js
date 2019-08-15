'use strict'
const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')

class Subscribe extends Command {
  async run () {
    console.log('running my command')
    this.log('uh oh!')
    this.warn('uh oh!')
    // exit with an error message
    // this.error('uh oh!!!') // it is like return
    const name = await cli.prompt('What is your name?')
    throw new CLIError(`my friendly error ${name}`)
  }
}

Subscribe.description = 'description of this example command'
Subscribe.aliases = ['sub']
Subscribe.usage = 'mycommand --myflag'
Subscribe.examples = [
  '$ mycommand --force',
  '$ mycommand --help'
]

module.exports = Subscribe
