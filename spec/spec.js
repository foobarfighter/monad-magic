var monad = foounit.require(':src/monad-magic');
var Class = foounit.require(':test/compat/commonjs-class');

describe('monad-magic', function (){
  it('creates monads with monads... ULTIMATE IRONY', function (){
    var m = monad.create('foo.name.space', global)
      .init('create', function (){ this.i = 0;    })
      .func('bar',    function (){ this.i++;      })
      .exec('baz',    function (){ return this.i; })
      .done();

    expect(m).toNot(beUndefined);
    expect(m).to(be, foo.name.space);

    var mInstance = foo.name.space.create();
    expect(mInstance.instance.constructor).to(be, foo.name.space);
    expect(mInstance.instance.i).to(be, 0);

    expect(mInstance.bar()).to(be, mInstance);
    expect(mInstance.instance.i).to(be, 1);

    expect(mInstance.baz()).to(be, 1);
  });
});

it('can give any existing class a monadic interface without conflicting', function (){
  var MyClass = Class.extend({
    init: function () { this._value = 0; }
  , inc:  function () { return ++this._value; }
  , dec:  function () { return --this._value; }
  , value: function (){ return this._value; }
  });

  monad.create(MyClass, global)
    .init('chain', function (){})
    .func('inc')
    .func('dec')
    .exec('value');

  var m = MyClass.chain().inc().inc();
  expect(m.value()).to(be, 2);

  m.dec().dec().dec();
  expect(m.value()).to(be, -1);
});

describe('when the monad does not have an initialization function', function (){
  xit('creates an instance on the fly', function (){
  });
});

describe('binding lookups', function (){
});

describe('.create', function() {
  describe('when the instance is created by the function', function (){
    xit('uses the created instance', function (){
    });
  });

  describe('when the instance is NOT created', function (){
    xit('creates an instance using a zero arugment constructor', function (){
    });
  });
});

describe('.func', function (){
  it('accepts a string that is a function bound to the instance', function (){
    var obj = function (){ this.x = 0; };
    obj.prototype.bar   = function (){ return ++this.x; };
    obj.prototype.value = function (){ return this.x; };

    var m = monad.create(obj)
      .init('create', obj)
      .func('foo', 'bar')
      .exec('value')
      .done();

    expect(m.create().foo().value()).to(be, 1);
  });
});

describe('.exec', function (){
  it('adds a function that returns some value', function (){
    var obj = function (){ this.x = 1; };
    obj.prototype.value = function (){ return this.x; };

    var m = monad.create(obj)
      .init('create', obj)
      .exec('value')
      .done();

    expect(m.create().value()).to(be, 1);
  });
});

describe('.wrap', function (){
  it('wraps existing functions on a class for monadic manipulation', function (){
    var Klass = function (){ ctor = true; };
    Klass.prototype.foo = function (){};
    Klass.prototype.bar = function (){};
    Klass.prototype.booya = function (){ return 123; };


    var m = monad.create(Klass)
      .wrap()
      .exec('booya')
      .done();

    expect(m.create().foo().bar().booya()).to(be, 123);
  });

  it('excludes wrapping functions that are specifiied', function (){
    
  });
});
