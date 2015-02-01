'use strict'
var lib = require('./load'),
    loadLib = lib.load,
    libs = lib.libs,
    implFns = [
      'into', 'transduce', 'reduce', 'toArray', 'compose',
      'map', 'filter', 'remove', 'take', 'takeWhile',
      'drop', 'dropWhile', 'cat', 'mapcat', 'partitionAll', 'partitionBy']

function exportImpl(impl, overrides){
  var i = 0, len = implFns.length, fn
  for(; i < len; i++){
    fn = implFns[i]
    exports[fn] = ((fn in overrides) ? overrides : impl)[fn]
  }
  exports.toArray = transduceToArray(exports)
}

function load(){
  var i = 0, len = libs.length
  for(; i < len; i++){
    try {
      if(loader[libs[i]]()){
        return
      }
    } catch(e){}
  }
  throw new Error('Must install one of: '+libs.join())
}

var loader = {
  'transduce': function(){
   var impl = loadLib('transduce')
   exportImpl(impl, {})
   return true
  },
  'transducers-js': function(){
    var impl = loadLib('transducers-js'),
        // if no Wrap exported, probably transducers.js
        loaded =  !!impl.Wrap
    if(loaded){
      exportImpl(impl, {compose:impl.comp})
    }
    return loaded
  },
  'transducers.js': function(){
    //adapt methods to match transducers-js API
    var impl = loadLib('transducers.js')

    exportImpl(impl, {
      transduce: function(xf, f, init, coll){
        f = completing(f)
        return impl.transduce(coll, xf, f, init)
      },
      reduce: function(f, init, coll){
        f = completing(f)
        return impl.reduce(coll, f, init)
      },
      partitionAll: impl.partition
    })
    return true
  }
}

function transduceToArray(impl){
  return function(xf, coll){
    var init = []
    if(coll === void 0){
      return impl.reduce(arrayPush, init, xf)
    }
    return impl.transduce(xf, arrayPush, init, coll)
  }
}

function arrayPush(result, input){
  result.push(input)
  return result
}

function completing(rf){
  return new Completing(rf)
}
function Completing(rf, result){
  this.step = rf
}
Completing.prototype.init = function(){
  return this.step()
}
Completing.prototype.result = function(result){
  return result
}

load()
