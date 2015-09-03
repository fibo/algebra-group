
/**
 * Define an algebra group structure
 *
 * @param {Object}   define
 * @param {*}        define.identity a.k.a zero
 * @param {Function} define.contains
 * @param {Function} define.equality
 * @param {Function} define.compositionLaw
 * @param {Function} define.inversion
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

function algebraGroup (define, naming) {
  var group = {}

  if (typeof define === 'undefined') define = {}

  if (typeof naming === 'undefined') naming = {}

  // default attribute naming

  var defaultNaming = {
    compositionLaw        : 'addition',
    identity              : 'zero',
    inverseCompositionLaw : 'subtraction',
    inversion             : 'negation'
  }

  function prop (name) {
    if (typeof naming[name] === 'string')
      return naming[name]

    if (typeof defaultNaming[name] === 'string')
      return defaultNaming[name]

    return name
  }

  // operators
  function compositionLaw () {
    return [].slice.call(arguments).reduce(define.compositionLaw)
  }

  function contains () {
    var arg = [].slice.call(arguments)

    for (var i in arg)
      if (! define.contains(arg[i]))
        return false

       return true
  }

  function notContains (a) { return ! contains(a) }

  function equality () {
    return [].slice.call(arguments).reduce(define.equality, [])
  }

  function disequality (a, b) { return ! equality.apply(arguments) }

  function inverseCompositionLaw (a) {
    var rest = [].slice.call(arguments, 1)

    return compositionLaw(a, rest.map(define.inversion).reduce(define.compositionLaw))
  }

  group[prop('contains')]              = contains
  group[prop('notContains')]           = notContains
  group[prop('compositionLaw')]        = compositionLaw
  group[prop('inversion')]             = define.inversion
  group[prop('inverseCompositionLaw')] = inverseCompositionLaw
  group[prop('equality')]              = define.equality
  group[prop('disequality')]           = disequality

  // identity element
  var e = define.identity

  if (notContains(e))
    throw new TypeError('"identity" must be contained in group set')

  // Check that e+e=e.
  if (disequality(define.compositionLaw(e, e), e))
    throw new TypeError('"identity" is not neutral')

  group[prop('identity')] = e

  return group
}

module.exports = algebraGroup

