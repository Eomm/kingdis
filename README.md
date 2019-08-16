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
* [`kingdis hello`](#kingdis-hello)
* [`kingdis help [COMMAND]`](#kingdis-help-command)
* [`kingdis mycommand --myflag`](#kingdis-mycommand---myflag)

## `kingdis hello`

Describe the command here

```
USAGE
  $ kingdis hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src\commands\hello.js](https://github.com/Eomm/kingdis/blob/v0.0.1/src\commands\hello.js)_

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

## `kingdis mycommand --myflag`

description of this example command

```
USAGE
  $ kingdis mycommand --myflag

ALIASES
  $ kingdis sub

EXAMPLES
  $ mycommand --force
  $ mycommand --help
```

_See code: [src\commands\subscribe.js](https://github.com/Eomm/kingdis/blob/v0.0.1/src\commands\subscribe.js)_
<!-- commandsstop -->
