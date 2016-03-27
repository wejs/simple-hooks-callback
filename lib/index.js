/**
 * Hooks prototype
 */
var Hooks = function HooksPrototype (){
  this.list = {};
  // set hooks.log for show logs
  this.log = null;
};

/**
 * Register one hook method listenner
 *
 *
 * @param  {String}   hookName
 * @param  {Function|Array} hookFunction function or array of functions to register in this hook
 * @example
 *    we.hooks.on('something', { data: '' }, function callback() {})
 */
Hooks.prototype.on = function weAddEventListener (hookName, hookFunction){
  if (!this.list[hookName]) this.list[hookName] = [];

  if (typeof hookFunction === 'function') {
    this.list[hookName].push(hookFunction);
  } else if (Array.isArray(hookFunction)) {
    //is array
    for (var i = 0; i < hookFunction.length; i++) {
      this.list[hookName].push(hookFunction[i]);
    }
  } else {
    throw new Error('invalid hookFunction in hooks.on');
  }
};

/**
 * Trigger one hook event ( works like hooks ) and runs all functions added in this event in order and in async mode
 *
 * @param  {string}  hookName name of the event to trigger
 * @param  {object}  data      Data to pass to event listeners, optional
 * @param  {Function} cb   Callback
 */
Hooks.prototype.trigger = function weTriggerEvent (hookName, data, cb){
  // data is optional
  if (!cb && typeof data === 'function') {
    cb = data;
    data = null;
  }

  if (this.log) this.log('run hook: '+ hookName);

  if (!this.list[hookName]) return cb();

  runHookFunctions(0, this.list[hookName], data, cb);
};

/**
 * Exec hook functions in order and stop if find error
 */
function runHookFunctions (i, hooksList, data, doneAll){
  hooksList[i](data, function afterRunHookFN (err){
    if (err) return doneAll(err);
    // next hook indice
    i++;

    if (i < hooksList.length) {
    // run hook if have hooks
      runHookFunctions(i, hooksList, data, doneAll);
    } else {
    // done all
      doneAll();
    }
  });
}

/**
 * Remove one function from hooks list
 *
 * @param  {String} hookName
 * @param  {Function} function to remove
 * @return {Boolean} true if the functions is removed
 */
Hooks.prototype.off = function off (hookName, fn){
  if (!this.list[hookName]) return false;

  for (var i = 0; i < this.list[hookName].length; i++) {
    if (this.list[hookName][i] === fn) {
      this.list[hookName].splice(i, 1);
      return true;
    }
  }

  return false;
};

// alias
Hooks.prototype.run = Hooks.prototype.trigger;

module.exports = Hooks;