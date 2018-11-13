# twilio-stream [![Build Status](https://travis-ci.org/bendrucker/twilio-stream.svg?branch=master)](https://travis-ci.org/bendrucker/twilio-stream) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/twilio-stream.svg)](https://greenkeeper.io/)

> Generate an object stream of paginated Twilio results


## Install

```
$ npm install --save twilio-stream
```


## Usage

```sh
twilio messages --sid=mySid --token=myToken --query='["DateSent>=2016-06-09"]'
```

```js
var twilo = require('twilio-stream')({
  sid: 'mySid',
  token: 'myToken'
})

twilio('messages')
  .on('data', (message) => console.log(message))
```

## CLI

#### `twilio <resource>`

Streams the named source (e.g. `messages`) from Twilio.

##### --sid

The Twilio account SID, which can also be configured with a `TWILIO_SID` environment variable.

##### --token

The Twilio API SID, which can also be configured with a `TWILIO_TOKEN` environment variable.

##### --json, --csv

Formats the output as a JSON array or as CSV rows. Defaults to JSON.

##### --query

A JSON string of query options parsed by the library and sent to Twilio's API.


## API

#### `twilio(resource, [options])` -> `stream`

Fetches the given Twilio resource and returns a readable object stream.

##### resource

*Required*  
Type: `string`

A Twilio resource, e.g. `messages` or `calls`.

##### options

Type: `object / array`  
Default: `{}`

Query options to pass to Twilio's API to limit the results.

Simple queries can be built with objects:

```js
twilio('messages', {DateSent: '06-09-2016'})
```

Complex queries can be built using arrays:

```
twilio('messages', ['DateSent>=06-09-2016'])
```


## License

MIT © [Ben Drucker](http://bendrucker.me)
