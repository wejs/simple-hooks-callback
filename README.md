# simple-hooks-callback 

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] 

> Hooks with callback, works like events but with async callbacks and in order

## Installation

```sh
npm install --save simple-hooks-callback
```

## Usage

```js
// get hooks class
var Hooks = require('simple-hooks-callback');
// start new hook instance with new hooks list
var hooks = new Hooks();

// your function
function function1 (data, cb){
  // do something ...
  console.log('function1', data);

  // then remember to call the callback, return cb(err); if you whant to returns error
  cb();
}

function function2 (data, cb){
  // do something ...
  console.log('function2', data);
  
  // timeout to simulate the async request
  setTimeout(function(){ 
    // then remember to call the callback
    cb();
  }, 1000);
}

// register one function to run on hook event
hooks.on('do-something', function1);
// register other function
hooks.on('do-something', function2);

// register one function to run on hook event
hooks.trigger('do-something', function AfterAll (err){
  if (err) throw err;

  console.log('doneAll')
  // all done
});

// un register the function1
hooks.off('do-something', function1);

```

## License

MIT © [Alberto Souza](http://albertosouza.net)

[npm-image]: https://badge.fury.io/js/simple-hooks-callback.svg
[npm-url]: https://npmjs.org/package/simple-hooks-callback
[travis-image]: https://travis-ci.org/wejs/simple-hooks-callback.svg?branch=master
[travis-url]: https://travis-ci.org/wejs/simple-hooks-callback
[daviddm-image]: https://david-dm.org/wejs/simple-hooks-callback.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/wejs/simple-hooks-callback

