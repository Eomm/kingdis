'use strict'

const { createReadStream } = require('fs')
const es = require('event-stream')

const { flags } = require('@oclif/command')

const { speedBeat } = require('speed-beat')

const RedisCommand = require('../redis-command')

class Publish extends RedisCommand {
  async run () {
    const speed = speedBeat()
    const channels = this.flags.channel

    // const processor = externalProcessor(args) // TODO

    const fileStream = createReadStream(this.flags.file, 'utf8')

    channels.forEach((channel) => {
      speed.chrono(channel, (id, counter, total, deltaBeat) => {
        // TODO
        console.log({ id, counter, total, deltaBeat })
      })
    })

    const redis = this.redis

    fileStream
      .pipe(es.split())
      .pipe(es.map(function (line, cb) {
        // do something with the line
        // const line = processor(msg) // TODO
        const p = channels.map((channel) => {
          speed.lap(channel)
          return redis.publish(channel, line)
        })

        Promise.all(p).then((res) => {
          console.log({ res })
          // this.log('The message %s has been received from %d subscriber', line, listenedFrom)
          cb(null, line)
        })
      }))
      .pipe(es.wait((err, body) => {
        // have complete text here.
        this.log('FINISHED')
        speed.finish()
        redis.quit()
      }))
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
