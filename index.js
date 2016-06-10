'use strict'

const PageStream = require('paged-http-stream')
const basic = require('basic-auth-header')
const through = require('through2')
const qs = require('querystring')

const TWILIO = 'https://api.twilio.com'

module.exports = Twilio

function Twilio (config) {
  const headers = {authorization: basic(config.sid, config.token)}

  return function TwilioStream (resource, options) {
    const initialPath = `/2010-04-01/Accounts/${config.sid}/${capitalize(resource)}.json`
    const uri = TWILIO + initialPath + queryString(options)

    return PageStream({uri: uri, headers}, next)
      .pipe(get(resource))
  }

  function next (data) {
    const nextPage = data.next_page_uri
    if (!nextPage) return null

    return {
      uri: TWILIO + nextPage,
      headers: headers
    }
  }
}

function get (resource) {
  return through.obj(function (page, enc, callback) {
    page[resource].forEach(this.push.bind(this))
    callback(null)
  })
}

function queryString (data) {
  if (!data) return ''
  if (Array.isArray(data)) return '?' + data.join('')
  if (!Object.keys(data).length) return ''
  return '?' + qs.stringify(data)
}

function capitalize (string) {
  return string[0].toUpperCase() + string.substring(1)
}
