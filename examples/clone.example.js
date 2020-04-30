import clone from '../src/clone'

clone({ a: 2 })
//=> {a: 2}

clone.deep({ a: 2, b: [25, 2] })
//=> {a: 2, b: [25,2]}
