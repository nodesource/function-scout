const traverse = require('traverse')
const functionOrigin = require('function-origin')

function scoutFunction(fn) {
  const origin = functionOrigin(fn)
  origin.name = fn.name
  origin.line = origin.line + 1
  return origin
}

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
