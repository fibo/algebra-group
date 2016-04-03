var packageName = 'algebra-group'

var error = {
  argumentIsNotInGroup: function (err) {
    return packageName + ': "' + err.op +
      '" must be called with arguments contained in group set'
  },
  resultIsNotInGroup: function (err) {
    return packageName + ': "' + err.op +
      '" must return value contained in group set'
  },
  equalityDoesNotReturnBoolean: packageName + ': "equality" must return boolean value',
  identityIsNotInGroup: packageName + ': "identity" must be contained in group set',
  identityIsNotNeutral: packageName + ': "identity" is not neutral'
}

function buildError (type, err) {
  if (typeof error[type] === 'function') {
    return error[type](err)
  } else {
    return error[type]
  }
}

/**
 * given an algebra group structure
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
 * @param {String} [naming.compositionLaw=addition]
 * @param {String} [naming.inversion=negation]
 * @param {String} [naming.inverseCompositionLaw=subtraction]
 * @param {String} [naming.notContains=notContains]
 *
 * @returns {Object} group
 */

function algebraGroup (given, naming) {
  var group = {}

  if (typeof given === 'undefined') {
    given = {}
  }

  if (typeof naming === 'undefined') {
    naming = {}
  }

  // default attribute naming

  var defaultNaming = {
    compositionLaw: 'addition',
    identity: 'zero',
    inverseCompositionLaw: 'subtraction',
    inversion: 'negation'
  }

  function prop (name) {
    if (typeof naming[name] === 'string') {
      return naming[name]
    }

    if (typeof defaultNaming[name] === 'string') {
      return defaultNaming[name]
    }

    return name
  }

  function secureOperationCreator (ops, opName, arity, resultValidator) {
    return function () {
      var args = [].slice.call(arguments, 0, arity)
      var err = !contains.apply(null, args)
      if (err) {
        throw new TypeError(buildError('argumentIsNotInGroup', {op: opName}))
      }

      var result = ops[opName].apply(null, args)
      if (!resultValidator.validate(result)) {
        throw new TypeError(buildError(resultValidator.error, {op: opName}))
      }
      return result
    }
  }

  // operators

  var groupValidator = {
    validate: given.contains,
    error: 'resultIsNotInGroup'
  }

  var secureCompositionLaw = secureOperationCreator(given, 'compositionLaw', 2, groupValidator)
  var secureInversion = secureOperationCreator(given, 'inversion', 1, groupValidator)

  function compositionLaw () {
    return [].slice.call(arguments).reduce(secureCompositionLaw)
  }

  function contains () {
    var arg = [].slice.call(arguments)
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
    var rest = [].slice.call(arguments, 1)

    return secureCompositionLaw(a, rest.map(secureInversion).reduce(secureCompositionLaw))
  }

  group[prop('contains')] = contains
  group[prop('notContains')] = notContains
  group[prop('compositionLaw')] = compositionLaw
  group[prop('inversion')] = secureInversion
  group[prop('inverseCompositionLaw')] = inverseCompositionLaw
  group[prop('equality')] = given.equality
  group[prop('disequality')] = disequality

  // identity element
  var e = given.identity

  if (!given.contains(e)) {
    throw new TypeError(buildError('identityIsNotInGroup'))
  }

  // Check that e+e=e.
  if (!given.equality(given.compositionLaw(e, e), e)) {
    throw new TypeError(buildError('identityIsNotNeutral'))
  }

  // Check that e===e.
  if (given.equality(e, e) !== true) {
    throw new TypeError(buildError('equalityDoesNotReturnBoolean'))
  }

  group[prop('identity')] = e

  return group
}

module.exports = algebraGroup
