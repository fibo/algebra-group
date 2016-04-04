var algebraGroup = require('./index')
var test = require('tape')

var error = algebraGroup.error

function isInteger (n) {
  return (typeof n === 'number') && isFinite(n) && (n % 1 === 0)
}

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

var Z = algebraGroup({
  identity: 0,
  contains: isInteger,
  equality: equality,
  compositionLaw: addition,
  inversion: negation
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

function isRealAndNotZero (n) {
  // NaN, Infinity and -Infinity are not allowed
  return (typeof n === 'number') && (n !== 0) && isFinite(n)
}

function multiplication (a, b) { return a * b }

function inversion (a) { return 1 / a }

var R = algebraGroup({
  identity: 1,
  contains: isRealAndNotZero,
  equality: equality,
  compositionLaw: multiplication,
  inversion: inversion
}, {
  compositionLaw: 'multiplication',
  identity: 'one',
  inverseCompositionLaw: 'division',
  inversion: 'inversion'
})

test('R\\{0} multiplicative group', function (t) {
  t.plan(5)

  t.ok(R.contains(10))
  t.ok(R.contains(Math.PI, Math.E, 1.7, -100))
  t.ok(R.notContains(Infinity))

  t.equal(R.inversion(2), 0.5)

  t.ok(R.equality(R.multiplication(2, 3, 5), R.division(60, 2)))
})

function isRealAndPositive (n) {
  // NaN, Infinity are not allowed
  return (typeof n === 'number') && (n > 0) && isFinite(n)
}

var Rp = algebraGroup({
  identity: 1,
  contains: isRealAndPositive,
  equality: equality,
  compositionLaw: multiplication,
  inversion: inversion
}, {
  compositionLaw: 'mul',
  equality: 'eq',
  identity: 'one',
  inverseCompositionLaw: 'div',
  inversion: 'inv'
})

test('R+ multiplicative group', function (t) {
  t.plan(4)

  t.ok(Rp.contains(Math.PI))
  t.ok(Rp.notContains(-1))
  t.ok(Rp.eq(Rp.inv(4), Rp.div(Rp.one, 4)))
  t.equal(Rp.mul(2, 4), 8)
})

function isFunctionOverR (fn) {
  return (typeof fn === 'function') && (typeof fn(Math.random()) === 'number')
}

function fnComposition (a, b) {
  return function (x) {
    return a(b(x))
  }
}

function fnInversion (fn) {
  return function (x) {
    return 1 / fn(x)
  }
}

// This is not possible for current computers: two functions are equal if for every real
// number their values are equal.
function fnEquality (a, b) {
  var x = Math.random()

  return a(x) === b(x)
}

var F = algebraGroup({
  identity: function (x) { return x },
  contains: isFunctionOverR,
  equality: fnEquality,
  compositionLaw: fnComposition,
  inversion: fnInversion
}, {
  compositionLaw: 'o',
  equality: 'eq',
  identity: 'id',
  inversion: 'inv'
})

test('Functions over R∞', function (t) {
  t.plan(1)

  t.ok(F.eq(F.o(Math.cos, F.id), Math.cos))
})

test('Errors', function (t) {
  t.plan(5)

  t.throws(function () {
    algebraGroup({
      identity: -1,
      contains: isRealAndPositive,
      equality: equality,
      compositionLaw: multiplication,
      inversion: inversion
    })
  }, new RegExp(error.identityIsNotInGroup))

  t.throws(function () {
    algebraGroup({
      identity: 2,
      contains: isRealAndNotZero,
      equality: equality,
      compositionLaw: multiplication,
      inversion: inversion
    })
  }, new RegExp(error.identityIsNotNeutral))

  t.throws(function () {
    algebraGroup({
      identity: 1,
      contains: isRealAndNotZero,
      equality: function (a, b) { return a > b }, // not well defined
      compositionLaw: multiplication,
      inversion: inversion
    })
  }, new RegExp(error.equalityIsNotReflexive))

  t.throws(function () {
    R.inversion(0) // 0 is not in group R\{0}
  }, new RegExp(error.argumentIsNotInGroup))

  t.throws(function () {
    Rp.mul(1, 0.1, -1, 0.5) // -1 is not in R+
  }, new RegExp(error.argumentIsNotInGroup))
})
