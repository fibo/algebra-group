# algebra-group

> define an [algebra group][1] structure

## Example

[Integer](https://en.wikipedia.org/wiki/Integer) additive group.

```
var algebraGroup = require('algebra-group')

// Define identity element.
var zero = 0

// Define operators.
function contains (a) {
  // NaN, Infinity and -Infinity are not allowed
  return (typeof n === 'number') && isFinite(n) && (n % 1 === 0)
}

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

// Create Integer group.
var Z = algebraGroup({
  identity       : zero,
  contains       : contains,
  equality       : equality,
  compositionLaw : addition,
  inversion      : negation
})

Z.addition(1, 2) // 3
Z.addition(1, 2, 3, 4) // 10

Z.negation(5) // -5

Z.equality(Z.subtraction(2, 2), Z.zero) // true
```

  [1]: https://en.wikipedia.org/wiki/Group_(mathematics) "Group"

