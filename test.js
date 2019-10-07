const algebraGroup = require('algebra-group')
const test = require('tape')

const {
  ArgumentIsNotInGroupError,
  EqualityIsNotReflexiveError,
  IdentityIsNotInGroupError,
  IdentityIsNotNeutralError
} = algebraGroup.errors

const zero = 0

function isInteger (n) {
  return (typeof n === 'number') && isFinite(n) && (n % 1 === 0)
}

function integerEquality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

const Z = algebraGroup({
  identity: zero,
  contains: isInteger,
  equality: integerEquality,
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

function realEquality (a, b) {
  // Consider
  //
  //     0.1 + 0.2 === 0.3
  //
  // It evaluates to false. Actually the expression
  //
  //     0.1 + 0.2
  //
  // will return
  //
  //     0.30000000000000004
  //
  // Hence we need to approximate equality with an epsilon.

  return Math.abs(a - b) < Number.EPSILON
}

const R = algebraGroup({
  identity: 1,
  contains: isRealAndNotZero,
  equality: realEquality,
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

const Rp = algebraGroup({
  identity: 1,
  contains: isRealAndPositive,
  equality: realEquality,
  compositionLaw: multiplication,
  inversion: inversion
}, {
  compositionLaw: 'mul',
  equality: 'eq',
  disequality: 'ne',
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

test('Errors', function (t) {
  t.plan(5)

  try {
    R.inversion(0) // 0 is not in group R\{0}
  } catch (error) {
    if (error instanceof ArgumentIsNotInGroupError) {
      t.ok('ArgumentIsNotInGroupError')
    }
  }

  try {
    Rp.mul(1, -1) // -1 is not in R+
  } catch (error) {
    if (error instanceof ArgumentIsNotInGroupError) {
      t.ok('ArgumentIsNotInGroupError')
    }
  }

  try {
    algebraGroup({
      identity: 1,
      contains: isRealAndNotZero,
      equality: function (a, b) { return a > b }, // not well defined
      compositionLaw: multiplication,
      inversion: inversion
    })
  } catch (error) {
    if (error instanceof EqualityIsNotReflexiveError) {
      t.ok('EqualityIsNotReflexiveError')
    }
  }

  try {
    algebraGroup({
      identity: -1,
      contains: isRealAndPositive,
      equality: realEquality,
      compositionLaw: multiplication,
      inversion: inversion
    })
  } catch (error) {
    if (error instanceof IdentityIsNotInGroupError) {
      t.ok('IdentityIsNotInGroupError')
    }
  }

  try {
    algebraGroup({
      identity: 2,
      contains: isRealAndNotZero,
      equality: realEquality,
      compositionLaw: multiplication,
      inversion: inversion
    })
  } catch (error) {
    if (error instanceof IdentityIsNotNeutralError) {
      t.ok('IdentityIsNotNeutralError')
    }
  }
})
