## Any Transduce
[![Build Status](https://secure.travis-ci.org/transduce/any-transduce.svg)](http://travis-ci.org/transduce/any-transduce)

Let your transducers library support either [transduce][0], [transducers-js][1] or [transducers.js][2] and leave the choice to the end user. The end user can `npm install`, or install a browser version in a `<script>` tag their preference before using this library and the  installed library will be automatically detected.  When API differs, exported functions are adapted to match [transduce][0] (which mostly follows [transducers-js][1]).

For general use, you can use any other `transduce-` libraries as desired directly with your preferred transducers implementation. All of these libraries can work with either implementation and can be required and used directly (and do not depend on `transduce`):

The `transduce` library may only be useful for library extensions that support any implementation. The goal is to adapt to a common interface so the end user can choose the transducer implementation.

Currently supports a common interface for the following methods:

```javascript
into: function(empty, xf, coll);
transduce: function(xf, f, init, coll);
reduce: function(f, init, coll);
map: function(f);
filter: function(pred);
remove: function(pred);
take: function(n);
takeWhile: function(pred);
drop: function(n);
dropWhile: function(pred);
cat: transducer;
mapcat: function(f);
partitionAll: function(n);
partitionBy: function(f);
compose: function(/*args*/);
```

[0]: https://github.com/transduce/transduce
[1]: https://github.com/cognitect-labs/transducers-js
[2]: https://github.com/jlongster/transducers.js
