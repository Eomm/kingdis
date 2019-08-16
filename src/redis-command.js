'use strict'

const { once } = require('events')

const { Command, flags } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const { cli } = require('cli-ux')

const Redis = require('ioredis')

class RedisCommand extends Command {
  async init () {
    const { flags } = this.parse(this.constructor)
    this.flags = flags

    let redis
    if (flags.url) {
      redis = new Redis(flags.url)
    } else {
      redis = new Redis({
        host: flags.host,
        port: flags.port,
        password: flags.password,
        db: flags.db,
        lazyConnect: true,
        maxRetriesPerRequest: null,
        keepAlive: 10000
      })
    }

    try {
      redis.on('ready', () => {
        process.once('SIGINT', quit)
      })

      const connecting = redis.connect()

      if (once) {
        // only node >=11
        // this wrap is needed to get meaningful error message
        connecting.catch(() => {})
        await once(redis, 'ready')
      } else {
        redis.once('error', (detailedError) => {
          this.log(detailedError.message)
        })
        await connecting
      }

      this.log('Connected to redis')
      this.redis = redis
    } catch (error) {
      throw new CLIError(`failed to connect: ${error.message}`)
    }

    function quit () {
      redis.quit()
    }
  }

  // handle any error from the command
  // async catch (err) {
  //   console.log('catch - ' + err)
  // }

  // called after run and catch regardless of whether or not the command errored
  // async finally (err) {
  //   console.log('finally - ' + err)
  // }
}

RedisCommand.flags = {
  url: flags.string({
    char: 'u',
    description: 'redis:// URL connection',
    env: 'REDIS_URL',
    exclusive: ['host', 'port', 'auth', 'db']
  }),
  host: flags.string({
    char: 'H',
    description: 'redis host',
    env: 'REDIS_HOST',
    default: '127.0.0.1',
    exclusive: ['url']
  }),
  port: flags.string({
    char: 'p',
    description: 'redis port',
    env: 'REDIS_PORT',
    default: '6379',
    exclusive: ['url']
  }),
  password: flags.string({
    char: 'w',
    description: 'redis auth password',
    env: 'REDIS_PASSWORD',
    dependsOn: ['host'],
    exclusive: ['url']
  }),
  db: flags.string({
    char: 'd',
    description: 'redis db',
    env: 'REDIS_DB',
    default: '0',
    dependsOn: ['host'],
    exclusive: ['url']
  })
}

module.exports = RedisCommand
