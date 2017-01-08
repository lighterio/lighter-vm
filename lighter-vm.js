'use strict'
var vm = require('vm')
var cache = require('lighter-lru-cache').shared
var isIstanbul = process.env.running_under_istanbul

/**
 * Run a piece of code with an optional path for exception handling.
 *
 * @param  {String} code     A piece of JavaScript code to run.
 * @param  {String} path     An optional path for the file, used for debugging, etc.
 * @param  {Object} context  An optional context to run in.
 * @return {Any}             The value extracted from the scripts context.
 */
var run = exports.run = function run (code, path, context) {
  path = (path || 'src' + (++run._id)) + '.vm.js'
  context = context || run._context
  var key = (path[0] === '/') ? path : '/tmp/' + path
  /* istanbul ignore next */
  if (isIstanbul) {
    code = code.replace(/__cov_.*?\+\+[,;]/g, '')
  }
  var src = 'var o=' + code
  cache.set(key, src)
  try {
    vm.runInNewContext(src, context, key)
  } catch (e) {
    e.message += '\n' + code
    throw e
  }
  return context.o
}

// Enable auto-incrementing of auto-generated code paths.
run._id = 0

// Default context for running code.
run._context = {
  window: {},
  console: console
}
