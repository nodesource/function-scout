function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

const path = require('path')
const scout = require('../')

const res = scout(path.basename)
inspect(res)

/*
 { scouted:
   FunctionOrigin {
     file: 'path.js',
     line: 1354,
     column: 29,
     inferredName: '',
     name: 'basename' },
  functions:
   [ { path: [],
       key: undefined,
       level: 0,
       info:
        FunctionOrigin {
          file: 'path.js',
          line: 1354,
          column: 29,
          inferredName: '',
          name: 'basename' } } ] }
*/
