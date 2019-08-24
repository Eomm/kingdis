'use strict'

const PushCommand = require('./push')

class LPush extends PushCommand {
  async init () {
    await super.init()
    this.flags.side = 'left'
    this.selectSide()
  }
}

LPush.flags = {
  ...PushCommand.flags
}
delete LPush.flags.side
LPush.description = `lpush to a redis list from a file
...
checkout push command help for more info
`
LPush.usage = 'lpush [OPTIONS]'
LPush.examples = [
  'LPUSH a file to redis at port 6970:',
  ' $ lpush -p 6970 -L my-list -f myFile.csv',
  'LPUSH a file and show the payload that is being processed by the line handler:',
  ' $ lpush -f myFile.csv -L my-list --pick 1 -l ./script/my-transformation.js'
]

module.exports = LPush
