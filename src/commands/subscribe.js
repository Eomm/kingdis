'use strict'

const os = require('os')
const { join } = require('path')
const { createWriteStream } = require('fs')

const { flags } = require('@oclif/command')
const { speedBeat } = require('speed-beat')

const RedisCommand = require('../redis-command')

class Subscribe extends RedisCommand {
  async run () {
    const channelFileStreamMap = new Map()

    const channels = this.flags.channel
    const channelCount = await this.redis.subscribe(channels)
    this.log(`Subscribed to ${channelCount} channels`)

    const speed = speedBeat({ timer: this.flags.interval })

    channels.forEach((channel) => {
      speed.chrono(channel, (id, counter, total) => {
        this.log(`Channel ${id} received ${counter} of ${total} msg in ${speed.timer() / 1000} sec`)
      })

      if (this.flags.save) {
        const fileName = join(process.cwd(), `${new Date().toISOString().replace(/:/g, '-')}-${channel}.bak`)
        const channelSaveStream = createWriteStream(fileName, { flags: 'a' })
        this.redis.on('end', () => { channelSaveStream.end() })
        channelFileStreamMap.set(channel, channelSaveStream)
        this.log(`Saving messages to ${fileName}`)
      }
    })

    const pick = +this.flags.pick
    this.redis.on('message', (inChannel, message) => {
      const channelSpeed = speed.lap(inChannel)

      if (pick > 0 && (channelSpeed.total() % pick) === 0) {
        this.log(`Message on channel ${inChannel}, payload: ${message}`)
      }

      const fileStream = channelFileStreamMap.get(inChannel)
      if (fileStream && fileStream.writable) {
        fileStream.write(`${message}${os.EOL}`)
      }
    })
  }
}

Subscribe.flags = {
  ...RedisCommand.flags,
  channel: flags.string({
    char: 'c',
    description: 'the channel(s) to subscribe',
    required: true,
    multiple: true
  }),
  save: flags.boolean({
    char: 's',
    description: 'append the messages received to the file in cwd: %{ISO date}-%{channel name}.bak',
    default: false
  }),
  interval: flags.integer({
    char: 'i',
    description: 'show how many messages a channel received in <interval> time',
    default: 1000
  }),
  pick: flags.integer({
    char: 'n',
    description: 'print the message payload every <pick> messages received. 0 to turn off',
    default: 0
  })
}
Subscribe.description = 'subscribe to a redis channel and look inside of it'
Subscribe.aliases = ['sub']
Subscribe.usage = 'subscribe [OPTIONS]'
Subscribe.examples = [
  'Show the payload every 10 message received:',
  ' $ subscribe -H 192.169.99.100 -p 6970 --pick 10 -c my-channel',
  'Show how many messages are published by redis in 10 seconds:',
  ' $ subscribe -c my-channel --interval 10000',
  'Save all the messages to a file:',
  ' $ subscribe -c my-channel --save'
]

module.exports = Subscribe
