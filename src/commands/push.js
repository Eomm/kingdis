'use strict'

const { createReadStream } = require('fs')
const es = require('event-stream')

const { flags } = require('@oclif/command')

const { speedBeat } = require('speed-beat')

const RedisCommand = require('../redis-command')
const lineHandler = require('../line-handler')

class Push extends RedisCommand {
  async init () {
    await super.init()
    this.selectSide()
  }

  selectSide () {
    this.pushFn = this.flags.side === 'right'
      ? this.redis.rpush.bind(this.redis)
      : this.redis.lpush.bind(this.redis)
  }

  async run () {
    const speed = speedBeat()

    const list = this.flags.list
    const pick = +this.flags.pick
    const transformation = lineHandler(this.flags['line-handler'])
    const fileStream = createReadStream(this.flags.file, 'utf8')

    speed.chrono(list, (id, counter, total, deltaBeat) => {
      this.log(`Pushed ${counter} lines to ${id} in ${deltaBeat / 1000} sec`)
    })

    this.log(`Pushing to ${this.flags.side} the ${this.flags.file} file`)
    fileStream
      .pipe(es.split())
      .pipe(es.map((readLine, cb) => {
        const line = transformation(readLine)

        this.pushFn(list, line)
          .then(lengthListAfterPush => {
            const status = speed.lap(list)

            if (pick > 0 && (status.total() % pick) === 0) {
              this.log(`Pushed line ${status.total()} on list [${list}]. Total length ${lengthListAfterPush}, payload: ${line}`)
            }

            cb(null, line)
          })
          .catch(() => { cb(null, line) }) // TODO ignore?
      }))
      .pipe(es.wait((err) => {
        if (err) {
          this.warn(err)
        }

        speed.finish()
        this.redis.quit()
      }))
  }
}

Push.flags = {
  ...RedisCommand.flags,
  list: flags.string({
    char: 'L',
    description: 'the list where push the values',
    required: true
  }),
  file: flags.string({
    char: 'f',
    description: 'the file to push. Each line will be a message',
    required: true
  }),
  side: flags.string({
    char: 'S',
    description: 'the list side where push. Will direct RPUSH or LPUSH',
    options: ['right', 'left'],
    default: 'right'
  }),
  'line-handler': flags.string({
    char: 'l',
    description: 'a js file that must export a map function that receive a line in input and return a string'
  }),
  pick: flags.integer({
    char: 'n',
    description: 'print the message payload every <pick> messages pushed. 0 to turn off',
    default: 0
  })
}
Push.description = `push to a redis list from a file
...
Each line of the file will be read and pushed as-is in the redis' list.

Additionally you can transform each line with the line-handler. It must be a JavaScript file
that export a sync function that receive the string line in input and must return a string:

module.exports = function handler (line) {
  return JSON.stringify({ line })
}
`
Push.usage = 'push [OPTIONS]'
Push.examples = [
  'Push a file to redis at port 6970:',
  ' $ push -p 6970 -L my-list -f myFile.csv',
  'Push a file with LPUSH to redis:',
  ' $ push -S left -L my-list -f myFile.csv',
  'Push a file and show the payload that is being processed by the line handler:',
  ' $ push -f myFile.csv -L my-list --pick 1 -l ./script/my-transformation.js'
]

module.exports = Push
