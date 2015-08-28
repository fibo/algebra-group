# algebra-group

> define an [algebra group][1] structure

```
var algebraGroup = require('algebra-group')

// Define identity element.
var zero = 0

// Define operators.
function contains (a) { return typeof a === 'number' /* waiting for Number.isNumber */ }

function equality (a, b) { return a === b }

function addition (a, b) { return a + b }

function negation (a) { return -a }

// Create Integer group.
var Z = algebraGroup(contains, zero, equality, addition, negation)

Z.equality(Z.subtraction(2, 2), Z.zero)
```

  [1]: https://en.wikipedia.org/wiki/Group_(mathematics) "Group"

