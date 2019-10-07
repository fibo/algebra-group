const no = require('not-defined')
const staticProps = require('static-props')

class ArgumentIsNotInGroupError extends TypeError {
  constructor () { super('argument is not contained in group set') }
}

class EqualityIsNotReflexiveError extends TypeError {
  constructor () { super('"equality" is not reflexive') }
}

class IdentityIsNotInGroupError extends TypeError {
  constructor () { super('"identity" must be contained in group set') }
}

class IdentityIsNotNeutralError extends TypeError {
  constructor () { super('"identity" is not neutral') }
}

/**
 * Defines an algebra group structure
 *
 * @param {Object}   given
 * @param {*}        given.identity a.k.a neutral element
 * @param {Function} given.contains
 * @param {Function} given.equality
 * @param {Function} given.compositionLaw
 * @param {Function} given.inversion
 * @param {Object} [naming]
 * @param {String} [naming.identity=zero]
 * @param {String} [naming.contains=contains]
 * @param {String} [naming.equality=equality]
 * @param {String} [naming.disequality=disequality]
 * @param {String} [naming.compositionLaw=addition]
 * @param {String} [naming.inversion=negation]
 * @param {String} [naming.inverseCompositionLaw=subtraction]
 * @param {String} [naming.notContains=notContains]
 *
 * @returns {Object} group
 */

function algebraGroup (given, naming) {
  if (no(given)) given = {}
  if (no(naming)) naming = {}

  // default attribute naming

  const defaultNaming = {
    compositionLaw: 'addition',
    contains: 'contains',
    disequality: 'disequality',
    equality: 'equality',
    identity: 'zero',
    inverseCompositionLaw: 'subtraction',
    inversion: 'negation',
    notContains: 'notContains'
  }

  /**
   * Returns a prop custom name or its default
   *
   * @param {String} name
   *
   * @returns {String} actualName
   */

  function prop (name) {
    if (typeof naming[name] === 'string') return naming[name]
    else return defaultNaming[name]
  }

  /**
   * Wraps operator by checking if arguments are contained in group.
   *
   * @param {Object} given operators
   * @param {String} operator name
   * @param {Number} arity
   *
   * @returns {Function} internalOperator
   */

  function internalOperator (given, operator, arity) {
    return function () {
      const args = [].slice.call(arguments, 0, arity)

      if (contains.apply(null, args)) {
        return given[operator].apply(null, args)
      } else {
        throw new ArgumentIsNotInGroupError()
      }
    }
  }

  // operators

  const secureCompositionLaw = internalOperator(given, 'compositionLaw', 2)
  const secureInversion = internalOperator(given, 'inversion', 1)

  function compositionLaw () {
    return [].slice.call(arguments).reduce(secureCompositionLaw)
  }

  function contains () {
    const arg = [].slice.call(arguments)

    for (var i in arg) {
      if (!given.contains(arg[i])) {
        return false
      }
    }

    return true
  }

  function notContains (a) { return !contains(a) }

  function disequality (a, b) { return !given.equality(a, b) }

  function inverseCompositionLaw (a) {
    const rest = [].slice.call(arguments, 1)

    return secureCompositionLaw(a, rest.map(secureInversion).reduce(secureCompositionLaw))
  }

  // identity element
  const e = given.identity

  // Check that e=e.
  if (given.equality(e, e) !== true) {
    throw new EqualityIsNotReflexiveError()
  }

  if (!given.contains(e)) {
    throw new IdentityIsNotInGroupError()
  }

  // Check that e+e=e.
  if (!given.equality(given.compositionLaw(e, e), e)) {
    throw new IdentityIsNotNeutralError()
  }

  const definition = {}

  definition[prop('identity')] = e

  // Wrap functions otherwise staticProps will treat them as getters.
  definition[prop('contains')] = () => contains
  definition[prop('notContains')] = () => notContains
  definition[prop('compositionLaw')] = () => compositionLaw
  definition[prop('inversion')] = () => secureInversion
  definition[prop('inverseCompositionLaw')] = () => inverseCompositionLaw
  definition[prop('equality')] = () => given.equality
  definition[prop('disequality')] = () => disequality

  const group = {}

  // Add immutable props to group.
  staticProps(group)(definition)

  return group
}

const errors = {
  ArgumentIsNotInGroupError,
  EqualityIsNotReflexiveError,
  IdentityIsNotInGroupError,
  IdentityIsNotNeutralError
}

staticProps(algebraGroup)({ errors })

module.exports = exports.default = algebraGroup
