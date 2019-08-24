'use strict'

const PushCommand = require('./push')

class RPush extends PushCommand {
  async init () {
    await super.init()
    this.flags.side = 'right'
    this.selectSide()
  }
}

RPush.flags = {
  ...PushCommand.flags
}
delete RPush.flags.side
RPush.description = `rpush to a redis list from a file
...
checkout push command help for more info
`
RPush.usage = 'rpush [OPTIONS]'
RPush.examples = [
  'RPUSH a file to redis at port 6970:',
  ' $ rpush -p 6970 -L my-list -f myFile.csv',
  'RPUSH a file and show the payload that is being processed by the line handler:',
  ' $ push -L my-list --pick 1 -f myFile.csv -l ./script/my-transformation.js'
]

module.exports = RPush
