
/**
 * Define an algebra group structure
 *
 * @param {Function} contains
 * @param {*} identity a.k.a zero
 * @param {Function} equality
 * @param {Function} addition a.k.a composition law
 * @param {Function} negation
 *
 * @returns {Object} group
 */

function algebraGroup (contains, identity, equality, addition, negation) {
  var group = {}

  // operators

  if (typeof contains !== 'function')
    throw new TypeError('"contains" operator must be a function')

  function notContains (a) { return ! contains(a) }

  if (typeof equality !== 'function')
    throw new TypeError('"equality" operator must be a function')

  function disequality (a, b) { return ! equality(a, b) }

  if (typeof addition !== 'function')
    throw new TypeError('"addition" operator must be a function')

  if (typeof negation !== 'function')
    throw new TypeError('"negation" operator must be a function')

  function subtraction (a, b) {
    return addition(a, negation(b)) 
  }

  group.contains    = contains
  group.notContains = notContains
  group.addition    = addition
  group.negation    = negation
  group.subtraction = subtraction
  group.equality    = equality
  group.disequality = disequality

  // identity element

  if (notContains(identity))
    throw new TypeError('"identity" must be contained in group set')

  group.zero = identity

  return group
}

module.exports = algebraGroup

