
var algebraGroup = require('./index'),
    test         = require('tape')

var zero = 0

function isInteger (n) {
  return (typeof n === 'number') && isFinite(n) && (n % 1 === 0)
}

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

var Z = algebraGroup({
  identity       : zero,
  contains       : isInteger,
  equality       : equality,
  compositionLaw : addition,
  inversion      : negation
})

test('Integer additive group', function (t) {
  t.plan(12)

  t.ok(Z.contains(2))
  t.notOk(Z.contains(2.5))
  t.notOk(Z.contains('xxx'))
  t.ok(Z.notContains(Math.PI))
  t.ok(Z.contains(-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9))
  t.notOk(Z.contains(1, 2, 3, 4.5))

  t.equal(Z.addition(1, 2), 3)
  t.equal(Z.addition(1, 2, 3, 4), 10)

  t.equal(Z.negation(5), -5)

  t.equal(Z.subtraction(5, 1), 4)
  t.equal(Z.subtraction(5, 1, 1, 1, 1, 1), 0)

  t.ok(Z.equality(Z.subtraction(2, 2), Z.zero))
})

function isReal (n) {
  return (typeof n === 'number') && isFinite(n)
}

function multiplication (a, b) { return a * b }

function inversion (a) { return 1 / a }

var R = algebraGroup({
  identity       : 1,
  contains       : isReal,
  equality       : equality,
  compositionLaw : multiplication,
  inversion      : inversion
}, {
  compositionLaw       : 'multiplication',
  identity             : 'one',
  inverseCompositionLaw: 'division',
  inversion            : 'inversion'
})

test('Real multiplicative group', function (t) {
  t.plan(5)

  t.ok(R.contains(10))
  t.ok(R.contains(Math.PI, Math.E, 0, 1.7, -100))
  t.ok(R.notContains(Infinity))

  t.equal(R.inversion(2), 0.5)

  t.ok(R.equality(R.multiplication(2, 3, 5), R.division(60, 2)))
})

