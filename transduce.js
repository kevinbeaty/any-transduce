var protocol = require('transduce-protocol');
    implFns = [
      'into', 'transduce', 'reduce', 'map', 'filter', 'remove', 'take', 'takeWhile',
      'drop', 'dropWhile', 'cat', 'mapcat', 'partitionAll', 'partitionBy'],
    protocolFns = [
      'protocols', 'isIterator', 'iterator', 'isTransformer', 'transformer',
      'isReduced', 'reduced', 'unreduced', 'compose'];

function exportImpl(impl, overrides){
  var i = 0, len = implFns.length, fn;
  for(; i < len; i++){
    fn = implFns[i];
    exports[fn] = ((fn in overrides) ? overrides : impl)[fn];
  }
}

function exportProtocol(){
  var i = 0, len = protocolFns.length, fn;
  for(; i < len; i++){
    fn = protocolFns[i];
    exports[fn] = protocol[fn];
  }
}

function load(){
  exportProtocol();
  var libs = ['transducers-js', 'transducers.js'], impl;
  if(typeof process !== 'undefined' && process.env && process.env.TRANSDUCE_IMPL){
    libs = [process.env.TRANSDUCE_IMPL];
  }
  var i = 0; len = libs.length;
  for(; i < len; i++){
    try {
      if(loader[libs[i]]()){
        return;
      }
    } catch(e){}
  }
  throw new Error('Must install one of: '+libs.join());
}

var undef, loader = {
  'transducers-js': function(){
    var impl = loadFromBrowser(),
        loaded = true;
    if(impl){
      // if no Wrap exported, probably transducers.js
      loaded = !!impl.Wrap;
    } else {
      impl = require('transducers-js');
    }
    if(loaded){
      exportImpl(impl, {});
    }
    return loaded;
  },
  'transducers.js': function(){
    //adapt methods to match transducers-js API
    var impl = loadFromBrowser();
    if(!impl){
      impl = require('transducers.js');
    }
    exportImpl(impl, {
      transduce: function(xf, f, init, coll){
        f = protocol.transformer(f);
        return impl.transduce(coll, xf, f, init);
      },
      reduce: function(f, init, coll){
        f = protocol.transformer(f);
        return impl.reduce(coll, f, init);
      },
      partitionAll: impl.partition
    });
    return true;
  }
}

function loadFromBrowser(){
  if(typeof window !== 'undefined'){
    return window.transducers;
  }
}

load();
