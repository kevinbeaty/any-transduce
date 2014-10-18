var protocol = require('transduce-protocol');

var impl = load();

module.exports = {
  into: impl.into,
  transduce: impl.transduce,
  reduce: impl.reduce,
  take: impl.take,
  drop: impl.drop,
  protocols: protocol.protocols,
  isIterator: protocol.isIterator,
  iterator: protocol.iterator,
  isTransformer: protocol.isTransformer,
  transformer: protocol.transformer,
  isReduced: protocol.isReduced,
  reduced: protocol.reduced,
  unreduced: protocol.unreduced,
  compose: protocol.compose
};

function load(){
  var impl;
  try {
    impl = loadTransducersDashJS();
  } catch (e) {
    try {
      impl = loadTransducersDotJS();
    } catch(e2){
      throw new Error('Must npm install either transducers-js or transducers.js, your choice');
    }
  }
  return impl;
}

function loadTransducersDashJS(){
  return require('transducers-js');
}

function loadTransducersDotJS(){
  //adapt methods to match transducers-js API
  var impl = require('transducers.js');
  return {
    into: impl.into,
    transduce: function(xf, f, init, coll){
      f = protocol.transformer(f);
      return impl.transduce(coll, xf, f, init);
    },
    reduce: function(f, init, coll){
      f = protocol.transformer(f);
      return impl.reduce(coll, f, init);
    },
    take: function(n){
      return impl.take(null, n);
    },
    drop: function(n){
      return impl.drop(null, n);
    }
  }
  return impl;
}
