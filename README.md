kingdis
=======

A CLI utility to work with redis

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/kingdis.svg)](https://npmjs.org/package/kingdis)
[![Build Status](https://travis-ci.com/Eomm/kingdis.svg?branch=master)](https://travis-ci.com/Eomm/kingdis)
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
kingdis/0.1.0 win32-x64 node-v10.11.0
$ kingdis --help [COMMAND]
USAGE
  $ kingdis COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`kingdis help [COMMAND]`](#kingdis-help-command)
* [`kingdis rpush [OPTIONS]`](#kingdis-rpush-options)
* [`kingdis publish [OPTIONS]`](#kingdis-publish-options)
* [`kingdis push [OPTIONS]`](#kingdis-push-options)
* [`kingdis rpush [OPTIONS]`](#kingdis-rpush-options-1)
* [`kingdis subscribe [OPTIONS]`](#kingdis-subscribe-options)

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

## `kingdis rpush [OPTIONS]`

lpush to a redis list from a file

```
USAGE
  $ kingdis rpush [OPTIONS]

OPTIONS
  -H, --host=host                  [default: 127.0.0.1] redis host
  -L, --list=list                  (required) the list where push the values
  -d, --db=db                      redis db
  -f, --file=file                  (required) the file to push. Each line will be a message

  -l, --line-handler=line-handler  a js file that must export a map function that receive a line in input and return a
                                   string

  -n, --pick=pick                  print the message payload every <pick> messages pushed. 0 to turn off

  -p, --port=port                  [default: 6379] redis port

  -u, --url=url                    redis:// URL connection

  -w, --password=password          redis auth password

DESCRIPTION
  ...
  checkout push command help for more info

EXAMPLES
  LPUSH a file to redis at port 6970:
    $ lpush -p 6970 -L my-list -f myFile.csv
  LPUSH a file and show the payload that is being processed by the line handler:
    $ lpush -L my-list --pick 1 -f myFile.csv -l ./script/my-transformation.js
```

_See code: [src\commands\lpush.js](https://github.com/Eomm/kingdis/blob/v0.1.0/src\commands\lpush.js)_

## `kingdis publish [OPTIONS]`

publish to a redis channel a file

```
USAGE
  $ kingdis publish [OPTIONS]

OPTIONS
  -H, --host=host                  [default: 127.0.0.1] redis host
  -c, --channel=channel            (required) the channel(s) where to publish the messages
  -d, --db=db                      redis db
  -f, --file=file                  (required) the file to publish. Each line will be a message

  -l, --line-handler=line-handler  a js file that must export a map function that receive a line in input and return a
                                   string

  -n, --pick=pick                  print the message payload every <pick> messages published. 0 to turn off

  -p, --port=port                  [default: 6379] redis port

  -u, --url=url                    redis:// URL connection

  -w, --password=password          redis auth password

DESCRIPTION
  ...
  Each line of the file will be read and submitted as-is in the redis' channels.

  Additionally you can transform each line with the line-handler. It must be a JavaScript file
  that export a sync function that receive the string line in input and must return a string:

  module.exports = function handler (line) {
     return JSON.stringify({ line })
  }

ALIASES
  $ kingdis pub

EXAMPLES
  Publish a file to redis at port 6970:
    $ publish -p 6970 -c my-channel -f myFile.csv
  Publish a file to multiple redis channels and show the payload that is being processed by the line handler:
    $ publish -c one -c two --pick 1 -f myFile.csv -l ./script/my-transformation.js
```

_See code: [src\commands\publish.js](https://github.com/Eomm/kingdis/blob/v0.1.0/src\commands\publish.js)_

## `kingdis push [OPTIONS]`

push to a redis list from a file

```
USAGE
  $ kingdis push [OPTIONS]

OPTIONS
  -H, --host=host                  [default: 127.0.0.1] redis host
  -L, --list=list                  (required) the list where push the values
  -S, --side=right|left            [default: right] the list side where push. Will direct RPUSH or LPUSH
  -d, --db=db                      redis db
  -f, --file=file                  (required) the file to push. Each line will be a message

  -l, --line-handler=line-handler  a js file that must export a map function that receive a line in input and return a
                                   string

  -n, --pick=pick                  print the message payload every <pick> messages pushed. 0 to turn off

  -p, --port=port                  [default: 6379] redis port

  -u, --url=url                    redis:// URL connection

  -w, --password=password          redis auth password

DESCRIPTION
  ...
  Each line of the file will be read and pushed as-is in the redis' list.

  Additionally you can transform each line with the line-handler. It must be a JavaScript file
  that export a sync function that receive the string line in input and must return a string:

  module.exports = function handler (line) {
     return JSON.stringify({ line })
  }

EXAMPLES
  Push a file to redis at port 6970:
    $ push -p 6970 -L my-list -f myFile.csv
  Push a file with LPUSH to redis:
    $ push -S left -L my-list -f myFile.csv
  Push a file and show the payload that is being processed by the line handler:
    $ push -L my-list --pick 1 -f myFile.csv -l ./script/my-transformation.js
```

_See code: [src\commands\push.js](https://github.com/Eomm/kingdis/blob/v0.1.0/src\commands\push.js)_

## `kingdis rpush [OPTIONS]`

rpush to a redis list from a file

```
USAGE
  $ kingdis rpush [OPTIONS]

OPTIONS
  -H, --host=host                  [default: 127.0.0.1] redis host
  -L, --list=list                  (required) the list where push the values
  -d, --db=db                      redis db
  -f, --file=file                  (required) the file to push. Each line will be a message

  -l, --line-handler=line-handler  a js file that must export a map function that receive a line in input and return a
                                   string

  -n, --pick=pick                  print the message payload every <pick> messages pushed. 0 to turn off

  -p, --port=port                  [default: 6379] redis port

  -u, --url=url                    redis:// URL connection

  -w, --password=password          redis auth password

DESCRIPTION
  ...
  checkout push command help for more info

EXAMPLES
  RPUSH a file to redis at port 6970:
    $ rpush -p 6970 -L my-list -f myFile.csv
  RPUSH a file and show the payload that is being processed by the line handler:
    $ push -L my-list --pick 1 -f myFile.csv -l ./script/my-transformation.js
```

_See code: [src\commands\rpush.js](https://github.com/Eomm/kingdis/blob/v0.1.0/src\commands\rpush.js)_

## `kingdis subscribe [OPTIONS]`

subscribe to a redis channel and look inside of it

```
USAGE
  $ kingdis subscribe [OPTIONS]

OPTIONS
  -H, --host=host          [default: 127.0.0.1] redis host
  -c, --channel=channel    (required) the channel(s) to subscribe
  -d, --db=db              redis db
  -i, --interval=interval  [default: 1000] show how many messages a channel received in <interval> time
  -n, --pick=pick          print the message payload every <pick> messages received. 0 to turn off
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
  Save all the messages to a file:
    $ subscribe -c my-channel --save
```

_See code: [src\commands\subscribe.js](https://github.com/Eomm/kingdis/blob/v0.1.0/src\commands\subscribe.js)_
<!-- commandsstop -->


## Why this name?

`redis` starts with `re` that in italian means `king`.. so: `kingdis`!


## License

Copyright [Manuel Spigolon](https://github.com/Eomm), Licensed under [MIT](./LICENSE).
