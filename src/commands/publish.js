'use strict'

const os = require('os')
const { join } = require('path')
const { createWriteStream } = require('fs')

const { flags } = require('@oclif/command')

const { speedBeat } = require('speed-beat')

const RedisCommand = require('../redis-command')

class Publish extends RedisCommand {
  async run () {
    const channelFileStreamMap = new Map()

    const channels = this.flags.channel

    const speed = speedBeat({ timer: '1s' })

    channels.forEach(async (channel) => {
      const line = 'demoooo'
      const listenedFrom = await this.redis.publish(channel, line)
      this.log('The message %s has been received from %d subscriber', line, listenedFrom)
    })
  }
}

Publish.flags = {
  ...RedisCommand.flags,
  channel: flags.string({
    char: 'c',
    description: 'the channel(s) where to publish the messages',
    required: true,
    multiple: true
  }),
  file: flags.string({
    char: 'f',
    description: 'the file to publish. Each line will be a message',
    required: true
  }),
  pick: flags.integer({
    char: 'n',
    description: 'print the message payload every <pick> messages published. 0 to turn off',
    default: 0
  })
}
Publish.description = `publish to a redis channel a message-file
...
Extra documentation goes here
`
Publish.aliases = ['pub']
Publish.usage = 'publish -c one -c two'
Publish.examples = [
  'Show the payload every 10 message received:',
  ' $ subscribe -H 192.169.99.100 -p 6970 --pick 10 -c my-channel',
  'Show how many messages are published by redis in 10 seconds:',
  ' $ subscribe -c my-channel --interval 10000'
]

module.exports = Publish
