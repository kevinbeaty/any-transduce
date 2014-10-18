exportLibs(['protocol', 'array', 'push', 'math']);

function exportLibs(libs){
  var i=0, len = libs.length;
  for(; i < len; i++){
    exportLib(libs[i]);
  }
}

function exportLib(lib){
  var library = require('transduce-'+lib), key;
  for(key in library){
    if(library.hasOwnProperty(key)){
      module.exports[key] = library[key];
    }
  }
}
