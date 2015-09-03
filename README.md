# algebra-group

> define an [algebra group][1] structure

## Example

All code in the examples below is intended to be contained into a [single file](https://github.com/fibo/algebra-group/blob/master/test.js).

### Additive group

Create the [Integer](https://en.wikipedia.org/wiki/Integer) additive group.

```
var algebraGroup = require('algebra-group')

// Define identity element.
var zero = 0

// Define operators.
function isInteger (a) {
  // NaN, Infinity and -Infinity are not allowed
  return (typeof n === 'number') && isFinite(n) && (n % 1 === 0)
}

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

// Create Integer additive group a.k.a (Z, +).
var Z = algebraGroup({
  identity       : zero,
  contains       : isInteger,
  equality       : equality,
  compositionLaw : addition,
  inversion      : negation
})
```

You get a group object with *zero* identity and group operators.

```
Z.contains(2) // true
Z.contains(2.5) // false
Z.contains('xxx') // false
Z.notContains(false) // true
Z.notContains(Math.PI) // true
Z.contains(-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9) // true
Z.contains(1, 2, 3, 4.5) // false, 4.5 is not an integer

Z.addition(1, 2) // 3
Z.addition(1, 2, 3, 4) // 10

Z.negation(5) // -5

Z.subtraction(5, 1) // 4
Z.subtraction(5, 1, 1, 1, 1, 1) // 0

Z.equality(Z.subtraction(2, 2), Z.zero) // true
```

### Multiplicative group

Create R, the group of real numbers with multiplication as composition law.
It makes sense to change customize prop names, which defaults to additive group naming.

```
function isReal (n) {
  // NaN, Infinity and -Infinity are not allowed
  return (typeof n === 'number') && isFinite(n)
}

function multiplication (a, b) { return a * b }

function inversion (a) { 1 / a }

// Create Real multiplicative group a.k.a (R, *).
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
})
```

```
R.contains(10) // true
```

  [1]: https://en.wikipedia.org/wiki/Group_(mathematics) "Group"

