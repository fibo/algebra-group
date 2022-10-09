export interface AlgebraGroup<Element> {
  zero: Element
  includes: (arg: unknown) => arg is Element
  eq: (a: Element, b: Element) => boolean
  add: (a: Element, b: Element) => Element
  neg: (a: Element) => Element
}
