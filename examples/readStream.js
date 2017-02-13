function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

const fs = require('fs')
const scout = require('../')

function ondata() { }
function onerror() { }
function onend() { }

const stream = fs.createReadStream(__filename)
  .on('data', ondata)
  .on('error', onerror)
  .on('end', onend)
const res = scout(stream, { mutate: true })
inspect(res)

/*
{ scouted:
   ReadStream {
     _readableState:
      ReadableState { ...},
     readable: true,
     domain: null,
     _events:
      { end:
         [ FunctionOrigin {
             file: 'fs.js',
             line: 1905,
             column: 25,
             inferredName: '',
             name: '' },
           FunctionOrigin {
             file: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
             line: 10,
             column: 14,
             inferredName: '',
             name: 'onend' } ],
        data:
         FunctionOrigin {
           file: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
           line: 8,
           column: 15,
           inferredName: '',
           name: 'ondata' },
        error:
         FunctionOrigin {
           file: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
           line: 9,
           column: 16,
           inferredName: '',
           name: 'onerror' } },
     _eventsCount: 3,
     path: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
     ...
    },
  functions:
   [ { path: [ '_events', 'end', '0' ],
       key: '0',
       level: 3,
       info:
        FunctionOrigin {
          file: 'fs.js',
          line: 1905,
          column: 25,
          inferredName: '',
          name: '' } },
     { path: [ '_events', 'end', '1' ],
       key: '1',
       level: 3,
       info:
        FunctionOrigin {
          file: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
          line: 10,
          column: 14,
          inferredName: '',
          name: 'onend' } },
     { path: [ '_events', 'data' ],
       key: 'data',
       level: 2,
       info:
        FunctionOrigin {
          file: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
          line: 8,
          column: 15,
          inferredName: '',
          name: 'ondata' } },
     { path: [ '_events', 'error' ],
       key: 'error',
       level: 2,
       info:
        FunctionOrigin {
          file: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
          line: 9,
          column: 16,
          inferredName: '',
          name: 'onerror' } } ] }
*/
