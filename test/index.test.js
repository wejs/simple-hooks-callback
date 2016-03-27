var assert = require('assert');
var sinon = require('sinon');
var Hooks = require('../lib');
var hooks = new Hooks();

describe('hooks-callback', function () {

  describe('hooks.on', function () {

    it('should register 2 functions and run function1 before function2', function (done) {
      var function1AlreadyRun = false;

      var functionStubs = {
        function1: function function1(data, done){
          assert(!function1AlreadyRun, 'function1 need to run only 1 time');
          function1AlreadyRun = true;
          done();
        },
        function2: function function2(data, done){
          assert(function1AlreadyRun, 'function1 needs to run before function 2');
          done();
        }
      };

      sinon.spy(functionStubs, 'function1');
      sinon.spy(functionStubs, 'function2');

      hooks.on('do:test:1', functionStubs.function1);
      hooks.on('do:test:1', functionStubs.function2);

      hooks.run('do:test:1', {}, function afterAll(err) {
        assert(!err, 'dont return error');

        assert(functionStubs.function1.called);
        assert.equal(functionStubs.function1.callCount, 1);
        assert(functionStubs.function2.called);
        assert.equal(functionStubs.function2.callCount, 1);
        done();

      });
    });

    it('should register 2 functions and not run function 2 if function1 return error', function (done) {

      var functionStubs = {
        function1: function function1(data, done){
          done('error in function 1');
        },
        function2: function function2(){
          throw new Error('Dont run function 2 if function 1 returns error');
        }
      };

      sinon.spy(functionStubs, 'function1');
      sinon.spy(functionStubs, 'function2');

      hooks.on('do:test:2', functionStubs.function1);
      hooks.on('do:test:2', functionStubs.function2);

      hooks.run('do:test:2', {}, function afterAll(err) {
        assert(err, 'error from function 1');
        assert.equal(err, 'error in function 1');

        assert(functionStubs.function1.called);
        assert.equal(functionStubs.function1.callCount, 1);

        assert(!functionStubs.function2.called);
        assert.equal(functionStubs.function2.callCount, 0);
        done();
      });
    });

    it('should register 3 functions if pass an array of functions', function (done) {
      var functionStubs = {
        function1: function function1(data, done){
          done();
        },
        function2: function function2(data, done){
          done();
        },
        function3: function function3(data, done){
          done();
        }
      };

      sinon.spy(functionStubs, 'function1');
      sinon.spy(functionStubs, 'function2');
      sinon.spy(functionStubs, 'function3');

      hooks.on('do:test:3', [functionStubs.function1, functionStubs.function2, functionStubs.function3]);

      hooks.run('do:test:3', {}, function afterAll(err) {
        assert(!err, 'dont return error');

        assert(functionStubs.function1.called);
        assert.equal(functionStubs.function1.callCount, 1);

        assert(functionStubs.function2.called);
        assert.equal(functionStubs.function2.callCount, 1);

        assert(functionStubs.function3.called);
        assert.equal(functionStubs.function3.callCount, 1);

        done();

      });
    });

    it('should throw error if try to register something how dont are an function', function (done) {
      try {
        hooks.on('do:test:4', 'invalid');
      } catch(e) {
        assert(e);
        done()
      }
    });
  });


  describe('hooks.trigger', function () {
    it('should run console.log if hooks.log is set', function (done) {
      var called = false;
      hooks.log = function(){
        called = true;
      }

      hooks.trigger('do:trigger:test:1', {}, function(){});

      assert.equal(called, true);

      done();
    });

    it('should accept run trigger without data', function (done) {
      hooks.trigger('do:trigger:test:2', function (err){
        assert(!err);

        done();
      });
    });
  });

  describe('hooks.off', function () {
    it('should un register function2 but keep function1 and function3', function (done) {
      var functionStubs = {
        function1: function function1(data, done){
          done();
        },
        function2: function function2(){
          throw new Error('Dont run function 2, its need be unregistered');
        },
        function3: function function3(data, done){
          done();
        }
      };

      sinon.spy(functionStubs, 'function1');
      sinon.spy(functionStubs, 'function2');
      sinon.spy(functionStubs, 'function3');

      hooks.on('do:off:test:1', functionStubs.function1);
      hooks.on('do:off:test:1', functionStubs.function2);
      hooks.on('do:off:test:1', functionStubs.function3);

      hooks.off('do:off:test:1', functionStubs.function2);

      hooks.run('do:off:test:1', {}, function afterAll(err) {
        assert(!err, 'dont return error');

        assert(functionStubs.function1.called);
        assert.equal(functionStubs.function1.callCount, 1);

        assert(!functionStubs.function2.called);
        assert.equal(functionStubs.function2.callCount, 0);

        assert(functionStubs.function3.called);
        assert.equal(functionStubs.function3.callCount, 1);

        done();

      });
    });

    it('should return false if not found the function for remove', function (done) {
      var functionStubs = {
        function1: function function1(data, done){
          done();
        },
        function2: function function2(){
          done();
        },
        function3: function function3(data, done){
          done();
        }
      };

      sinon.spy(functionStubs, 'function1');
      sinon.spy(functionStubs, 'function2');
      sinon.spy(functionStubs, 'function3');

      hooks.on('do:off:test:2', functionStubs.function1);
      hooks.on('do:off:test:2', functionStubs.function2);

      assert.equal(hooks.off('do:off:test:2', functionStubs.function3), false);

      hooks.run('do:off:test:2', {}, function afterAll(err) {
        assert(!err, 'dont return error');

        assert(functionStubs.function1.called);
        assert.equal(functionStubs.function1.callCount, 1);

        assert(functionStubs.function2.called);
        assert.equal(functionStubs.function2.callCount, 1);

        done();
      });
    });

    it('should return false if not found the hook', function (done) {
      assert.equal(hooks.off('do:off:test:3', function(){}), false);
      done();
    });
  });
});