
var algebraGroup = require('./index'),
    test         = require('tape')

var zero = 0

function contains (a) {
  return typeof a === 'number'

// TODO use Number.isInteger
}

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

var Z = algebraGroup(contains, zero, equality, addition, negation)

test('example', function (t) {
  t.plan(1)

  t.ok(Z.equality(Z.subtraction(2, 2), Z.zero))
})

