'use strict'

const { createReadStream } = require('fs')
const es = require('event-stream')

const { flags } = require('@oclif/command')

const { speedBeat } = require('speed-beat')

const RedisCommand = require('../redis-command')
const lineHandler = require('../line-handler')

class Publish extends RedisCommand {
  async run () {
    let publishedLines = 0
    const speed = speedBeat()
    const delivery = speedBeat()

    const redis = this.redis
    const channels = this.flags.channel
    const pick = +this.flags.pick
    const transformation = lineHandler(this.flags['line-handler'])
    const fileStream = createReadStream(this.flags.file, 'utf8')

    channels.forEach((channel) => {
      speed.chrono(channel, (id, counter, total, deltaBeat) => {
        // TODO
        console.log({ id, counter, total, deltaBeat })
      })
      delivery.chrono(channel, (id, counter, total, deltaBeat) => {
        // TODO
        console.log({ id, counter, total, deltaBeat })
      })
    })

    fileStream
      .pipe(es.split())
      .pipe(es.map((readLine, cb) => {
        const line = transformation(readLine)

        const p = channels.map((channel) => {
          return redis.publish(channel, line)
            .catch(() => 0)
            .then(listener => ({ channel, listener }))
        })

        Promise.all(p)
          .then(published => {
            published.forEach(({ channel, listener }) => {
              speed.lap(channel)
              delivery.lap(channel, listener)
            })

            publishedLines++

            if (pick > 0 && (publishedLines % pick) === 0) {
              this.log(`Published line ${publishedLines} on channels [${channels}], payload: ${line}`)
            }

            cb(null, line)
          })
      }))
      .pipe(es.wait((err) => {
        if (err) {
          this.warn(err)
        }

        speed.finish()
        delivery.finish()
        this.log(`Published ${publishedLines} lines`)
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
  'line-handler': flags.string({
    char: 'l',
    description: 'a js file that must export a map function that receive a line in input and return a string'
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
