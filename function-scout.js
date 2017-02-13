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
 * The `scouted` object only is returned if `mutate=true` and has the resolved functions
 * attached to the paths of the object at which they were originally found.
 * By default `mutate=false` and thus only `functions` are returned.
 *
 * @name functionScout
 * @function
 * @param {Object} object the object which functions to scout
 * @param {Object} $0 configure how functions are scouted
 * @param {boolean} [$0.mutate=false] if `true` the `object` is cloned and then
 * the are functions replaced with the scouted versions on the returned
 * `scouted` object.
 * @return {Object} with properties `scouted` (if `mutate=true`) and
 * `functions` explained above
 */
module.exports = function functionScout(object, { mutate = false } = {}) {
  const functions = []

  function processNode(n) {
    const node = this.node
    if (typeof node !== 'function') return
    const info = scoutFunction(node)
    functions.push({ path: this.path, key: this.key, level: this.level, info: info })
    if (mutate) this.update(info)
  }

  // we don't mutate by default
  if (!mutate) {
    traverse(object).forEach(processNode)
    return { functions }
  }

  // mutate
  const scouted = traverse(object).map(processNode)
  return { scouted, functions }
}
