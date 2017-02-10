const traverse = require('traverse')
const functionOrigin = require('function-origin')

function scoutFunction(fn) {
  const origin = functionOrigin(fn)
  origin.name = fn.name
  origin.line = origin.line + 1
  return origin
}

/**
 * Scouts all functions in the provided object by traversing it.
 *
 * It returns an array of all functions found as `functions` and
 * the cloned object with all functions replaced with their information
 * as `scouted`
 *
 * A `functions` value looks like this:
 *
 * ```
 *  { path: [ '_events', 'end', '1' ],
 *    key: '1',
 *    level: 3,
 *    info:
 *    FunctionOrigin {
 *      file: '/Volumes/d/dev/js/async-hooks/function-scout/examples/readStream.js',
 *      line: 10,
 *      column: 14,
 *      inferredName: '',
 *      name: 'onend' } }
 * ```
 *
 * The `level, path` and `key` provide information about where in the object each
 * function was found.
 *
 * The `scouted` functions look the same except they don't have any `level, path, key`
 * information since they are still attached to the object.
 *
 * @name functionScout
 * @function
 * @param {Object} object the object which functions to scout
 * @return {Object} with properties `scouted` and `functions` explained above
 */
module.exports = function functionScout(object) {
  const functions = []

  function processNode(n) {
    const node = this.node
    if (typeof node !== 'function') return
    const info = scoutFunction(node)
    functions.push({ path: this.path, key: this.key, level: this.level, info: info })
    this.update(info)
  }

  const scouted = traverse(object).map(processNode)
  return { scouted, functions }
}

// Test
// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

function ondata() { }
function onerror() { }
function onend() { }
if (!module.parent && typeof window === 'undefined') {
  const fs = require('fs')
  const stream = fs.createReadStream(__filename)
    .on('data', ondata)
    .on('error', onerror)
    .on('end', onend)

  const res = module.exports(stream)
  inspect(res)
}
