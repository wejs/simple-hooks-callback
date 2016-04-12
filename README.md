# simple-hooks-callback 

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Code Climate](https://codeclimate.com/github/wejs/simple-hooks-callback/badges/gpa.svg)](https://codeclimate.com/github/wejs/simple-hooks-callback) [![Coverage Status](https://coveralls.io/repos/github/wejs/simple-hooks-callback/badge.svg?branch=master)](https://coveralls.io/github/wejs/simple-hooks-callback?branch=master)

> Hooks with callback, works like events but with async callbacks and in order
>
> The easiest way to run asynchronous event functions with callback and execution order. Works like javascript events and is small and dont have dependencies



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

  // then remember to call the callback
  cb();
  // or run **return cb(err);** if you want return error
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

// run all registered functions
hooks.trigger('do-something', { someData: 'someValue' }, function AfterAll (err){
  if (err) throw err;

  console.log('doneAll');
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

