
var algebraGroup = require('./index'),
    test         = require('tape')

var zero = 0

function contains (n) {
  // NaN, Infinity and -Infinity are not allowed
  return (typeof n === 'number') && isFinite(n) && (n % 1 === 0)
}

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

var Z = algebraGroup({
  identity       : zero,
  contains       : contains,
  equality       : equality,
  compositionLaw : addition,
  inversion      : negation
})

test('Integer additive group', function (t) {
  t.plan(4)

  t.equal(Z.addition(1, 2), 3)
  t.equal(Z.addition(1, 2, 3, 4), 10)

  t.equal(Z.negation(5), -5)

  t.ok(Z.equality(Z.subtraction(2, 2), Z.zero))
})

