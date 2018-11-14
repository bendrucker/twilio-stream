'use strict'

const test = require('tape-catch')
const nock = require('nock')
const Twilio = require('./')

const twilio = nock('https://api.twilio.com')

test('emits a twilio resource as object stream chunks', function (t) {
  t.plan(1)

  const fetch = Twilio({
    sid: 'theSid',
    token: 'theToken'
  })

  twilio
    .get('/2010-04-01/Accounts/theSid/Messages.json')
    .basicAuth({
      user: 'theSid',
      pass: 'theToken'
    })
    .reply(200, {
      messages: [{ body: 'Hello world!' }],
      next_page_uri: '/2010-04-01/Accounts/theSid/Messages.json?Page=1&PageSize=50&PageToken=abc'
    })

  twilio
    .get('/2010-04-01/Accounts/theSid/Messages.json')
    .query({
      Page: 1,
      PageSize: 50,
      PageToken: 'abc'
    })
    .basicAuth({
      user: 'theSid',
      pass: 'theToken'
    })
    .reply(200, {
      messages: [{ body: 'Hello world 2!' }],
      next_page_uri: null
    })

  const chunks = []
  fetch('messages')
    .on('data', chunks.push.bind(chunks))
    .on('error', t.end)
    .on('end', function () {
      t.deepEqual(chunks, [
        { body: 'Hello world!' },
        { body: 'Hello world 2!' }
      ])
    })
})

test('supports custom queries via objects', function (t) {
  t.plan(1)

  const fetch = Twilio({
    sid: 'theSid',
    token: 'theToken'
  })

  twilio
    .get('/2010-04-01/Accounts/theSid/Messages.json')
    .query({
      DateSent: '2016-06-09'
    })
    .basicAuth({
      user: 'theSid',
      pass: 'theToken'
    })
    .reply(200, {
      messages: [{ body: 'Hello world!' }],
      next_page_uri: '/2010-04-01/Accounts/theSid/Messages.json?Page=1&PageSize=50&PageToken=abc'
    })

  twilio
    .get('/2010-04-01/Accounts/theSid/Messages.json')
    .query({
      Page: 1,
      PageSize: 50,
      PageToken: 'abc'
    })
    .basicAuth({
      user: 'theSid',
      pass: 'theToken'
    })
    .reply(200, {
      messages: [{ body: 'Hello world 2!' }],
      next_page_uri: null
    })

  const chunks = []
  fetch('messages', { DateSent: '2016-06-09' })
    .on('data', chunks.push.bind(chunks))
    .on('error', t.end)
    .on('end', function () {
      t.deepEqual(chunks, [
        { body: 'Hello world!' },
        { body: 'Hello world 2!' }
      ])
    })
})

test('supports custom inequality queries via arrays', function (t) {
  t.plan(1)

  const fetch = Twilio({
    sid: 'theSid',
    token: 'theToken'
  })

  twilio
    .get('/2010-04-01/Accounts/theSid/Messages.json')
    .query({
      'DateSent>': '2016-06-09'
    })
    .basicAuth({
      user: 'theSid',
      pass: 'theToken'
    })
    .reply(200, {
      messages: [{ body: 'Hello world!' }],
      next_page_uri: '/2010-04-01/Accounts/theSid/Messages.json?Page=1&PageSize=50&PageToken=abc'
    })

  twilio
    .get('/2010-04-01/Accounts/theSid/Messages.json')
    .query({
      Page: 1,
      PageSize: 50,
      PageToken: 'abc'
    })
    .basicAuth({
      user: 'theSid',
      pass: 'theToken'
    })
    .reply(200, {
      messages: [{ body: 'Hello world 2!' }],
      next_page_uri: null
    })

  const chunks = []
  fetch('messages', ['DateSent>=2016-06-09'])
    .on('data', chunks.push.bind(chunks))
    .on('error', t.end)
    .on('end', function () {
      t.deepEqual(chunks, [
        { body: 'Hello world!' },
        { body: 'Hello world 2!' }
      ])
    })
})
