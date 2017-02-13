const test = require('tape')
const scout = require('../')
const fs = require('fs')

const spok = require('spok')

// eslint-disable-next-line no-unused-vars
const ocat = require('./util/ocat')
// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

test('\nscout self, not mutating', function(t) {
  const res = scout(scout)

  t.equal(res.scouted, undefined, 'does not include scouted object')
  t.equal(res.functions.length, 1, 'scouts the one function')
  spok(t, res.functions[0], {
       $topic: 'functions[0]'
      , path: []
      , key: spok.notDefined
      , level: 0
      , info: spok.defined
  })

  t.end()
})

test('\nscout self, mutating', function(t) {
  const res = scout(scout, { mutate: true })

  spok(t, res.scouted, {
      $topic: 'scouted'
    , file: spok.endsWith('function-scout.js')
    , line: spok.gtz
    , column: spok.gtz
    , inferredName: spok.string }
  )

  t.equal(res.functions.length, 1, 'scouts the one function')
  spok(t, res.functions[0], {
       $topic: 'functions[0]'
      , path: []
      , key: spok.notDefined
      , level: 0
      , info: res.scouted
  })

  t.end()
})

test('\nscout self inside an object, mutating', function(t) {
  const res = scout({ functionScout: scout }, { mutate: true })
  spok(t, res.scouted.functionScout, {
      $topic: 'scouted.functionScout'
    , file: spok.endsWith('function-scout.js')
    , line: spok.gtz
    , column: spok.gtz
    , inferredName: spok.string }
  )

  t.equal(res.functions.length, 1, 'scouts the one function')
  spok(t, res.functions[0],
    { $topic: 'functions[0]'
    , path: [ 'functionScout' ]
    , key: 'functionScout'
    , level: 1
    , info: res.scouted.functionScout
  })

  t.end()
})

test('\narray of two functions, functionScout and test, mutating', function(t) {
  const res = scout([ scout, test ], { mutate: true })
  spok(t, res.scouted[0], {
      $topic: 'scouted[0]'
    , file: spok.endsWith('function-scout.js')
    , line: spok.gtz
    , column: spok.gtz
    , inferredName: spok.string }
  )

  spok(t, res.scouted[1], {
      $topic: 'scouted[0]'
    , file: spok.endsWith('function-scout/node_modules/tape/index.js')
    , line: spok.gtz
    , column: spok.gtz
    , inferredName: 'module.exports.lazyLoad'
  })

  t.equal(res.functions.length, 2, 'scouts the two functions')
  spok(t, res.functions[0],
    { $topic: 'functions[0]'
    , path: [ '0' ]
    , key: '0'
    , level: 1
    , info: res.scouted[0]
  })
  spok(t, res.functions[1],
    { $topic: 'functions[1]'
    , path: [ '1' ]
    , key: '1'
    , level: 1
    , info: res.scouted[1]
  })

  t.end()
})

function ondata() { }
function onerror() { }
function onend() { }
const ondataLine = 112
const onerrorLine = ondataLine + 1
const onendLine = ondataLine + 2

test('\nreadstream, mutating', function(t) {
  const stream = fs.createReadStream(__filename)
    .on('data', ondata)
    .on('error', onerror)
    .on('end', onend)
  const res = scout(stream, { mutate: true })

  const events = res.scouted._events
  spok(t, events.end[0], {
      $topic: 'events[0].end[0]'
    , file: 'fs.js'
    , line: spok.gtz
    , column: spok.gtz
    , name: spok.string
    , inferredName: spok.string
  })

  spok(t, events.end[1], {
      $topic: 'events[0].end[1]'
    , file: spok.endsWith('function-scout.js')
    , line: onendLine
    , column: spok.gtz
    , name: 'onend'
    , inferredName: spok.string
  })

  spok(t, events.data, {
      $topic: 'events.data'
    , file: spok.endsWith('function-scout.js')
    , line: ondataLine
    , column: spok.gtz
    , name: 'ondata'
    , inferredName: spok.string
  })

  spok(t, events.error, {
      $topic: 'events.error'
    , file: spok.endsWith('function-scout.js')
    , line: onerrorLine
    , column: spok.gtz
    , name: 'onerror'
    , inferredName: spok.string
  })

  t.equal(res.functions.length, 4, 'scouts 4 functions, 2 end, data and error')

  spok(t, res.functions[0],
    { $topic: 'functions[0]'
    , path: [ '_events', 'end', '0' ]
    , key: '0'
    , level: 3
    , info: events.end[0]
  })

  spok(t, res.functions[1],
    { $topic: 'functions[1]'
    , path: [ '_events', 'end', '1' ]
    , key: '1'
    , level: 3
    , info: events.end[1]
  })

  spok(t, res.functions[2],
    { $topic: 'functions[2]'
    , path: [ '_events', 'data' ]
    , key: 'data'
    , level: 2
    , info: events.data
  })

  spok(t, res.functions[3],
    { $topic: 'functions[3]'
    , path: [ '_events', 'error' ]
    , key: 'error'
    , level: 2
    , info: events.error
  })
  t.end()
})

