kingdis
=======

A CLI utility to work with redis

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/kingdis.svg)](https://npmjs.org/package/kingdis)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/Eomm/kingdis?branch=master&svg=true)](https://ci.appveyor.com/project/Eomm/kingdis/branch/master)
[![Downloads/week](https://img.shields.io/npm/dw/kingdis.svg)](https://npmjs.org/package/kingdis)
[![License](https://img.shields.io/npm/l/kingdis.svg)](https://github.com/Eomm/kingdis/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g kingdis
$ kingdis COMMAND
running command...
$ kingdis (-v|--version|version)
kingdis/0.0.1 win32-x64 node-v10.11.0
$ kingdis --help [COMMAND]
USAGE
  $ kingdis COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`kingdis help [COMMAND]`](#kingdis-help-command)
* [`kingdis publish -c one -c two`](#kingdis-publish--c-one--c-two)
* [`kingdis subscribe -c one -c two`](#kingdis-subscribe--c-one--c-two)

## `kingdis help [COMMAND]`

display help for kingdis

```
USAGE
  $ kingdis help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src\commands\help.ts)_

## `kingdis publish -c one -c two`

publish to a redis channel a message-file

```
USAGE
  $ kingdis publish -c one -c two

OPTIONS
  -H, --host=host          [default: 127.0.0.1] redis host
  -c, --channel=channel    (required) the channel(s) where to publish the messages
  -d, --db=db              [default: 0] redis db
  -f, --file=file          (required) the file to publish. Each line will be a message
  -n, --pick=pick          [default: 0] print the message payload every <pick> messages published. 0 to turn off
  -p, --port=port          [default: 6379] redis port
  -u, --url=url            redis:// URL connection
  -w, --password=password  redis auth password

DESCRIPTION
  ...
  Extra documentation goes here

ALIASES
  $ kingdis pub

EXAMPLES
  Show the payload every 10 message received:
    $ subscribe -H 192.169.99.100 -p 6970 --pick 10 -c my-channel
  Show how many messages are published by redis in 10 seconds:
    $ subscribe -c my-channel --interval 10000
```

_See code: [src\commands\publish.js](https://github.com/Eomm/kingdis/blob/v0.0.1/src\commands\publish.js)_

## `kingdis subscribe -c one -c two`

subscribe to a redis channel and look inside of it

```
USAGE
  $ kingdis subscribe -c one -c two

OPTIONS
  -H, --host=host          [default: 127.0.0.1] redis host
  -c, --channel=channel    (required) the channel(s) to subscribe
  -d, --db=db              [default: 0] redis db
  -i, --interval=interval  [default: 1000] show how many messages a channel received in <interval> time
  -n, --pick=pick          [default: 0] print the message payload every <pick> messages received. 0 to turn off
  -p, --port=port          [default: 6379] redis port
  -s, --save               append the messages received to the file in cwd: %{ISO date}-%{channel name}.bak
  -u, --url=url            redis:// URL connection
  -w, --password=password  redis auth password

ALIASES
  $ kingdis sub

EXAMPLES
  Show the payload every 10 message received:
    $ subscribe -H 192.169.99.100 -p 6970 --pick 10 -c my-channel
  Show how many messages are published by redis in 10 seconds:
    $ subscribe -c my-channel --interval 10000
```

_See code: [src\commands\subscribe.js](https://github.com/Eomm/kingdis/blob/v0.0.1/src\commands\subscribe.js)_
<!-- commandsstop -->
