'use strict'
var libs
if(process.env.TRANSDUCE_IMPL){
  libs = [process.env.TRANSDUCE_IMPL]
} else {
   libs = ['transduce', 'transducers-js', 'transducers.js']
}

function load(lib){
  return require(lib)
}

module.exports = {
  load: load,
  libs: libs
}
