/**
 * Monad Magic is a syntactic sugar API
 */

var ns = function (ns, root){
  if (typeof ns != 'string'){ return ns; }
  var parts = ns.split('.'), parent = root;

  for (var i = 0, ii = parts.length; i < ii; ++i){
    var part = parts[i];
    if (!parent[part]){
      if (i == ii-1){
        parent[part] = function (){};
      } else {
        parent[part] = {};
      }
    }
    parent = parent[part];
  }
  return parent;
}

var monad = {};

monad.create = function (namespace, root){
  var obj = ns(namespace, root || module)
    , ctx = new monad.Context(obj);

  ctx._hasInit = false;
  return ctx;
}

monad.Context = function (klass){
  this.klass = klass;

  var IMonad = function (){}
    , mInstance;
  
  var _createBinding = function (name, func){
    func = func || mInstance.instance[name];
    return typeof func === 'function' ? func : mInstance.instance[func];
  };


  /**
   * Initializes the monad interface.
   */

  // TODO: This should run in the monad interface scope
  //       an instance should only be created if it wasn't created by the init func
  this.init = function (name, func){
    this._hasInit = true;

    var klass = this.klass;

    this.klass[name] = function (){
      mInstance = new IMonad(), instance = new klass();

      mInstance.instance = instance;
      func.apply(mInstance.instance, arguments);
      return mInstance;
    }
    return this;
  }

  this.func = function (name, func){
    IMonad.prototype[name] = function(){
      _createBinding(name, func).apply(this.instance, arguments);
      return this;
    }
    return this;
  }

  this.exec = function (name, func){
    IMonad.prototype[name] = function (){
      return _createBinding(name, func).apply(this.instance, arguments);
    }
    return this;
  }

  /**
   * Generates a monadic function that just sets an attribute on the class instance
   */
  this.attr = function (method, propertyName, findMethod){
    return this;
  }

  /**
   * Wrap all existing methods on the class with functions for monadic manipulation
   * excluding methods that are passed as arguments.
   */
  this.wrap = function (){
    //var excludes = Array.prototype.slice.call(arguments, 0);
    var p = this.klass.prototype;
    for (var method in p){
      if (!p.hasOwnProperty(method) || typeof p[method] != 'function'){ continue; }
      this.func(method, p[method]);
    }
    return this;
  }

  /**
   * Finishes the monad declaration
   */
  this.done = this.end = function (){
    if (!this._hasInit){ this.init('create', this.klass); }
    return this.klass;
  }
};

module.exports = monad;
