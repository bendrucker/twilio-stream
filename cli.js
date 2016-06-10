'use strict'

const meow = require('meow')
const assert = require('assert')
const JSONStream = require('JSONStream')
const csvStream = require('csv-write-stream')
const flat = require('flat')
const pumpify = require('pumpify')
const through = require('through2')
const Twilio = require('./')

const cli = meow(`
  Usage
    $ twilio <resource> --query=<query>

  Options
    --json Output as json
    --csv Output as csv

  Examples
    twilio messages --query='{"DateSent": "2016-06-09"}'
`)

const resource = cli.input[0]
const query = cli.flags.query ? JSON.parse(cli.flags.query) : false
const sid = cli.flags.sid || process.env.TWILIO_SID
const token = cli.flags.token || process.env.TWILIO_TOKEN

assert(resource, 'must define a twilio resource')
assert(sid, 'must define --sid or TWILIO_SID')
assert(token, 'must define --token or TWILIO_TOKEN')

const twilio = Twilio({sid: sid, token: token})

twilio(resource, query)
  .pipe(serialize(cli.flags))
  .pipe(process.stdout)

function serialize (options) {
  assert(!options.json || !options.json, 'only one format allowed (--json, --csv)')
  if (options.json || !options.csv) return JSONStream.stringify()
  return pumpify.obj(flatten(), csvStream())
}

function flatten () {
  return through.obj(function (obj, enc, callback) {
    callback(null, flat(obj, {
      delimiter: '_'
    }))
  })
}
