var algebraGroup = require('./index')
var test = require('tape')

var zero = 0

function isInteger (n) {
  return (typeof n === 'number') && isFinite(n) && (n % 1 === 0)
}

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

var Z = algebraGroup({
  identity: zero,
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

function isReal (n) {
  return (typeof n === 'number') && isFinite(n)
}

function multiplication (a, b) { return a * b }

function inversion (a) { return 1 / a }

var R = algebraGroup({
  identity: 1,
  contains: isReal,
  equality: equality,
  compositionLaw: multiplication,
  inversion: inversion
}, {
  compositionLaw: 'multiplication',
  identity: 'one',
  inverseCompositionLaw: 'division',
  inversion: 'inversion'
})

test('Real multiplicative group', function (t) {
  t.plan(5)

  t.ok(R.contains(10))
  t.ok(R.contains(Math.PI, Math.E, 0, 1.7, -100))
  t.ok(R.notContains(Infinity))

  t.equal(R.inversion(2), 0.5)

  t.ok(R.equality(R.multiplication(2, 3, 5), R.division(60, 2)))
})

function inRange (a, b) {
  return function (n) {
    return n > a && n <= b
  }
}

test('exceptions in sets that are not groups', function (t) {
  t.plan(3)

  t.throws(function () {
    algebraGroup({
      identity: 2,
      contains: inRange(0, 1),
      equality: equality,
      compositionLaw: multiplication,
      inversion: inversion
    }, {
      compositionLaw: 'multiplication',
      identity: 'one',
      inverseCompositionLaw: 'division',
      inversion: 'inversion'
    })
  }, new RegExp('algebra-group: "identity" must be contained in group set'))

  t.throws(function () {
    algebraGroup({
      identity: 2,
      contains: isReal,
      equality: equality,
      compositionLaw: multiplication,
      inversion: inversion
    }, {
      compositionLaw: 'multiplication',
      identity: 'one',
      inverseCompositionLaw: 'division',
      inversion: 'inversion'
    })
  }, new RegExp('algebra-group: "identity" is not neutral'))

  t.throws(function () {
    algebraGroup({
      identity: 1,
      contains: isReal,
      equality: function (a, b) {
        return a === b ? 'fizz' : 'buzz'
      },
      compositionLaw: multiplication,
      inversion: inversion
    }, {
      compositionLaw: 'multiplication',
      identity: 'one',
      inverseCompositionLaw: 'division',
      inversion: 'inversion'
    })
  }, new RegExp('algebra-group: "equality" must return boolean value'))
})

var RfromZeroToOne = algebraGroup({
  identity: 1,
  contains: inRange(0, 1),
  equality: equality,
  compositionLaw: multiplication,
  inversion: inversion
}, {
  compositionLaw: 'multiplication',
  identity: 'one',
  inverseCompositionLaw: 'division',
  inversion: 'inversion'
})

test('Argument exceptions in (0,1] multiplicative group', function (t) {
  t.plan(8)

  t.notOk(RfromZeroToOne.contains(10), 'value greater than 1 is not contained in group')
  t.ok(RfromZeroToOne.contains(0.1, 1, 0.0001, 0.33), 'values between 0 and 1 are contained in group')
  t.ok(RfromZeroToOne.notContains(-Infinity), 'value less than or equal to 0 is not contained in group')
  t.notOk(RfromZeroToOne.notContains(0.8), 'notContains returns false with 0.8 argument')

  t.throws(function () {
    RfromZeroToOne.inversion(0)
  }, new RegExp('algebra-group: "inversion" must be called with arguments contained in group set'))

  t.throws(function () {
    RfromZeroToOne.multiplication(1, 0.1, 1.2, 0.5)
  }, new RegExp('algebra-group: "compositionLaw" must be called with arguments contained in group set'))

  // Derivated operations:

  t.throws(function () {
    RfromZeroToOne.division(1, 1, 1, 0)
  }, new RegExp('algebra-group: "inversion" must be called with arguments contained in group set'))

  t.throws(function () {
    RfromZeroToOne.division(0, 1, 1, 1)
  }, new RegExp('algebra-group: "compositionLaw" must be called with arguments contained in group set'))
})
