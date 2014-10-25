var protocol = require('transduce-protocol');

function load(){
  var libs = ['transducers-js', 'transducers.js'], impl;
  if(typeof process !== 'undefined' && process.env && process.env.TRANSDUCE_IMPL){
    libs = [process.env.TRANSDUCE_IMPL];
  }
  var i = 0; len = libs.length;
  for(; i < len; i++){
    try {
      impl = loader[libs[i]]();
      if(impl && impl.map){
        return impl;
      }
    } catch(e){}
  }
  throw new Error('Must install one of: '+libs.join());
}

var undef, loader = {
  'transducers-js': function(){
    var impl = loadFromBrowser();
    if(impl){
      if(!impl.Wrap){
        // if no Wrap exported, probably transducers.js
        impl = undef;
      }
    } else {
      impl = require('transducers-js');
    }
    return impl;
  },
  'transducers.js': function(){
    //adapt methods to match transducers-js API
    var impl = loadFromBrowser();
    if(!impl){
      impl = require('transducers.js');
    }
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
      map: nullFirst(impl, 'map'),
      filter: nullFirst(impl, 'filter'),
      remove: nullFirst(impl, 'remove'),
      take: nullFirst(impl, 'take'),
      takeWhile: nullFirst(impl, 'takeWhile'),
      drop: nullFirst(impl, 'drop'),
      dropWhile: nullFirst(impl, 'dropWhile'),
      cat: impl.cat,
      mapcat: impl.mapcat,
    }
    return impl;
  }
}

function nullFirst(impl, method){
  return function(f){
    return impl[method](f);
  }
}

function loadFromBrowser(){
  if(typeof window !== 'undefined'){
    return window.transducers;
  }
}

var impl = load();

module.exports = {
  into: impl.into,
  transduce: impl.transduce,
  reduce: impl.reduce,
  map: impl.map,
  filter: impl.filter,
  remove: impl.remove,
  take: impl.take,
  takeWhile: impl.takeWhile,
  drop: impl.drop,
  dropWhile: impl.dropWhile,
  cat: impl.cat,
  mapcat: impl.mapcat,
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
