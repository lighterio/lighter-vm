/* global describe it */

var vm = require('../lighter-vm')
var is = global.is || require('exam/lib/is')

describe('vm.run', function () {
  it('executes code', function () {
    var fn = vm.run('function(){return 1}')
    is.function(fn)
    var n = fn()
    is(n, 1)
  })

  it('accepts virtual paths', function () {
    var fn = vm.run('function(){return 1}', '/tmp/fn.js')
    is.function(fn)
    var n = fn()
    is(n, 1)
  })

  it('throws errors', function () {
    var error
    try {
      vm.run('a b c')
      is.fail()
    } catch (e) {
      error = e
    }
    is.object(error)
  })
})
