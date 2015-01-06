'use strict'
/*global transduce, transducers */
var libs = ['transduce','transducers-js', 'transducers.js']

function load(lib){
  if(lib === 'transduce'){
    return transduce
  }
  return transducers
}

module.exports = {
  load: load,
  libs: libs
}
