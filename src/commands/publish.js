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
        this.log(`Sent ${total} lines to ${id} in ${deltaBeat / 1000} sec`)
      })
      delivery.chrono(channel, (id, counter, total, deltaBeat) => {
        this.log(`${total} subscribers received the messages from ${id} in ${deltaBeat / 1000} sec`)
      })
    })

    this.log(`Publishing ${this.flags.file} file`)
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
Publish.description = `publish to a redis channel a file
...
Each line of the file will be read and submitted as-is in the redis' channels.

Additionally you can transform each line with the line-handler. It must be a JavaScript file
that export a sync function that receive the string line in input and must return a string:

module.exports = function handler (line) {
  return JSON.stringify({ line })
}
`
Publish.aliases = ['pub']
Publish.usage = 'publish [OPTIONS]'
Publish.examples = [
  'Publish a file to redis at port 6970:',
  ' $ publish -p 6970 -c my-channel -f myFile.csv',
  'Publish a file to multiple redis channels and show the payload that is being processed by the line handler:',
  ' $ publish -c one -c two --pick 1 -f myFile.csv -l ./script/my-transformation.js'
]

module.exports = Publish
