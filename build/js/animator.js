/*! https://mths.be/array-from v0.2.0 by @mathias */
if (!Array.from) {
    (function() {
        'use strict';
        var defineProperty = (function() {
            // IE 8 only supports `Object.defineProperty` on DOM elements.
            try {
                var object = {};
                var $defineProperty = Object.defineProperty;
                var result = $defineProperty(object, object, object) && $defineProperty;
            } catch(error) {}
            return result || function put(object, key, descriptor) {
                    object[key] = descriptor.value;
                };
        }());
        var toStr = Object.prototype.toString;
        var isCallable = function(fn) {
            // In a perfect world, the `typeof` check would be sufficient. However,
            // in Chrome 1–12, `typeof /x/ == 'object'`, and in IE 6–8
            // `typeof alert == 'object'` and similar for other host objects.
            return typeof fn == 'function' || toStr.call(fn) == '[object Function]';
        };
        var toInteger = function(value) {
            var number = Number(value);
            if (isNaN(number)) {
                return 0;
            }
            if (number == 0 || !isFinite(number)) {
                return number;
            }
            return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function(value) {
            var len = toInteger(value);
            return Math.min(Math.max(len, 0), maxSafeInteger);
        };
        var from = function(arrayLike) {
            var C = this;
            if (arrayLike == null) {
                throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
            }
            var items = Object(arrayLike);
            var mapping = arguments.length > 1;

            var mapFn, T;
            if (arguments.length > 1) {
                mapFn = arguments[1];
                if (!isCallable(mapFn)) {
                    throw new TypeError('When provided, the second argument to `Array.from` must be a function');
                }
                if (arguments.length > 2) {
                    T = arguments[2];
                }
            }

            var len = toLength(items.length);
            var A = isCallable(C) ? Object(new C(len)) : new Array(len);
            var k = 0;
            var kValue, mappedValue;
            while (k < len) {
                kValue = items[k];
                if (mapFn) {
                    mappedValue = typeof T == 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                } else {
                    mappedValue = kValue;
                }
                defineProperty(A, k, {
                    'value': mappedValue,
                    'configurable': true,
                    'enumerable': true
                });
                ++k;
            }
            A.length = len;
            return A;
        };
        defineProperty(Array, 'from', {
            'value': from,
            'configurable': true,
            'writable': true
        });
    }());
}
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  /*global define, module, exports */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(this, function () {
  'use strict';

  var _apply = Function.call.bind(Function.apply);
  var _call = Function.call.bind(Function.call);

  var not = function notThunker(func) {
    return function notThunk() { return !_apply(func, this, arguments); };
  };
  var throwsError = function (func) {
    try {
      func();
      return false;
    } catch (e) {
      return true;
    }
  };
  var valueOrFalseIfThrows = function valueOrFalseIfThrows(func) {
    try {
      return func();
    } catch (e) {
      return false;
    }
  };

  var isCallableWithoutNew = not(throwsError);
  var arePropertyDescriptorsSupported = function () {
    // if Object.defineProperty exists but throws, it's IE 8
    return !throwsError(function () { Object.defineProperty({}, 'x', {}); });
  };
  var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();

  var _forEach = Function.call.bind(Array.prototype.forEach);
  var _reduce = Function.call.bind(Array.prototype.reduce);
  var _filter = Function.call.bind(Array.prototype.filter);
  var _every = Function.call.bind(Array.prototype.every);

  var defineProperty = function (object, name, value, force) {
    if (!force && name in object) { return; }
    if (supportsDescriptors) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
      });
    } else {
      object[name] = value;
    }
  };

  // Define configurable, writable and non-enumerable props
  // if they don’t exist.
  var defineProperties = function (object, map) {
    _forEach(Object.keys(map), function (name) {
      var method = map[name];
      defineProperty(object, name, method, false);
    });
  };

  // Simple shim for Object.create on ES3 browsers
  // (unlike real shim, no attempt to support `prototype === null`)
  var create = Object.create || function (prototype, properties) {
    var Prototype = function Prototype() {};
    Prototype.prototype = prototype;
    var object = new Prototype();
    if (typeof properties !== 'undefined') {
      Object.keys(properties).forEach(function (key) {
        Value.defineByDescriptor(object, key, properties[key]);
      });
    }
    return object;
  };

  var supportsSubclassing = function (C, f) {
    if (!Object.setPrototypeOf) { return false; /* skip test on IE < 11 */ }
    return valueOrFalseIfThrows(function () {
      var Sub = function Subclass(arg) {
        var o = new C(arg);
        Object.setPrototypeOf(o, Subclass.prototype);
        return o;
      };
      Object.setPrototypeOf(Sub, C);
      Sub.prototype = create(C.prototype, {
        constructor: { value: Sub }
      });
      return f(Sub);
    });
  };

  var startsWithRejectsRegex = function () {
    return String.prototype.startsWith && throwsError(function () {
      /* throws if spec-compliant */
      '/a/'.startsWith(/a/);
    });
  };
  var startsWithHandlesInfinity = (function () {
    return String.prototype.startsWith && 'abc'.startsWith('a', Infinity) === false;
  }());

  /*jshint evil: true */
  var getGlobal = new Function('return this;');
  /*jshint evil: false */

  var globals = getGlobal();
  var globalIsFinite = globals.isFinite;
  var hasStrictMode = (function () { return this === null; }.call(null));
  var startsWithIsCompliant = startsWithRejectsRegex() && startsWithHandlesInfinity;
  var _indexOf = Function.call.bind(String.prototype.indexOf);
  var _toString = Function.call.bind(Object.prototype.toString);
  var _concat = Function.call.bind(Array.prototype.concat);
  var _strSlice = Function.call.bind(String.prototype.slice);
  var _push = Function.call.bind(Array.prototype.push);
  var _pushApply = Function.apply.bind(Array.prototype.push);
  var _shift = Function.call.bind(Array.prototype.shift);
  var _max = Math.max;
  var _min = Math.min;
  var _floor = Math.floor;
  var _abs = Math.abs;
  var _log = Math.log;
  var _sqrt = Math.sqrt;
  var _hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
  var ArrayIterator; // make our implementation private
  var noop = function () {};

  var Symbol = globals.Symbol || {};
  var symbolSpecies = Symbol.species || '@@species';
  var defaultSpeciesGetter = function () { return this; };
  var addDefaultSpecies = function (C) {
    if (supportsDescriptors && !_hasOwnProperty(C, symbolSpecies)) {
      Value.getter(C, symbolSpecies, defaultSpeciesGetter);
    }
  };
  var Type = {
    object: function (x) { return x !== null && typeof x === 'object'; },
    string: function (x) { return _toString(x) === '[object String]'; },
    regex: function (x) { return _toString(x) === '[object RegExp]'; },
    symbol: function (x) {
      return typeof globals.Symbol === 'function' && typeof x === 'symbol';
    }
  };

  var numberIsNaN = Number.isNaN || function isNaN(value) {
    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN('foo') => true
    return value !== value;
  };
  var numberIsFinite = Number.isFinite || function isFinite(value) {
    return typeof value === 'number' && globalIsFinite(value);
  };

  var Value = {
    getter: function (object, name, getter) {
      if (!supportsDescriptors) {
        throw new TypeError('getters require true ES5 support');
      }
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        get: getter
      });
    },
    proxy: function (originalObject, key, targetObject) {
      if (!supportsDescriptors) {
        throw new TypeError('getters require true ES5 support');
      }
      var originalDescriptor = Object.getOwnPropertyDescriptor(originalObject, key);
      Object.defineProperty(targetObject, key, {
        configurable: originalDescriptor.configurable,
        enumerable: originalDescriptor.enumerable,
        get: function getKey() { return originalObject[key]; },
        set: function setKey(value) { originalObject[key] = value; }
      });
    },
    redefine: function (object, property, newValue) {
      if (supportsDescriptors) {
        var descriptor = Object.getOwnPropertyDescriptor(object, property);
        descriptor.value = newValue;
        Object.defineProperty(object, property, descriptor);
      } else {
        object[property] = newValue;
      }
    },
    defineByDescriptor: function (object, property, descriptor) {
      if (supportsDescriptors) {
        Object.defineProperty(object, property, descriptor);
      } else if ('value' in descriptor) {
        object[property] = descriptor.value;
      }
    },
    preserveToString: function (target, source) {
      defineProperty(target, 'toString', source.toString.bind(source), true);
    }
  };

  var overrideNative = function overrideNative(object, property, replacement) {
    var original = object[property];
    defineProperty(object, property, replacement, true);
    Value.preserveToString(object[property], original);
  };

  // This is a private name in the es6 spec, equal to '[Symbol.iterator]'
  // we're going to use an arbitrary _-prefixed name to make our shims
  // work properly with each other, even though we don't have full Iterator
  // support.  That is, `Array.from(map.keys())` will work, but we don't
  // pretend to export a "real" Iterator interface.
  var $iterator$ = Type.symbol(Symbol.iterator) ? Symbol.iterator : '_es6-shim iterator_';
  // Firefox ships a partial implementation using the name @@iterator.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
  // So use that name if we detect it.
  if (globals.Set && typeof new globals.Set()['@@iterator'] === 'function') {
    $iterator$ = '@@iterator';
  }
  var addIterator = function (prototype, impl) {
    var implementation = impl || function iterator() { return this; };
    var o = {};
    o[$iterator$] = implementation;
    defineProperties(prototype, o);
    if (!prototype[$iterator$] && Type.symbol($iterator$)) {
      // implementations are buggy when $iterator$ is a Symbol
      prototype[$iterator$] = implementation;
    }
  };

  // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
  // can be replaced with require('is-arguments') if we ever use a build process instead
  var isArguments = function isArguments(value) {
    var str = _toString(value);
    var result = str === '[object Arguments]';
    if (!result) {
      result = str !== '[object Array]' &&
        value !== null &&
        typeof value === 'object' &&
        typeof value.length === 'number' &&
        value.length >= 0 &&
        _toString(value.callee) === '[object Function]';
    }
    return result;
  };

  var ES = {
    // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
    Call: function Call(F, V) {
      var args = arguments.length > 2 ? arguments[2] : [];
      if (!ES.IsCallable(F)) {
        throw new TypeError(F + ' is not a function');
      }
      return _apply(F, V, args);
    },

    RequireObjectCoercible: function (x, optMessage) {
      /* jshint eqnull:true */
      if (x == null) {
        throw new TypeError(optMessage || 'Cannot call method on ' + x);
      }
    },

    TypeIsObject: function (x) {
      /* jshint eqnull:true */
      // this is expensive when it returns false; use this function
      // when you expect it to return true in the common case.
      return x != null && Object(x) === x;
    },

    ToObject: function (o, optMessage) {
      ES.RequireObjectCoercible(o, optMessage);
      return Object(o);
    },

    IsCallable: function (x) {
      // some versions of IE say that typeof /abc/ === 'function'
      return typeof x === 'function' && _toString(x) === '[object Function]';
    },

    IsConstructor: function (x) {
      // We can't tell callables from constructors in ES5
      return ES.IsCallable(x);
    },

    ToInt32: function (x) {
      return ES.ToNumber(x) >> 0;
    },

    ToUint32: function (x) {
      return ES.ToNumber(x) >>> 0;
    },

    ToNumber: function (value) {
      if (_toString(value) === '[object Symbol]') {
        throw new TypeError('Cannot convert a Symbol value to a number');
      }
      return +value;
    },

    ToInteger: function (value) {
      var number = ES.ToNumber(value);
      if (numberIsNaN(number)) { return 0; }
      if (number === 0 || !numberIsFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * _floor(_abs(number));
    },

    ToLength: function (value) {
      var len = ES.ToInteger(value);
      if (len <= 0) { return 0; } // includes converting -0 to +0
      if (len > Number.MAX_SAFE_INTEGER) { return Number.MAX_SAFE_INTEGER; }
      return len;
    },

    SameValue: function (a, b) {
      if (a === b) {
        // 0 === -0, but they are not identical.
        if (a === 0) { return 1 / a === 1 / b; }
        return true;
      }
      return numberIsNaN(a) && numberIsNaN(b);
    },

    SameValueZero: function (a, b) {
      // same as SameValue except for SameValueZero(+0, -0) == true
      return (a === b) || (numberIsNaN(a) && numberIsNaN(b));
    },

    IsIterable: function (o) {
      return ES.TypeIsObject(o) && (typeof o[$iterator$] !== 'undefined' || isArguments(o));
    },

    GetIterator: function (o) {
      if (isArguments(o)) {
        // special case support for `arguments`
        return new ArrayIterator(o, 'value');
      }
      var itFn = ES.GetMethod(o, $iterator$);
      if (!ES.IsCallable(itFn)) {
        // Better diagnostics if itFn is null or undefined
        throw new TypeError('value is not an iterable');
      }
      var it = _call(itFn, o);
      if (!ES.TypeIsObject(it)) {
        throw new TypeError('bad iterator');
      }
      return it;
    },

    GetMethod: function (o, p) {
      var func = ES.ToObject(o)[p];
      if (func === void 0 || func === null) {
        return void 0;
      }
      if (!ES.IsCallable(func)) {
        throw new TypeError('Method not callable: ' + p);
      }
      return func;
    },

    IteratorComplete: function (iterResult) {
      return !!(iterResult.done);
    },

    IteratorClose: function (iterator, completionIsThrow) {
      var returnMethod = ES.GetMethod(iterator, 'return');
      if (returnMethod === void 0) {
        return;
      }
      var innerResult, innerException;
      try {
        innerResult = _call(returnMethod, iterator);
      } catch (e) {
        innerException = e;
      }
      if (completionIsThrow) {
        return;
      }
      if (innerException) {
        throw innerException;
      }
      if (!ES.TypeIsObject(innerResult)) {
        throw new TypeError("Iterator's return method returned a non-object.");
      }
    },

    IteratorNext: function (it) {
      var result = arguments.length > 1 ? it.next(arguments[1]) : it.next();
      if (!ES.TypeIsObject(result)) {
        throw new TypeError('bad iterator');
      }
      return result;
    },

    IteratorStep: function (it) {
      var result = ES.IteratorNext(it);
      var done = ES.IteratorComplete(result);
      return done ? false : result;
    },

    Construct: function (C, args, newTarget, isES6internal) {
      if (newTarget === void 0) {
        newTarget = C;
      }
      if (!isES6internal) {
        // Try to use Reflect.construct if available
        return Reflect.construct(C, args, newTarget);
      }
      // OK, we have to fake it.  This will only work if the
      // C.[[ConstructorKind]] == "base" -- but that's the only
      // kind we can make in ES5 code anyway.

      // OrdinaryCreateFromConstructor(newTarget, "%ObjectPrototype%")
      var proto = newTarget.prototype;
      if (!ES.TypeIsObject(proto)) {
        proto = Object.prototype;
      }
      var obj = create(proto);
      // Call the constructor.
      var result = ES.Call(C, obj, args);
      return ES.TypeIsObject(result) ? result : obj;
    },

    SpeciesConstructor: function (O, defaultConstructor) {
      var C = O.constructor;
      if (C === void 0) {
        return defaultConstructor;
      }
      if (!ES.TypeIsObject(C)) {
        throw new TypeError('Bad constructor');
      }
      var S = C[symbolSpecies];
      if (S === void 0 || S === null) {
        return defaultConstructor;
      }
      if (!ES.IsConstructor(S)) {
        throw new TypeError('Bad @@species');
      }
      return S;
    },

    CreateHTML: function (string, tag, attribute, value) {
      var S = String(string);
      var p1 = '<' + tag;
      if (attribute !== '') {
        var V = String(value);
        var escapedV = V.replace(/"/g, '&quot;');
        p1 += ' ' + attribute + '="' + escapedV + '"';
      }
      var p2 = p1 + '>';
      var p3 = p2 + S;
      return p3 + '</' + tag + '>';
    }
  };

  var emulateES6construct = function (o, defaultNewTarget, defaultProto, slots) {
    // This is an es5 approximation to es6 construct semantics.  in es6,
    // 'new Foo' invokes Foo.[[Construct]] which (for almost all objects)
    // just sets the internal variable NewTarget (in es6 syntax `new.target`)
    // to Foo and then returns Foo().

    // Many ES6 object then have constructors of the form:
    // 1. If NewTarget is undefined, throw a TypeError exception
    // 2. Let xxx by OrdinaryCreateFromConstructor(NewTarget, yyy, zzz)

    // So we're going to emulate those first two steps.
    if (!ES.TypeIsObject(o)) {
      throw new TypeError('Constructor requires `new`: ' + defaultNewTarget.name);
    }
    var proto = defaultNewTarget.prototype;
    if (!ES.TypeIsObject(proto)) {
      proto = defaultProto;
    }
    o = create(proto);
    for (var name in slots) {
      if (_hasOwnProperty(slots, name)) {
        var value = slots[name];
        defineProperty(o, name, value, true);
      }
    }
    return o;
  };

  // Promises
  // Simplest possible implementation; use a 3rd-party library if you
  // want the best possible speed and/or long stack traces.
  var PromiseShim = (function () {

    ES.IsPromise = function (promise) {
      if (!ES.TypeIsObject(promise)) {
        return false;
      }
      if (typeof promise._promise === 'undefined') {
        return false; // uninitialized, or missing our hidden field.
      }
      return true;
    };

    // "PromiseCapability" in the spec is what most promise implementations
    // call a "deferred".
    var PromiseCapability = function (C) {
      if (!ES.IsConstructor(C)) {
        throw new TypeError('Bad promise constructor');
      }
      var capability = this;
      var resolver = function (resolve, reject) {
        if (capability.resolve !== void 0 || capability.reject !== void 0) {
          throw new TypeError('Bad Promise implementation!');
        }
        capability.resolve = resolve;
        capability.reject = reject;
      };
      capability.promise = new C(resolver);
      if (!(ES.IsCallable(capability.resolve) && ES.IsCallable(capability.reject))) {
        throw new TypeError('Bad promise constructor');
      }
    };

    // find an appropriate setImmediate-alike
    var setTimeout = globals.setTimeout;
    var makeZeroTimeout;
    /*global window */
    if (typeof window !== 'undefined' && ES.IsCallable(window.postMessage)) {
      makeZeroTimeout = function () {
        // from http://dbaron.org/log/20100309-faster-timeouts
        var timeouts = [];
        var messageName = 'zero-timeout-message';
        var setZeroTimeout = function (fn) {
          _push(timeouts, fn);
          window.postMessage(messageName, '*');
        };
        var handleMessage = function (event) {
          if (event.source === window && event.data === messageName) {
            event.stopPropagation();
            if (timeouts.length === 0) { return; }
            var fn = _shift(timeouts);
            fn();
          }
        };
        window.addEventListener('message', handleMessage, true);
        return setZeroTimeout;
      };
    }
    var makePromiseAsap = function () {
      // An efficient task-scheduler based on a pre-existing Promise
      // implementation, which we can use even if we override the
      // global Promise below (in order to workaround bugs)
      // https://github.com/Raynos/observ-hash/issues/2#issuecomment-35857671
      var P = globals.Promise;
      return P && P.resolve && function (task) {
        return P.resolve().then(task);
      };
    };
    /*global process */
    var enqueue = ES.IsCallable(globals.setImmediate) ?
      globals.setImmediate.bind(globals) :
      typeof process === 'object' && process.nextTick ? process.nextTick :
      makePromiseAsap() ||
      (ES.IsCallable(makeZeroTimeout) ? makeZeroTimeout() :
      function (task) { setTimeout(task, 0); }); // fallback

    // Constants for Promise implementation
    var PROMISE_IDENTITY = 1;
    var PROMISE_THROWER = 2;
    var PROMISE_PENDING = 3;
    var PROMISE_FULFILLED = 4;
    var PROMISE_REJECTED = 5;

    var promiseReactionJob = function (reaction, argument) {
      var promiseCapability = reaction.capabilities;
      var handler = reaction.handler;
      var handlerResult, handlerException = false, f;
      if (handler === PROMISE_IDENTITY) {
        handlerResult = argument;
      } else if (handler === PROMISE_THROWER) {
        handlerResult = argument;
        handlerException = true;
      } else {
        try {
          handlerResult = handler(argument);
        } catch (e) {
          handlerResult = e;
          handlerException = true;
        }
      }
      f = handlerException ? promiseCapability.reject : promiseCapability.resolve;
      f(handlerResult);
    };

    var triggerPromiseReactions = function (reactions, argument) {
      _forEach(reactions, function (reaction) {
        enqueue(function () {
          promiseReactionJob(reaction, argument);
        });
      });
    };

    var fulfillPromise = function (promise, value) {
      var _promise = promise._promise;
      var reactions = _promise.fulfillReactions;
      _promise.result = value;
      _promise.fulfillReactions = void 0;
      _promise.rejectReactions = void 0;
      _promise.state = PROMISE_FULFILLED;
      triggerPromiseReactions(reactions, value);
    };

    var rejectPromise = function (promise, reason) {
      var _promise = promise._promise;
      var reactions = _promise.rejectReactions;
      _promise.result = reason;
      _promise.fulfillReactions = void 0;
      _promise.rejectReactions = void 0;
      _promise.state = PROMISE_REJECTED;
      triggerPromiseReactions(reactions, reason);
    };

    var createResolvingFunctions = function (promise) {
      var alreadyResolved = false;
      var resolve = function (resolution) {
        var then;
        if (alreadyResolved) { return; }
        alreadyResolved = true;
        if (resolution === promise) {
          return rejectPromise(promise, new TypeError('Self resolution'));
        }
        if (!ES.TypeIsObject(resolution)) {
          return fulfillPromise(promise, resolution);
        }
        try {
          then = resolution.then;
        } catch (e) {
          return rejectPromise(promise, e);
        }
        if (!ES.IsCallable(then)) {
          return fulfillPromise(promise, resolution);
        }
        enqueue(function () {
          promiseResolveThenableJob(promise, resolution, then);
        });
      };
      var reject = function (reason) {
        if (alreadyResolved) { return; }
        alreadyResolved = true;
        return rejectPromise(promise, reason);
      };
      return { resolve: resolve, reject: reject };
    };

    var promiseResolveThenableJob = function (promise, thenable, then) {
      var resolvingFunctions = createResolvingFunctions(promise);
      var resolve = resolvingFunctions.resolve;
      var reject = resolvingFunctions.reject;
      try {
        _call(then, thenable, resolve, reject);
      } catch (e) {
        reject(e);
      }
    };

    // This is a common step in many Promise methods
    var getPromiseSpecies = function (C) {
      if (!ES.TypeIsObject(C)) {
        throw new TypeError('Promise is not object');
      }
      var S = C[symbolSpecies];
      if (S !== void 0 && S !== null) {
        return S;
      }
      return C;
    };

    var Promise = function Promise(resolver) {
      if (!(this instanceof Promise)) {
        throw new TypeError('Constructor Promise requires "new"');
      }
      if (this && this._promise) {
        throw new TypeError('Bad construction');
      }
      // see https://bugs.ecmascript.org/show_bug.cgi?id=2482
      if (!ES.IsCallable(resolver)) {
        throw new TypeError('not a valid resolver');
      }
      var promise = emulateES6construct(this, Promise, Promise$prototype, {
        _promise: {
          result: void 0,
          state: PROMISE_PENDING,
          fulfillReactions: [],
          rejectReactions: []
        }
      });
      var resolvingFunctions = createResolvingFunctions(promise);
      var reject = resolvingFunctions.reject;
      try {
        resolver(resolvingFunctions.resolve, reject);
      } catch (e) {
        reject(e);
      }
      return promise;
    };
    var Promise$prototype = Promise.prototype;

    var _promiseAllResolver = function (index, values, capability, remaining) {
      var alreadyCalled = false;
      return function (x) {
        if (alreadyCalled) { return; }
        alreadyCalled = true;
        values[index] = x;
        if ((--remaining.count) === 0) {
          var resolve = capability.resolve;
          resolve(values); // call w/ this===undefined
        }
      };
    };

    var performPromiseAll = function (iteratorRecord, C, resultCapability) {
      var it = iteratorRecord.iterator;
      var values = [], remaining = { count: 1 }, next, nextValue;
      for (var index = 0; ; index++) {
        try {
          next = ES.IteratorStep(it);
          if (next === false) {
            iteratorRecord.done = true;
            break;
          }
          nextValue = next.value;
        } catch (e) {
          iteratorRecord.done = true;
          throw e;
        }
        values[index] = void 0;
        var nextPromise = C.resolve(nextValue);
        var resolveElement = _promiseAllResolver(
          index, values, resultCapability, remaining
        );
        remaining.count++;
        nextPromise.then(resolveElement, resultCapability.reject);
      }
      if ((--remaining.count) === 0) {
        var resolve = resultCapability.resolve;
        resolve(values); // call w/ this===undefined
      }
      return resultCapability.promise;
    };

    var performPromiseRace = function (iteratorRecord, C, resultCapability) {
      var it = iteratorRecord.iterator, next, nextValue, nextPromise;
      while (true) {
        try {
          next = ES.IteratorStep(it);
          if (next === false) {
            // NOTE: If iterable has no items, resulting promise will never
            // resolve; see:
            // https://github.com/domenic/promises-unwrapping/issues/75
            // https://bugs.ecmascript.org/show_bug.cgi?id=2515
            iteratorRecord.done = true;
            break;
          }
          nextValue = next.value;
        } catch (e) {
          iteratorRecord.done = true;
          throw e;
        }
        nextPromise = C.resolve(nextValue);
        nextPromise.then(resultCapability.resolve, resultCapability.reject);
      }
      return resultCapability.promise;
    };

    defineProperties(Promise, {
      all: function all(iterable) {
        var C = getPromiseSpecies(this);
        var capability = new PromiseCapability(C);
        var iterator, iteratorRecord;
        try {
          iterator = ES.GetIterator(iterable);
          iteratorRecord = { iterator: iterator, done: false };
          return performPromiseAll(iteratorRecord, C, capability);
        } catch (e) {
          if (iteratorRecord && !iteratorRecord.done) {
            try {
              ES.IteratorClose(iterator, true);
            } catch (ee) {
              e = ee;
            }
          }
          var reject = capability.reject;
          reject(e);
          return capability.promise;
        }
      },

      race: function race(iterable) {
        var C = getPromiseSpecies(this);
        var capability = new PromiseCapability(C);
        var iterator, iteratorRecord;
        try {
          iterator = ES.GetIterator(iterable);
          iteratorRecord = { iterator: iterator, done: false };
          return performPromiseRace(iteratorRecord, C, capability);
        } catch (e) {
          if (iteratorRecord && !iteratorRecord.done) {
            try {
              ES.IteratorClose(iterator, true);
            } catch (ee) {
              e = ee;
            }
          }
          var reject = capability.reject;
          reject(e);
          return capability.promise;
        }
      },

      reject: function reject(reason) {
        var C = this;
        var capability = new PromiseCapability(C);
        var rejectFunc = capability.reject;
        rejectFunc(reason); // call with this===undefined
        return capability.promise;
      },

      resolve: function resolve(v) {
        // See https://esdiscuss.org/topic/fixing-promise-resolve for spec
        var C = this;
        if (ES.IsPromise(v)) {
          var constructor = v.constructor;
          if (constructor === C) { return v; }
        }
        var capability = new PromiseCapability(C);
        var resolveFunc = capability.resolve;
        resolveFunc(v); // call with this===undefined
        return capability.promise;
      }
    });

    defineProperties(Promise$prototype, {
      'catch': function (onRejected) {
        return this.then(void 0, onRejected);
      },

      then: function then(onFulfilled, onRejected) {
        var promise = this;
        if (!ES.IsPromise(promise)) { throw new TypeError('not a promise'); }
        var C = ES.SpeciesConstructor(promise, Promise);
        var resultCapability = new PromiseCapability(C);
        // PerformPromiseThen(promise, onFulfilled, onRejected, resultCapability)
        if (!ES.IsCallable(onFulfilled)) {
          onFulfilled = PROMISE_IDENTITY;
        }
        if (!ES.IsCallable(onRejected)) {
          onRejected = PROMISE_THROWER;
        }
        var fulfillReaction = { capabilities: resultCapability, handler: onFulfilled };
        var rejectReaction = { capabilities: resultCapability, handler: onRejected };
        var _promise = promise._promise, value;
        switch (_promise.state) {
          case PROMISE_PENDING:
            _push(_promise.fulfillReactions, fulfillReaction);
            _push(_promise.rejectReactions, rejectReaction);
            break;
          case PROMISE_FULFILLED:
            value = _promise.result;
            enqueue(function () {
              promiseReactionJob(fulfillReaction, value);
            });
            break;
          case PROMISE_REJECTED:
            value = _promise.result;
            enqueue(function () {
              promiseReactionJob(rejectReaction, value);
            });
            break;
          default:
            throw new TypeError('unexpected');
        }
        return resultCapability.promise;
      }
    });

    return Promise;
  }());

  // Chrome's native Promise has extra methods that it shouldn't have. Let's remove them.
  if (globals.Promise) {
    delete globals.Promise.accept;
    delete globals.Promise.defer;
    delete globals.Promise.prototype.chain;
  }

  // export the Promise constructor.
  defineProperties(globals, { Promise: PromiseShim });
  // In Chrome 33 (and thereabouts) Promise is defined, but the
  // implementation is buggy in a number of ways.  Let's check subclassing
  // support to see if we have a buggy implementation.
  var promiseSupportsSubclassing = supportsSubclassing(globals.Promise, function (S) {
    return S.resolve(42).then(function () {}) instanceof S;
  });
  var promiseIgnoresNonFunctionThenCallbacks = !throwsError(function () { globals.Promise.reject(42).then(null, 5).then(null, noop); });
  var promiseRequiresObjectContext = throwsError(function () { globals.Promise.call(3, noop); });
  // Promise.resolve() was errata'ed late in the ES6 process.
  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1170742
  //      https://code.google.com/p/v8/issues/detail?id=4161
  // It serves as a proxy for a number of other bugs in early Promise
  // implementations.
  var promiseResolveBroken = (function (Promise) {
    var p = Promise.resolve(5);
    p.constructor = {};
    var p2 = Promise.resolve(p);
    return (p === p2); // This *should* be false!
  })(globals.Promise);
  if (!promiseSupportsSubclassing || !promiseIgnoresNonFunctionThenCallbacks ||
      !promiseRequiresObjectContext || promiseResolveBroken) {
    /*globals Promise: true */
    Promise = PromiseShim;
    /*globals Promise: false */
    overrideNative(globals, 'Promise', PromiseShim);
  }
  addDefaultSpecies(Promise);

  // Map and Set require a true ES5 environment
  // Their fast path also requires that the environment preserve
  // property insertion order, which is not guaranteed by the spec.
  var testOrder = function (a) {
    var b = Object.keys(_reduce(a, function (o, k) {
      o[k] = true;
      return o;
    }, {}));
    return a.join(':') === b.join(':');
  };
  var preservesInsertionOrder = testOrder(['z', 'a', 'bb']);
  // some engines (eg, Chrome) only preserve insertion order for string keys
  var preservesNumericInsertionOrder = testOrder(['z', 1, 'a', '3', 2]);

  if (supportsDescriptors) {

    var fastkey = function fastkey(key) {
      if (!preservesInsertionOrder) {
        return null;
      }
      var type = typeof key;
      if (type === 'undefined' || key === null) {
        return '^' + String(key);
      } else if (type === 'string') {
        return '$' + key;
      } else if (type === 'number') {
        // note that -0 will get coerced to "0" when used as a property key
        if (!preservesNumericInsertionOrder) {
          return 'n' + key;
        }
        return key;
      } else if (type === 'boolean') {
        return 'b' + key;
      }
      return null;
    };

    var emptyObject = function emptyObject() {
      // accomodate some older not-quite-ES5 browsers
      return Object.create ? Object.create(null) : {};
    };

    var addIterableToMap = function addIterableToMap(MapConstructor, map, iterable) {
      if (Array.isArray(iterable) || Type.string(iterable)) {
        _forEach(iterable, function (entry) {
          map.set(entry[0], entry[1]);
        });
      } else if (iterable instanceof MapConstructor) {
        _call(MapConstructor.prototype.forEach, iterable, function (value, key) {
          map.set(key, value);
        });
      } else {
        var iter, adder;
        if (iterable !== null && typeof iterable !== 'undefined') {
          adder = map.set;
          if (!ES.IsCallable(adder)) { throw new TypeError('bad map'); }
          iter = ES.GetIterator(iterable);
        }
        if (typeof iter !== 'undefined') {
          while (true) {
            var next = ES.IteratorStep(iter);
            if (next === false) { break; }
            var nextItem = next.value;
            try {
              if (!ES.TypeIsObject(nextItem)) {
                throw new TypeError('expected iterable of pairs');
              }
              _call(adder, map, nextItem[0], nextItem[1]);
            } catch (e) {
              ES.IteratorClose(iter, true);
              throw e;
            }
          }
        }
      }
    };
    var addIterableToSet = function addIterableToSet(SetConstructor, set, iterable) {
      if (Array.isArray(iterable) || Type.string(iterable)) {
        _forEach(iterable, function (value) {
          set.add(value);
        });
      } else if (iterable instanceof SetConstructor) {
        _call(SetConstructor.prototype.forEach, iterable, function (value) {
          set.add(value);
        });
      } else {
        var iter, adder;
        if (iterable !== null && typeof iterable !== 'undefined') {
          adder = set.add;
          if (!ES.IsCallable(adder)) { throw new TypeError('bad set'); }
          iter = ES.GetIterator(iterable);
        }
        if (typeof iter !== 'undefined') {
          while (true) {
            var next = ES.IteratorStep(iter);
            if (next === false) { break; }
            var nextValue = next.value;
            try {
              _call(adder, set, nextValue);
            } catch (e) {
              ES.IteratorClose(iter, true);
              throw e;
            }
          }
        }
      }
    };

    var collectionShims = {
      Map: (function () {

        var empty = {};

        var MapEntry = function MapEntry(key, value) {
          this.key = key;
          this.value = value;
          this.next = null;
          this.prev = null;
        };

        MapEntry.prototype.isRemoved = function isRemoved() {
          return this.key === empty;
        };

        var isMap = function isMap(map) {
          return !!map._es6map;
        };

        var requireMapSlot = function requireMapSlot(map, method) {
          if (!ES.TypeIsObject(map) || !isMap(map)) {
            throw new TypeError('Method Map.prototype.' + method + ' called on incompatible receiver ' + String(map));
          }
        };

        var MapIterator = function MapIterator(map, kind) {
          requireMapSlot(map, '[[MapIterator]]');
          this.head = map._head;
          this.i = this.head;
          this.kind = kind;
        };

        MapIterator.prototype = {
          next: function next() {
            var i = this.i, kind = this.kind, head = this.head, result;
            if (typeof this.i === 'undefined') {
              return { value: void 0, done: true };
            }
            while (i.isRemoved() && i !== head) {
              // back up off of removed entries
              i = i.prev;
            }
            // advance to next unreturned element.
            while (i.next !== head) {
              i = i.next;
              if (!i.isRemoved()) {
                if (kind === 'key') {
                  result = i.key;
                } else if (kind === 'value') {
                  result = i.value;
                } else {
                  result = [i.key, i.value];
                }
                this.i = i;
                return { value: result, done: false };
              }
            }
            // once the iterator is done, it is done forever.
            this.i = void 0;
            return { value: void 0, done: true };
          }
        };
        addIterator(MapIterator.prototype);

        var MapShim = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          if (this && this._es6map) {
            throw new TypeError('Bad construction');
          }
          var map = emulateES6construct(this, Map, Map$prototype, {
            _es6map: true,
            _head: null,
            _storage: emptyObject(),
            _size: 0
          });

          var head = new MapEntry(null, null);
          // circular doubly-linked list.
          head.next = head.prev = head;
          map._head = head;

          // Optionally initialize map from iterable
          if (arguments.length > 0) {
            addIterableToMap(Map, map, arguments[0]);
          }
          return map;
        };
        var Map$prototype = MapShim.prototype;

        Value.getter(Map$prototype, 'size', function () {
          if (typeof this._size === 'undefined') {
            throw new TypeError('size method called on incompatible Map');
          }
          return this._size;
        });

        defineProperties(Map$prototype, {
          get: function get(key) {
            requireMapSlot(this, 'get');
            var fkey = fastkey(key);
            if (fkey !== null) {
              // fast O(1) path
              var entry = this._storage[fkey];
              if (entry) {
                return entry.value;
              } else {
                return;
              }
            }
            var head = this._head, i = head;
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                return i.value;
              }
            }
          },

          has: function has(key) {
            requireMapSlot(this, 'has');
            var fkey = fastkey(key);
            if (fkey !== null) {
              // fast O(1) path
              return typeof this._storage[fkey] !== 'undefined';
            }
            var head = this._head, i = head;
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                return true;
              }
            }
            return false;
          },

          set: function set(key, value) {
            requireMapSlot(this, 'set');
            var head = this._head, i = head, entry;
            var fkey = fastkey(key);
            if (fkey !== null) {
              // fast O(1) path
              if (typeof this._storage[fkey] !== 'undefined') {
                this._storage[fkey].value = value;
                return this;
              } else {
                entry = this._storage[fkey] = new MapEntry(key, value);
                i = head.prev;
                // fall through
              }
            }
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                i.value = value;
                return this;
              }
            }
            entry = entry || new MapEntry(key, value);
            if (ES.SameValue(-0, key)) {
              entry.key = +0; // coerce -0 to +0 in entry
            }
            entry.next = this._head;
            entry.prev = this._head.prev;
            entry.prev.next = entry;
            entry.next.prev = entry;
            this._size += 1;
            return this;
          },

          'delete': function (key) {
            requireMapSlot(this, 'delete');
            var head = this._head, i = head;
            var fkey = fastkey(key);
            if (fkey !== null) {
              // fast O(1) path
              if (typeof this._storage[fkey] === 'undefined') {
                return false;
              }
              i = this._storage[fkey].prev;
              delete this._storage[fkey];
              // fall through
            }
            while ((i = i.next) !== head) {
              if (ES.SameValueZero(i.key, key)) {
                i.key = i.value = empty;
                i.prev.next = i.next;
                i.next.prev = i.prev;
                this._size -= 1;
                return true;
              }
            }
            return false;
          },

          clear: function clear() {
            requireMapSlot(this, 'clear');
            this._size = 0;
            this._storage = emptyObject();
            var head = this._head, i = head, p = i.next;
            while ((i = p) !== head) {
              i.key = i.value = empty;
              p = i.next;
              i.next = i.prev = head;
            }
            head.next = head.prev = head;
          },

          keys: function keys() {
            requireMapSlot(this, 'keys');
            return new MapIterator(this, 'key');
          },

          values: function values() {
            requireMapSlot(this, 'values');
            return new MapIterator(this, 'value');
          },

          entries: function entries() {
            requireMapSlot(this, 'entries');
            return new MapIterator(this, 'key+value');
          },

          forEach: function forEach(callback) {
            requireMapSlot(this, 'forEach');
            var context = arguments.length > 1 ? arguments[1] : null;
            var it = this.entries();
            for (var entry = it.next(); !entry.done; entry = it.next()) {
              if (context) {
                _call(callback, context, entry.value[1], entry.value[0], this);
              } else {
                callback(entry.value[1], entry.value[0], this);
              }
            }
          }
        });
        addIterator(Map$prototype, Map$prototype.entries);

        return MapShim;
      }())
      ,

      Set: (function () {
        var isSet = function isSet(set) {
          return set._es6set && typeof set._storage !== 'undefined';
        };
        var requireSetSlot = function requireSetSlot(set, method) {
          if (!ES.TypeIsObject(set) || !isSet(set)) {
            // https://github.com/paulmillr/es6-shim/issues/176
            throw new TypeError('Set.prototype.' + method + ' called on incompatible receiver ' + String(set));
          }
        };

        // Creating a Map is expensive.  To speed up the common case of
        // Sets containing only string or numeric keys, we use an object
        // as backing storage and lazily create a full Map only when
        // required.
        var SetShim = function Set() {
          if (!(this instanceof Set)) {
            throw new TypeError('Constructor Set requires "new"');
          }
          if (this && this._es6set) {
            throw new TypeError('Bad construction');
          }
          var set = emulateES6construct(this, Set, Set$prototype, {
            _es6set: true,
            '[[SetData]]': null,
            _storage: emptyObject()
          });
          if (!set._es6set) {
            throw new TypeError('bad set');
          }

          // Optionally initialize Set from iterable
          if (arguments.length > 0) {
            addIterableToSet(Set, set, arguments[0]);
          }
          return set;
        };
        var Set$prototype = SetShim.prototype;

        // Switch from the object backing storage to a full Map.
        var ensureMap = function ensureMap(set) {
          if (!set['[[SetData]]']) {
            var m = set['[[SetData]]'] = new collectionShims.Map();
            _forEach(Object.keys(set._storage), function (k) {
              if (k === '^null') {
                k = null;
              } else if (k === '^undefined') {
                k = void 0;
              } else {
                var first = k.charAt(0);
                if (first === '$') {
                  k = _strSlice(k, 1);
                } else if (first === 'n') {
                  k = +_strSlice(k, 1);
                } else if (first === 'b') {
                  k = k === 'btrue';
                } else {
                  k = +k;
                }
              }
              m.set(k, k);
            });
            set._storage = null; // free old backing storage
          }
        };

        Value.getter(SetShim.prototype, 'size', function () {
          requireSetSlot(this, 'size');
          ensureMap(this);
          return this['[[SetData]]'].size;
        });

        defineProperties(SetShim.prototype, {
          has: function has(key) {
            requireSetSlot(this, 'has');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              return !!this._storage[fkey];
            }
            ensureMap(this);
            return this['[[SetData]]'].has(key);
          },

          add: function add(key) {
            requireSetSlot(this, 'add');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              this._storage[fkey] = true;
              return this;
            }
            ensureMap(this);
            this['[[SetData]]'].set(key, key);
            return this;
          },

          'delete': function (key) {
            requireSetSlot(this, 'delete');
            var fkey;
            if (this._storage && (fkey = fastkey(key)) !== null) {
              var hasFKey = _hasOwnProperty(this._storage, fkey);
              return (delete this._storage[fkey]) && hasFKey;
            }
            ensureMap(this);
            return this['[[SetData]]']['delete'](key);
          },

          clear: function clear() {
            requireSetSlot(this, 'clear');
            if (this._storage) {
              this._storage = emptyObject();
            } else {
              this['[[SetData]]'].clear();
            }
          },

          values: function values() {
            requireSetSlot(this, 'values');
            ensureMap(this);
            return this['[[SetData]]'].values();
          },

          entries: function entries() {
            requireSetSlot(this, 'entries');
            ensureMap(this);
            return this['[[SetData]]'].entries();
          },

          forEach: function forEach(callback) {
            requireSetSlot(this, 'forEach');
            var context = arguments.length > 1 ? arguments[1] : null;
            var entireSet = this;
            ensureMap(entireSet);
            this['[[SetData]]'].forEach(function (value, key) {
              if (context) {
                _call(callback, context, key, key, entireSet);
              } else {
                callback(key, key, entireSet);
              }
            });
          }
        });
        defineProperty(SetShim.prototype, 'keys', SetShim.prototype.values, true);
        addIterator(SetShim.prototype, SetShim.prototype.values);

        return SetShim;
      }())
    };
    defineProperties(globals, collectionShims);

    if (globals.Map || globals.Set) {
      // Safari 8, for example, doesn't accept an iterable.
      var mapAcceptsArguments = valueOrFalseIfThrows(function () { return new Map([[1, 2]]).get(1) === 2; });
      if (!mapAcceptsArguments) {
        var OrigMapNoArgs = globals.Map;
        globals.Map = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          var m = new OrigMapNoArgs();
          if (arguments.length > 0) {
            addIterableToMap(Map, m, arguments[0]);
          }
          Object.setPrototypeOf(m, globals.Map.prototype);
          defineProperty(m, 'constructor', Map, true);
          return m;
        };
        globals.Map.prototype = create(OrigMapNoArgs.prototype);
        Value.preserveToString(globals.Map, OrigMapNoArgs);
      }
      var testMap = new Map();
      var mapUsesSameValueZero = (function (m) {
        m['delete'](0);
        m['delete'](-0);
        m.set(0, 3);
        m.get(-0, 4);
        return m.get(0) === 3 && m.get(-0) === 4;
      }(testMap));
      var mapSupportsChaining = testMap.set(1, 2) === testMap;
      if (!mapUsesSameValueZero || !mapSupportsChaining) {
        var origMapSet = Map.prototype.set;
        overrideNative(Map.prototype, 'set', function set(k, v) {
          _call(origMapSet, this, k === 0 ? 0 : k, v);
          return this;
        });
      }
      if (!mapUsesSameValueZero) {
        var origMapGet = Map.prototype.get;
        var origMapHas = Map.prototype.has;
        defineProperties(Map.prototype, {
          get: function get(k) {
            return _call(origMapGet, this, k === 0 ? 0 : k);
          },
          has: function has(k) {
            return _call(origMapHas, this, k === 0 ? 0 : k);
          }
        }, true);
        Value.preserveToString(Map.prototype.get, origMapGet);
        Value.preserveToString(Map.prototype.has, origMapHas);
      }
      var testSet = new Set();
      var setUsesSameValueZero = (function (s) {
        s['delete'](0);
        s.add(-0);
        return !s.has(0);
      }(testSet));
      var setSupportsChaining = testSet.add(1) === testSet;
      if (!setUsesSameValueZero || !setSupportsChaining) {
        var origSetAdd = Set.prototype.add;
        Set.prototype.add = function add(v) {
          _call(origSetAdd, this, v === 0 ? 0 : v);
          return this;
        };
        Value.preserveToString(Set.prototype.add, origSetAdd);
      }
      if (!setUsesSameValueZero) {
        var origSetHas = Set.prototype.has;
        Set.prototype.has = function has(v) {
          return _call(origSetHas, this, v === 0 ? 0 : v);
        };
        Value.preserveToString(Set.prototype.has, origSetHas);
        var origSetDel = Set.prototype['delete'];
        Set.prototype['delete'] = function SetDelete(v) {
          return _call(origSetDel, this, v === 0 ? 0 : v);
        };
        Value.preserveToString(Set.prototype['delete'], origSetDel);
      }
      var mapSupportsSubclassing = supportsSubclassing(globals.Map, function (M) {
        var m = new M([]);
        // Firefox 32 is ok with the instantiating the subclass but will
        // throw when the map is used.
        m.set(42, 42);
        return m instanceof M;
      });
      var mapFailsToSupportSubclassing = Object.setPrototypeOf && !mapSupportsSubclassing; // without Object.setPrototypeOf, subclassing is not possible
      var mapRequiresNew = (function () {
        try {
          return !(globals.Map() instanceof globals.Map);
        } catch (e) {
          return e instanceof TypeError;
        }
      }());
      if (globals.Map.length !== 0 || mapFailsToSupportSubclassing || !mapRequiresNew) {
        var OrigMap = globals.Map;
        globals.Map = function Map() {
          if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires "new"');
          }
          var m = new OrigMap();
          if (arguments.length > 0) {
            addIterableToMap(Map, m, arguments[0]);
          }
          Object.setPrototypeOf(m, Map.prototype);
          defineProperty(m, 'constructor', Map, true);
          return m;
        };
        globals.Map.prototype = OrigMap.prototype;
        Value.preserveToString(globals.Map, OrigMap);
      }
      var setSupportsSubclassing = supportsSubclassing(globals.Set, function (S) {
        var s = new S([]);
        s.add(42, 42);
        return s instanceof S;
      });
      var setFailsToSupportSubclassing = Object.setPrototypeOf && !setSupportsSubclassing; // without Object.setPrototypeOf, subclassing is not possible
      var setRequiresNew = (function () {
        try {
          return !(globals.Set() instanceof globals.Set);
        } catch (e) {
          return e instanceof TypeError;
        }
      }());
      if (globals.Set.length !== 0 || setFailsToSupportSubclassing || !setRequiresNew) {
        var OrigSet = globals.Set;
        globals.Set = function Set() {
          if (!(this instanceof Set)) {
            throw new TypeError('Constructor Set requires "new"');
          }
          var s = new OrigSet();
          if (arguments.length > 0) {
            addIterableToSet(Set, s, arguments[0]);
          }
          Object.setPrototypeOf(s, Set.prototype);
          defineProperty(s, 'constructor', Set, true);
          return s;
        };
        globals.Set.prototype = OrigSet.prototype;
        Value.preserveToString(globals.Set, OrigSet);
      }
      var mapIterationThrowsStopIterator = !valueOrFalseIfThrows(function () {
        return (new Map()).keys().next().done;
      });
      /*
        - In Firefox < 23, Map#size is a function.
        - In all current Firefox, Set#entries/keys/values & Map#clear do not exist
        - https://bugzilla.mozilla.org/show_bug.cgi?id=869996
        - In Firefox 24, Map and Set do not implement forEach
        - In Firefox 25 at least, Map and Set are callable without "new"
      */
      if (
        typeof globals.Map.prototype.clear !== 'function' ||
        new globals.Set().size !== 0 ||
        new globals.Map().size !== 0 ||
        typeof globals.Map.prototype.keys !== 'function' ||
        typeof globals.Set.prototype.keys !== 'function' ||
        typeof globals.Map.prototype.forEach !== 'function' ||
        typeof globals.Set.prototype.forEach !== 'function' ||
        isCallableWithoutNew(globals.Map) ||
        isCallableWithoutNew(globals.Set) ||
        typeof (new globals.Map().keys().next) !== 'function' || // Safari 8
        mapIterationThrowsStopIterator || // Firefox 25
        !mapSupportsSubclassing
      ) {
        delete globals.Map; // necessary to overwrite in Safari 8
        delete globals.Set; // necessary to overwrite in Safari 8
        defineProperties(globals, {
          Map: collectionShims.Map,
          Set: collectionShims.Set
        }, true);
      }
    }
    if (globals.Set.prototype.keys !== globals.Set.prototype.values) {
      // Fixed in WebKit with https://bugs.webkit.org/show_bug.cgi?id=144190
      defineProperty(globals.Set.prototype, 'keys', globals.Set.prototype.values, true);
    }
    // Shim incomplete iterator implementations.
    addIterator(Object.getPrototypeOf((new globals.Map()).keys()));
    addIterator(Object.getPrototypeOf((new globals.Set()).keys()));
  }
  addDefaultSpecies(Map);
  addDefaultSpecies(Set);

  return globals;
}));

/*! https://mths.be/includes v1.0.0 by @mathias */
if (!String.prototype.includes) {
    (function() {
        'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
        var toString = {}.toString;
        var defineProperty = (function() {
            // IE 8 only supports `Object.defineProperty` on DOM elements
            try {
                var object = {};
                var $defineProperty = Object.defineProperty;
                var result = $defineProperty(object, object, object) && $defineProperty;
            } catch(error) {}
            return result;
        }());
        var indexOf = ''.indexOf;
        var includes = function(search) {
            if (this == null) {
                throw TypeError();
            }
            var string = String(this);
            if (search && toString.call(search) == '[object RegExp]') {
                throw TypeError();
            }
            var stringLength = string.length;
            var searchString = String(search);
            var searchLength = searchString.length;
            var position = arguments.length > 1 ? arguments[1] : undefined;
            // `ToInteger`
            var pos = position ? Number(position) : 0;
            if (pos != pos) { // better `isNaN`
                pos = 0;
            }
            var start = Math.min(Math.max(pos, 0), stringLength);
            // Avoid the `indexOf` call if no match is possible
            if (searchLength + start > stringLength) {
                return false;
            }
            return indexOf.call(string, searchString, pos) != -1;
        };
        if (defineProperty) {
            defineProperty(String.prototype, 'includes', {
                'value': includes,
                'configurable': true,
                'writable': true
            });
        } else {
            String.prototype.includes = includes;
        }
    }());
}
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { "default": obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
  * @Animator Class
  *
  * @description Houses all Animator functionality
  * @returns {Object}
  */

var _prefixes = require("./prefixes");

var _prefixes2 = _interopRequireDefault(_prefixes);

var _cssUtils = require("./css-utils");

var _cssUtils2 = _interopRequireDefault(_cssUtils);

var _domUtils = require("./dom-utils");

var _domUtils2 = _interopRequireDefault(_domUtils);

var _animationSeq = require("./animation-seq");

var _animationSeq2 = _interopRequireDefault(_animationSeq);

var _transitionSeq = require("./transition-seq");

var _transitionSeq2 = _interopRequireDefault(_transitionSeq);

var _comboSeq = require("./combo-seq");

var _comboSeq2 = _interopRequireDefault(_comboSeq);

var _seqWrapper = require("./seq-wrapper");

var _seqWrapper2 = _interopRequireDefault(_seqWrapper);

var _tracker = require("./tracker");

var _tracker2 = _interopRequireDefault(_tracker);

var Animator = (function () {

  /**
    * @constructor function
    *
    * @description Creates a stylesheet and Tracker object to be used throughout Animator.
    */

  function Animator() {
    _classCallCheck(this, Animator);

    this.stylesheet = new _cssUtils2["default"]().createStyleSheet();
    this.tracker = new _tracker2["default"](_domUtils2["default"], _prefixes2["default"], _cssUtils2["default"], _transitionSeq2["default"]);
  }

  _createClass(Animator, [{
    key: "getPrefix",

    /**
      * @getPrefix function
      *
      * @params {String}
      * @description Returns a prefixed CSS property or DOM event name.
      * @return {String}
      */

    value: function getPrefix(prefix) {
      return new _prefixes2["default"]().getPrefix(prefix);
    }
  }, {
    key: "setStyles",

    /**
      * @setStyles function
      *
      * @params {HTMLElement, String / Array}
      * @description Sets properties / values on an element's CSSStyleDeclaration.
      */

    value: function setStyles(element, styles) {
      return new _cssUtils2["default"]().setStyles(element, styles);
    }
  }, {
    key: "getStyles",

    /**
      * @getStyles function
      *
      * @params {HTMLElement, Object}
      * @description Return an object of CSS properties / values.
      * @return {Object}
      */

    value: function getStyles(element, properties) {
      return new _cssUtils2["default"]().getStyles(element, properties);
    }
  }, {
    key: "createTransition",

    /**
      * @createTransition function
      *
      * @params {Object}
      * @description Creates a CSS transition definition.
      */

    value: function createTransition(transition) {
      new _cssUtils2["default"]().createTransition(transition, _prefixes2["default"]);
    }
  }, {
    key: "createAnimation",

    /**
      * @createAnimation function
      *
      * @params {Object}
      * @description Creates a CSS keyframe animation definition.
      */

    value: function createAnimation(animation) {
      new _cssUtils2["default"]().createKeyframeAnimation(animation, _prefixes2["default"], this.stylesheet);
    }
  }, {
    key: "createClass",

    /**
      * @createClass function
      *
      * @params {String, Object}
      * @description Creates a CSS class and appends it to the stylesheet.
      */

    value: function createClass(className, rules) {
      new _cssUtils2["default"]().createClass(className, this.stylesheet, rules);
    }
  }, {
    key: "deleteClass",

    /**
      * @deleteClass function
      *
      * @params {String}
      * @description Deletes a CSS class from the stylesheet.
      */

    value: function deleteClass(className) {
      new _cssUtils2["default"]().deleteClass(className, this.stylesheet);
    }
  }, {
    key: "createCSSRule",

    /**
      * @createCSSRule function
      *
      * @params {String / Array, String / Array}
      * @description Returns a CSS property / value pairs object.
      * @returns {Object}
      */

    value: function createCSSRule(property, value) {
      return new _cssUtils2["default"]().createCSSRule(property, value);
    }
  }, {
    key: "addClass",

    /**
      * @addClass function
      *
      * @params {HTMLElement / Nodelist, String / Array}
      * @description Sets a class(es) on an element.
      */

    value: function addClass(element, classList) {
      new _domUtils2["default"]().setClass(element, classList, true);
    }
  }, {
    key: "removeClass",

    /**
      * @removeClass function
      *
      * @params {HTMLElement / Nodelist, String / Array}
      * @description Removes a class(es) from an element.
      */

    value: function removeClass(element, classList) {
      new _domUtils2["default"]().setClass(element, classList, false);
    }
  }, {
    key: "transition",

    /**
      * @transition function
      *
      * @params {Object}
      * @description Creates a transition sequence.
      * @returns {Promise}
      */

    value: function transition(options) {
      return new _seqWrapper2["default"](options, _domUtils2["default"], _prefixes2["default"], _cssUtils2["default"], _transitionSeq2["default"], _comboSeq2["default"], this.tracker);
    }
  }, {
    key: "animation",

    /**
      * @animation function
      *
      * @params {Object}
      * @description Creates an animation sequence.
      * @returns {Promise}
      */

    value: function animation(options) {
      return new _seqWrapper2["default"](options, _domUtils2["default"], _prefixes2["default"], _cssUtils2["default"], _animationSeq2["default"], _comboSeq2["default"], this.tracker);
    }
  }, {
    key: "combo",

    /**
      * @combo function
      *
      * @params {Object}
      * @description Creates an combination of sequence.
      * @returns {Promise}
      */

    value: function combo(animations) {
      return new _comboSeq2["default"](animations);
    }
  }, {
    key: "isSupported",

    /**
      * @isSupported function
      *
      * @description Tests the browser for Animator support.
      * @returns {Boolean}
      */

    value: function isSupported() {
      return new _domUtils2["default"]().support(_prefixes2["default"], _cssUtils2["default"]);
    }
  }, {
    key: "pause",

    /**
      * @pause function
      *
      * @description Pause the current sequence.
      */

    value: function pause() {
      this.tracker.pause();
    }
  }, {
    key: "play",

    /**
      * @play function
      *
      * @description Plays the current sequence.
      */

    value: function play() {
      this.tracker.play();
    }
  }]);

  return Animator;
})();

window.Animator = new Animator();

},{"./animation-seq":2,"./combo-seq":3,"./css-utils":4,"./dom-utils":5,"./prefixes":6,"./seq-wrapper":7,"./tracker":8,"./transition-seq":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

/**
  * @Animation Class
  *
  * @description Promise based animation handler that resolves when animations triggered on an element are complete.
  * @returns {Resolved Promise}
  */

var Animation = (function () {

	/**
   * @constructor function
   *
   * @params {Object, Class, Class, Class, Class, Object}  
   * @description Creates a new animation sequence.    
 * @params description
 - options {Object} Animation options.
 	- element {HTMLElement} The element to set the animation on.
 	- setStyles {Object} Styles to be set before / after the animation.
 		- before {Object} Object of CSS property / value pairs to be set before the animation.
 		- after {Object} Object of CSS property / value pairs to be set after the animation.
 	- addClass {Object} Object of classnames to be set before / after the animation.
 		- before {String} Classname to set before the animation.
 		- after {String} Classname to set after the animation.
 	- removeClass {Object} Object of classnames to be removed before / after the animation.
 		- before {String} Classname to be removed before the animation.
 		- after {String} Classname to be removed after the animation.
 - DomUtils {Class} Dom utility class.
 - Prefix {Class} Prefix class.
 - CssUtils {Class} CSS Utilities class.
 - Tracker {Object} Object that tracks and monitors sequences.
 * @returns {Promise}
   */

	function Animation(options, DomUtils, Prefix, CssUtils, Tracker) {
		var _this = this;

		_classCallCheck(this, Animation);

		this.options = options;
		this.domUtils = new DomUtils();
		this.cssUtils = new CssUtils();
		this.prefix = new Prefix().getPrefix("animationend");
		this.onAnimationEnd = this.animationEnd.bind(this);
		this.tracker = Tracker;

		return new Promise(function (resolve, reject) {
			_this.resolve = resolve;
			_this.reject = reject;
			_this.animationFrame = requestAnimationFrame(_this.animationStart.bind(_this));
		});
	}

	_createClass(Animation, [{
		key: "animationStart",

		/**
    * @animationStart function
    *
    * @description Sets classnames / style rules to trigger the animation.
    * @global no
    */

		value: function animationStart() {

			var opts = this.options;
			opts.element.addEventListener(this.prefix, this.onAnimationEnd, false);

			if (opts.setStyles && opts.setStyles.before) {
				this.cssUtils.setStyles(opts.element, opts.setStyles.before);
			}

			if (opts.removeClass && opts.removeClass.before) {
				this.domUtils.setClass(opts.element, opts.removeClass.before, false);
			}

			if (opts.addClass && opts.addClass.before) {
				this.domUtils.setClass(opts.element, opts.addClass.before, true);
			}
		}
	}, {
		key: "animationEnd",

		/**
    * @animationEnd function
    *
    * @description Sets classnames / style rules after all animations have completed and removes the element from the tracker.
    * @global no
    * @returns {Resolved Promise}
    */

		value: function animationEnd(evt) {

			evt.stopPropagation();

			var opts = this.options;
			opts.element.removeEventListener(this.prefix, this.onAnimationEnd, false);
			cancelAnimationFrame(this.animationFrame);

			if (opts.setStyles && opts.setStyles.after) {
				this.cssUtils.setStyles(opts.element, opts.setStyles.after);
			}

			if (opts.removeClass && opts.removeClass.after) {
				this.domUtils.setClass(opts.element, opts.removeClass.after, false);
			}

			if (opts.addClass && opts.addClass.after) {
				this.domUtils.setClass(opts.element, opts.addClass.after, true);
			}

			this.tracker.remove("Animations", opts.element);
			this.resolve(opts.element);
		}
	}]);

	return Animation;
})();

exports["default"] = Animation;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

/**
  * @Combo Class
  *
  * @description Wraps a Promise around x amount of sequences and resolves when all sequences have resolved.
  * @returns {Resolved Promise}
  */

var Combo = (function () {

	/**
   * @constructor function
   *
   * @params {Array, Class}  
   * @description Wraps x amount of sequences in a Promise.    
 * @params description
 - sequences {Array} An array of sequences.
 * @returns {Promise}
   */

	function Combo(sequences) {
		var _this = this;

		_classCallCheck(this, Combo);

		return new Promise(function (resolve, reject) {

			var watcher = _this.sequenceWatcher();
			_this.resolve = resolve;
			_this.reject = reject;
			_this.amount = sequences.length;

			sequences.forEach(function (sequence) {

				sequence.then(function (element) {
					watcher(element);
				})["catch"](function (e) {
					_this.reject(e);
				});
			});
		});
	}

	_createClass(Combo, [{
		key: "sequenceWatcher",

		/**
    * @sequenceWatcher function
    *
    * @description Resolves when all sequences have been resolved.   
  * @returns {Resolved Promise}
    * @global no
    */

		value: function sequenceWatcher() {
			var _this2 = this;

			var count = 0;
			var returnData = [];
			return function (element) {

				count++;
				returnData.push(element);
				if (count === _this2.amount) {
					_this2.resolve(returnData);
				}
			};
		}
	}]);

	return Combo;
})();

exports["default"] = Combo;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
})();

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
    } else {
        return Array.from(arr);
    }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

/**
  * @CssUtils Class
  *
  * @description CSS utility belt for Animator using the CSSOM (file:/// protocol not supported in Chrome) 
  * @returns {Object}
  */

var CssUtils = (function () {
    function CssUtils() {
        _classCallCheck(this, CssUtils);
    }

    _createClass(CssUtils, [{
        key: "createStyleSheet",

        /**
          * @createStyleSheet function
          *
          * @description A stylesheet for any transition / animation / style classes created in Animator.
          * @returns {CSSStyleSheet} stylesheet
          * @global no
          */

        value: function createStyleSheet() {

            var style = document.createElement("style");
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            return style.sheet;
        }
    }, {
        key: "cssTextToJs",

        /**
          * @cssTextToJs function
          *
          * @params {String}
          * @description Converts a hyphen delimted CSS property to a camel cased JavaScript property.
          * @returns {String}
          * @global no
          */

        value: function cssTextToJs(cssText) {

            return cssText.replace(/\-(\w)/g, function (str, letter) {
                return letter.toUpperCase();
            });
        }
    }, {
        key: "setStyles",

        /**
          * @setStyles function
          *
          * @params {HTMLElement / Nodelist, Object, Boolean}
          * @description Sets properties on an element's CSSStyleDeclaration.
          * @params description      
          *  - element: {HTMLElement / Nodelist} HTML element(s) to set styles properties on.
             - styles : {Object} Object containing CSS property / value pairs.
             - important : [Boolean] (Optional) Specifying if the CSS value is to be set as important. 
          * @global yes
          */

        value: function setStyles(element, styles, important) {

            var elements = element.length ? Array.from(element) : [element];
            elements.forEach(function (el) {
                Object.keys(styles).forEach(function (property) {
                    var important = important || String(styles[property]).includes("important") ? "important" : null;
                    var rules = String(styles[property]).replace(/!?important/, "").trim();
                    el.style.setProperty(property, rules, important);
                });
            });
        }
    }, {
        key: "getStyles",

        /**
          * @getStyles function
          *
          * @params {HTMLElement, String / Array}
          * @description Queries properties set on an element's CSSStyleDeclaration.
          * @params description      
          *  - element: {HTMLElement} HTML element to query againts its style properties.
             - props : {String / Array} String or Array of strings of CSS properties to query.
          * @returns {Object} Object of CSS property / value pairs
          * @global yes
          */

        value: function getStyles(element, props) {

            var properties = Array.isArray(props) ? [].concat(_toConsumableArray(props)) : [props];
            var styles = {},
                temp = {};
            properties.forEach(function (property) {
                styles[property] = window.getComputedStyle(element).getPropertyValue(property);
            });
            return styles;
        }
    }, {
        key: "createTransition",

        /**
          * @createTransition function
          *
          * @params {Object, Class}
          * @description Creates a string defining an element's CSS transition values and sets it on the element's CSSStyleDeclaration. 
          * @params description      
          *  - transition: {Object} An object of transition properties.
                 - elements {HTMLElement / Nodelist} HTMLElement(s) to set transition on.
                 - properties {String / Array} CSS properties to transition.
                 - duration {String / Array} Ms or S transition duration value(s).
                 - easing [String / Array] (Optional) Transition timing function value(s).
                 - delay [String / Array] (Optional) Transition delay value(s).
             - Prefix : {Class} Prefix class.
          * @global yes
          */

        value: function createTransition(transition, Prefix) {
            var _this = this;

            var transitionPrefix = new Prefix().getPrefix("transition");
            var elements = transition.element.length ? Array.from(transition.element) : [transition.element];
            var properties = Array.isArray(transition.properties) ? [].concat(_toConsumableArray(transition.properties)) : [transition.properties];
            var duration = Array.isArray(transition.duration) ? [].concat(_toConsumableArray(transition.duration)) : [transition.duration];
            var easing = Array.isArray(transition.easing) ? [].concat(_toConsumableArray(transition.easing)) : [transition.easing];
            var delay = Array.isArray(transition.delay) ? [].concat(_toConsumableArray(transition.delay)) : [transition.delay];

            elements.forEach(function (element) {

                var transitionString = "";
                var rules = {};

                properties.forEach(function (prop, i) {

                    transitionString += " ";
                    transitionString += properties.length > 1 ? properties[i] + " " : properties[0] + " ";
                    transitionString += duration.length > 1 ? duration[i] + " " : duration[0] + " ";
                    transitionString += easing.length > 1 ? easing[i] + " " : (easing[0] || "ease") + " ";
                    transitionString += delay.length > 1 ? delay[i] + "," : (delay[0] || "0s") + ",";
                });

                transitionString = transitionString.substr(0, transitionString.length - 1);
                rules[transitionPrefix] = transitionString;
                _this.setStyles(element, rules);
            });
        }
    }, {
        key: "createKeyframeAnimation",

        /**
          * @createKeyframeAnimation function
          *
          * @params {Object, Class, CSSStyleSheet}
          * @description Creates a CSS keyframe animation, and optional associated style class, and inserts it/them into Animator's stylesheet. 
          * @params description      
          *  - animation: {Object} An object of animation properties.
                 - name {HTMLElement / Nodelist} HTMLElement(s) to set transition on.
                 - animation {Object} Either from / to or % based keyframes and CSS properties / values.
                 - animationClass [Object] (Optional) A CSS class to trigger the animation.
                     - name {String} The classname.
                     - rules {Object} Object of CSS property / value pairs.
             - Prefix : {Class} Prefix class.
             - stylesheet : {CSSStyleSheet} Animator's stylesheet.
          * @global yes
          */

        value: function createKeyframeAnimation(animation, Prefix, stylesheet) {

            var animationString = "";
            var prefix = new Prefix();
            var keyFrame = prefix.getPrefix("keyframes");
            keyFrame += " " + animation.name + " {\n";

            Object.keys(animation.animation).forEach(function (anim) {
                animationString += anim + " {";
                Object.keys(animation.animation[anim]).forEach(function (property) {
                    animationString += "\n" + property + " : " + animation.animation[anim][property] + ";";
                });
                animationString += "\n }\n";
            });

            animationString += "}";

            stylesheet.insertRule(keyFrame + animationString, stylesheet.rules.length || stylesheet.cssRules.length);
            if (animation.animationClass) {
                this.createClass(animation.animationClass.name, stylesheet, animation.animationClass.rules);
            }
        }
    }, {
        key: "createClass",

        /**
          * @createClass function
          *
          * @params {String, CSSStyleSheet, Object (Optional)}
          * @description Defines a CSS class and inserts it into Animator's stylesheet. 
          * @params description      
          *  - className: {String} The name of the class.
             - stylesheet : {CSSStyleSheet} Animator's stylesheet.
             - rules : [Object] (Optional) Object of CSS property / value pairs.
          * @global yes
          */

        value: function createClass(className, stylesheet) {
            var rules = arguments[2] === undefined ? {} : arguments[2];

            var name = "." + className;
            var cssString = "{ ";

            Object.keys(rules).forEach(function (rule) {
                cssString += rule + " : " + rules[rule] + "; ";
            });

            cssString += "}";
            stylesheet.insertRule(name + cssString, stylesheet.rules.length || stylesheet.cssRules.length);
        }
    }, {
        key: "deleteClass",

        /**
          * @deleteClass function
          *
          * @params {String, CSSStyleSheet}
          * @description Removes a CSS class from Animator's stylesheet. 
          * @params description      
          *  - className: {String} The name of the class to remove.
             - stylesheet : {CSSStyleSheet} Animator's stylesheet.
          * @global yes
          */

        value: function deleteClass(className, stylesheet) {

            var rules = stylesheet.rules || stylesheet.cssRules;
            var name = "." + className;
            Object.keys(rules).forEach(function (rule) {
                if (rules[rule] instanceof CSSStyleRule && rules[rule].selectorText === name) {
                    stylesheet.deleteRule(rule);
                }
            });
        }
    }, {
        key: "createCSSRule",

        /**
         * @createCSSRule function
         *
         * @params {String / Array, String / Array}
         * @description Returns an object of CSS property / values. 
         * @params description      
         *  - property: {String / Array} The CSS property(s).
            - value : {String / Array} The CSS values(s).
         * @returns {Object} Object of CSS property / value pairs.
         * @global yes
         */

        value: function createCSSRule(property, value) {

            var properties = Array.isArray(property) ? [].concat(_toConsumableArray(property)) : [property];
            var values = Array.isArray(value) ? [].concat(_toConsumableArray(value)) : [value];
            var rule = {};

            properties.forEach(function (prop, index) {
                rule[prop] = values[index];
            });

            return rule;
        }
    }]);

    return CssUtils;
})();

exports["default"] = CssUtils;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
})();

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
  * @DomUtils Class
  *
  * @description Provides DOM utilities for Animator.
  * @returns {Object}
  */

var DomUtils = (function () {
  function DomUtils() {
    _classCallCheck(this, DomUtils);
  }

  _createClass(DomUtils, [{
    key: "setClass",

    /**
      * @setClass function
      *
      * @params {HTMLElement, String / Array, Boolean}
      * @description Adds or removes class(es) from an element.
      * @params description      
      *  - element: {HTMLElement} The element to add / remove the class(es) to / from.
      *  - classList: {String / Array} A single classname or array of classnames to add / remove.
      *	- add: {Boolean} Specifiying whether to add / remove the class(es).
      * @global yes
      */

    value: function setClass(element, classList, add) {

      var classes = Array.isArray(classList) ? [].concat(_toConsumableArray(classList)) : [classList];
      var elements = element.length ? Array.from(element) : [element];
      var action = add ? "add" : "remove";
      classes.forEach(function (cls) {
        elements.forEach(function (el) {
          el.classList[action](cls);
        });
      });
    }
  }, {
    key: "support",

    /**
      * @support function
      *
      * @params {Class, Class}
      * @description Tests for CSS transition / animation / CSSOM manipulation support
      * @params description      
      *  - Prefix: {Class} Prefix class.
      *  - CssUtils: {Class} CSS utilities class.
      * @returns {Boolean}
      * @global yes
      */

    value: function support(Prefix, CssUtils) {

      var prefix = new Prefix();
      var cssUtils = new CssUtils();
      var transitionSupport = prefix.getPrefix("transition");
      var animationSupport = prefix.getPrefix("animation");
      var raf = !!window.requestAnimationFrame;

      return transitionSupport && animationSupport && raf;
    }
  }]);

  return DomUtils;
})();

exports["default"] = DomUtils;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = (function () {
		function defineProperties(target, props) {
				for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
				}
		}return function (Constructor, protoProps, staticProps) {
				if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
		};
})();

function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
		}
}

/**
  * @Prefix Class
  *
  * @description Handles prefixing for CSS properties and DOM events.
  * @returns {Object}
  */

var Prefix = (function () {

		/**
    * @constructor function
    *
    * @description Creates a map that holds non-prefixed properties and event names as keys and associated prefixes as values to test against.
    */

		function Prefix() {
				_classCallCheck(this, Prefix);

				this.testElement = document.createElement("div");
				this.prefixes = new Map();

				// Transforms
				this.prefixes.set("transform", ["-webkit-transform", "transform"]);
				this.prefixes.set("transform-origin", ["-webkit-transform-origin", "transform-origin"]);
				this.prefixes.set("transform-style", ["-webkit-transform-style", "transform-style"]);

				// Transitions
				this.prefixes.set("transition", ["-webkit-transition", "transition"]);
				this.prefixes.set("transition-delay", ["-webkit-transition-delay", "transition-delay"]);
				this.prefixes.set("transition-duration", ["-webkit-transition-duration", "transition-duration"]);
				this.prefixes.set("transition-property", ["-webkit-transition-property", "transition-property"]);
				this.prefixes.set("transition-timing-function", ["-webkit-transition-timing-function", "transition-timing-function"]);

				// Animations
				this.prefixes.set("keyframes", ["-webkit-", "-ms-", "-moz-", ""]);
				this.prefixes.set("animation", ["-webkit-animation", "-ms-animation", "-moz-animation", "animation"]);
				this.prefixes.set("animation-name", ["-webkit-animation-name", "-ms-animation-name", "-moz-animation-name", "animation-name"]);
				this.prefixes.set("animation-iteration-count", ["-webkit-animation-iteration-count", "-ms-animation-iteration-count", "-moz-animation-iteration-count", "animation-iteration-count"]);
				this.prefixes.set("animation-play-state", ["-webkit-animation-play-state", "-ms-animation-play-state", "-moz-animation-play-state", "animation-play-state"]);
				this.prefixes.set("animation-duration", ["-webkit-animation-duration", "-ms-animation-duration", "-moz-animation-duration", "animation-duration"]);
				this.prefixes.set("animation-delay", ["-webkit-animation-delay", "-ms-animation-delay", "-moz-animation-delay", "animation-delay"]);
				this.prefixes.set("animation-direction", ["-webkit-animation-direction", "-ms-animation-direction", "-moz-animation-direction", "animation-direction"]);
				this.prefixes.set("animation-fill-mode", ["-webkit-animation-fill-mode", "-ms-animation-fill-mode", "-moz-animation-fill-mode", "animation-fill-mode"]);

				// Transition / Animation end
				var WebkitTransition = "webkitTransitionEnd";
				var transition = "transitionend";
				var WebkitAnimation = "webkitAnimationEnd";
				var animation = "animationend";

				var transitionend = { WebkitTransition: WebkitTransition, transition: transition };
				var animationend = { WebkitAnimation: WebkitAnimation, animation: animation };

				this.prefixes.set("transitionend", transitionend);
				this.prefixes.set("animationend", animationend);
		}

		_createClass(Prefix, [{
				key: "getPrefix",

				/**
      * @getPrefix function
      *
      * @params {String} The non-prefixed CSS property / DOM event name to search the prefix map for.
      * @description Handles prefix queries by searching and testing properties and values in the prefix map against a HTMLElement's CSSStyleDeclaration.
      * @returns {String} The queried prefix.
      * @global yes
      */

				value: function getPrefix(prefix) {
						var _this = this;

						if (!this.prefixes.has(prefix)) {
								return false;
						} else if (prefix === "transitionend" || prefix === "animationend") {
								return this.getPrefixedEventName(prefix);
						} else if (prefix === "keyframes") {
								var keyframePrefix = this.prefixes.get(prefix).filter(function (f) {
										return _this.testElement.style[f + "animation-name"] !== undefined;
								})[0];
								return "@" + keyframePrefix + "keyframes";
						} else {
								return this.prefixes.get(prefix).filter(function (f) {
										return _this.testElement.style[f] !== undefined;
								})[0];
						}
				}
		}, {
				key: "getPrefixedEventName",

				/**
      * @getPrefixedEventName function
      *
      * @params {String} The non-prefixed DOM event name to search the prefix map for.
      * @description Tests a HTMLElement's CSSStyleDeclaration for supported DOM event prefixes.
      * @returns {String} The queried prefix.
      * @global no
      */

				value: function getPrefixedEventName(eventName) {
						var _this2 = this;

						var evtNames = this.prefixes.get(eventName);
						var matches = Object.keys(evtNames).filter(function (e) {
								return _this2.testElement.style[e] !== undefined;
						});
						return evtNames[matches[0]];
				}
		}]);

		return Prefix;
})();

;

exports["default"] = Prefix;
module.exports = exports["default"];

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

/**
  * @SequenceWrapper Class
  *
  * @description Intercepts all sequences and returns a single or combo sequence depending on whether a single HTMLElement or Nodelist is used.
  * @returns {Promise}
  */

var SequenceWrapper =

/**
  * @constructor function
  *
  * @params {Object, Class, Class, Class, Class, Class, Class, Object}     
  * @description A wrapper that organises all sequences before they are launched. 
* @params description
- options {Object} Object of sequence options.
- DomUtils {Class} DOM utilities class.
- Prefix {Class} Prefix class.
- CssUtils {Class} CSS Utilities class.
- Sequence {Class} The sequence type (Transition / Animation).
- Combo {Class} Wrapper for multiple sequences.
- Tracker {Object} Object to store and track sequences through.
* @returns {Promise}
  */

function SequenceWrapper(options, DomUtils, Prefix, CssUtils, Sequence, Combo, Tracker) {
	_classCallCheck(this, SequenceWrapper);

	if (options.element.length) {
		var transitions = Array.from(options.element).map(function (element) {
			var opts = {};
			Object.keys(options).forEach(function (key) {
				opts[key] = options[key];
			});
			opts.element = element;
			Tracker.track(opts, Sequence);
			return new Sequence(opts, DomUtils, Prefix, CssUtils, Tracker);
		});
		return new Combo(transitions);
	} else {
		Tracker.track(options, Sequence);
		return new Sequence(options, DomUtils, Prefix, CssUtils, Tracker);
	}
};

exports["default"] = SequenceWrapper;
module.exports = exports["default"];

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
	} else {
		return Array.from(arr);
	}
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

/**
  * @Tracker Class
  *
  * @description Track all sequenced elements to allow sequences to be played / paused.
  * @returns {Object}
  */

var Tracker = (function () {

	/**
   * @constructor function
   *
   * @params {Class, Class, Class, Class}    
   * @description Initialise a single Map object to store sequenced elements. Only one instance per Animator is created.  
 * @params description
 - DomUtils {Class} DOM utilities class.
 - Prefix {Class} Prefix class.
 - CssUtils {Class} CSS Utilities class.
 - Transition {Class} Store the Transition protoype to compare against new sequence types passed in to the Tracker.
   */

	function Tracker(DomUtils, Prefix, CssUtils, Transition) {
		_classCallCheck(this, Tracker);

		this.tracker = new Map();
		this.tracker.set("Transitions", new Map());
		this.tracker.set("Animations", new Map());
		this.domUtils = new DomUtils();
		this.prefix = new Prefix();
		this.cssUtils = new CssUtils();
		this.transitionPrototype = Transition.prototype;
	}

	_createClass(Tracker, [{
		key: "track",

		/**
    * @track function
    *
    * @params {Object, Class}
    * @description Searches the Map for the element passed in and either updates it if found or creates a new entry in the Map for it.
    * @params description      
    *  - options: {Object} The sequence options.
       - Sequence : {Class} Either a Transition or Animation class.
    * @global no
    */

		value: function track(options, Sequence) {

			var transition = this.tracker.get("Transitions").get(options.element);
			var animation = this.tracker.get("Animations").get(options.element);

			if (Sequence.prototype === this.transitionPrototype) {
				if (!transition) {
					this.trackTransition(options);
				} else {
					this.updateTransitionRecord(transition, options);
				}
			} else {

				// A reference to the element will suffice if the sequence type is an Animation.
				// CSS Animations can be paused and played easily unlike transitions which are a bit trickier.
				if (!animation) {
					this.trackAnimation(options);
				}
			}
		}
	}, {
		key: "trackTransition",

		/**
    * @trackTransition function
    *
    * @params {Object}
    * @description Stores the element under the Transitions key in the Tracker Map 
    * 		and the transitioned properties / values set against the element.
    * @params description      
    *  - options: {Object} The transition sequence options.
    * @global no
    */

		value: function trackTransition(options) {

			var data = {},
			    transitionStyles = {};
			var transitions = this.tracker.get("Transitions");
			var tp = Animator.getPrefix("transition-property"),
			    tdur = Animator.getPrefix("transition-duration"),
			    ttf = Animator.getPrefix("transition-timing-function"),
			    tdel = Animator.getPrefix("transition-delay");

			transitionStyles[tp] = this.cssUtils.getStyles(options.element, tp)[tp];
			transitionStyles[tdur] = this.cssUtils.getStyles(options.element, tdur)[tdur];
			transitionStyles[ttf] = this.cssUtils.getStyles(options.element, ttf)[ttf];
			transitionStyles[tdel] = this.cssUtils.getStyles(options.element, tdel)[tdel];
			data.transitionStyles = transitionStyles;

			if (options.setStyles && options.setStyles.before) {
				data.styles = options.setStyles.before;
			}

			if (options.addClass && options.addClass.before || options.removeClass && options.removeClass.before) {
				data.classTriggered = true;
			}

			data.properties = Array.isArray(options.properties) ? [].concat(_toConsumableArray(options.properties)) : [options.properties];
			transitions.set(options.element, data);
		}
	}, {
		key: "trackAnimation",

		/**
    * @trackAnimation function
    *
    * @params {Object}
    * @description Stores an element under the Animations key in the Tracker Map.
    * @params description      
    *  - options: {Object} The animation sequence options.
    * @global no
    */

		value: function trackAnimation(options) {

			var data = {};
			var animations = this.tracker.get("Animations");
			animations.set(options.element, data);
		}
	}, {
		key: "updateTransitionRecord",

		/**
    * @updateTransitionRecord function
    *
    * @params {Object, Object}
    * @description Inserts additional transitioned properties / style rules set into an element's record.
    * @params description      
    *  - record: {Object} The transition record from the Tracker Map.
    *  - options: {Object} The transition sequence options.
    * @global no
    */

		value: function updateTransitionRecord(record, options) {

			var properties = Array.isArray(options.properties) ? [].concat(_toConsumableArray(options.properties)) : [options.properties];
			properties = properties.filter(function (property) {
				return record.properties.indexOf(property) === -1;
			});
			record.properties = [].concat(_toConsumableArray(record.properties), _toConsumableArray(properties));

			if (options.setStyles && options.setStyles.before) {
				if (!record.styles) {
					record.styles = {};
				}
				Object.keys(options.setStyles.before).forEach(function (property) {
					record.styles[property] = options.setStyles.before[property];
				});
			}
		}
	}, {
		key: "pause",

		/**
    * @pause function
    *
    * @description Iterates through every stored element in the Tracker and sets its CSS appropriately to effectively pause a sequence.
    * @global no
    */

		value: function pause() {
			var _this = this;

			var transitions = this.tracker.get("Transitions");
			var transitionElements = transitions.keys();
			var animations = this.tracker.get("Animations");
			var animationElements = animations.keys();

			while (true) {

				var element = animationElements.next(),
				    rule = {};
				if (element.done) {
					break;
				}

				rule[this.prefix.getPrefix("animation-play-state")] = "paused";
				this.cssUtils.setStyles(element.value, rule);
			}

			var _loop = function _loop() {

				var element = transitionElements.next(),
				    record = undefined,
				    rule = {};
				if (element.done) {
					return "break";
				}

				record = transitions.get(element.value);
				record.properties.forEach(function (property) {
					var rule = _this.cssUtils.getStyles(element.value, property);
					_this.cssUtils.setStyles(element.value, rule);
				});

				rule = {};
				rule[_this.prefix.getPrefix("transition")] = "none";
				_this.cssUtils.setStyles(element.value, rule);
			};

			while (true) {
				var _ret = _loop();

				if (_ret === "break") break;
			}
		}
	}, {
		key: "play",

		/**
    * @play function
    *
    * @description Iterates through every stored element in the Tracker and sets CSS style rules to continue a paused sequence.
    * @global no
    */

		value: function play() {
			var _this2 = this;

			var transitions = this.tracker.get("Transitions");
			var transitionElements = transitions.keys();
			var animations = this.tracker.get("Animations");
			var animationElements = animations.keys();

			while (true) {

				var element = animationElements.next(),
				    rule = {};
				if (element.done) {
					break;
				}

				rule[this.prefix.getPrefix("animation-play-state")] = "running";
				this.cssUtils.setStyles(element.value, rule);
			}

			var _loop2 = function _loop2() {

				var element = transitionElements.next();
				if (element.done) {
					return "break";
				}

				var record = transitions.get(element.value);
				_this2.cssUtils.setStyles(element.value, record.transitionStyles);
				if (record.classTriggered) {
					record.properties.forEach(function (prop) {
						element.value.style.removeProperty(prop);
					});
				}

				if (record.styles) {
					_this2.cssUtils.setStyles(element.value, record.styles);
				}
			};

			while (true) {
				var _ret2 = _loop2();

				if (_ret2 === "break") break;
			}
		}
	}, {
		key: "remove",

		/**
    * @remove function
    *
    * @params {String, HTMLElement}
    * @description Removes a stored element from the Tracker once a sequence is complete.
    * @params description      
    *  - type: {String} Tracker map key, either Transitions or Animations.
    *  - element: {HTMLElement} The element to remove from the Tracker.
    * @global no
    */

		value: function remove(type, element) {
			this.tracker.get(type)["delete"](element);
		}
	}]);

	return Tracker;
})();

exports["default"] = Tracker;
module.exports = exports["default"];

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
})();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

/**
  * @Transition Class
  *
  * @description Promise based transition handler that resolves when all transitions on an element are complete.
  * @returns {Resolved Promise}
  */

var Transition = (function () {

	/**
   * @constructor function
   *
   * @params {Object, Class, Class, Class, Class, Object}  
   * @description Creates a new transition sequence.    
 * @params description
 - options {Object} Transition options.
 	- element {HTMLElement} The element to set the transition on.
 	- properties {String / Array} A string or array of strings of CSS properties that are being transitioned.
 	- setStyles {Object} Styles to be set before / after the transition.
 		- before {Object} Object of CSS property / value pairs to be set before the transition.
 		- after {Object} Object of CSS property / value pairs to be set after the transition.
 	- addClass {Object} Object of classnames to be set before / after the transition.
 		- before {String} Classname to set before the transition.
 		- after {String} Classname to set after the transition.
 	- removeClass {Object} Object of classnames to be removed before / after the transition.
 		- before {String} Classname to be removed before the transition.
 		- after {String} Classname to be removed after the transition.
 - DomUtils {Class} Dom utility class.
 - Prefix {Class} Prefix class.
 - CssUtils {Class} CSS Utilities class.
 - Tracker {Object} Object that tracks and monitors sequences.
 * @returns {Promise}
   */

	function Transition(options, DomUtils, Prefix, CssUtils, Tracker) {
		var _this = this;

		_classCallCheck(this, Transition);

		this.options = options;
		this.domUtils = new DomUtils();
		this.prefix = new Prefix().getPrefix("transitionend");
		this.cssUtils = new CssUtils();
		this.onTransitionEnd = this.transitionEnd.bind(this);
		this.totaltransitions = Array.isArray(options.properties) ? options.properties.length : 1;
		this.transitionendCount = 0;
		this.tracker = Tracker;

		return new Promise(function (resolve, reject) {
			_this.resolve = resolve;
			_this.reject = reject;
			_this.animationFrame = requestAnimationFrame(_this.transitionStart.bind(_this));
		});
	}

	_createClass(Transition, [{
		key: "transitionStart",

		/**
    * @transitionStart function
    *
    * @description Sets classnames / style rules to trigger the transition.
    * @global no
    */

		value: function transitionStart() {

			var opts = this.options;
			opts.element.addEventListener(this.prefix, this.onTransitionEnd, false);

			if (opts.setStyles && opts.setStyles.before) {
				this.cssUtils.setStyles(opts.element, opts.setStyles.before);
			}

			if (opts.removeClass && opts.removeClass.before) {
				this.domUtils.setClass(opts.element, opts.removeClass.before, false);
			}

			if (opts.addClass && opts.addClass.before) {
				this.domUtils.setClass(opts.element, opts.addClass.before, true);
			}
		}
	}, {
		key: "transitionEnd",

		/**
    * @transitionEnd function
    *
    * @description Sets classnames / style rules after all transitions have occurred and removes the element from the tracker.
    * @global no
    * @returns {Resolved Promise}
    */

		value: function transitionEnd(evt) {

			evt.stopPropagation();

			var opts = this.options;
			this.transitionendCount++;

			if (this.transitionendCount === this.totaltransitions) {

				opts.element.removeEventListener(this.prefix, this.onTransitionEnd, false);
				cancelAnimationFrame(this.animationFrame);

				if (opts.setStyles && opts.setStyles.after) {
					this.cssUtils.setStyles(opts.element, opts.setStyles.after);
				}

				if (opts.removeClass && opts.removeClass.after) {
					this.domUtils.setClass(opts.element, opts.removeClass.after, false);
				}

				if (opts.addClass && opts.addClass.after) {
					this.domUtils.setClass(opts.element, opts.addClass.after, true);
				}

				this.tracker.remove("Transitions", opts.element);
				this.resolve(opts.element);
			}
		}
	}]);

	return Transition;
})();

exports["default"] = Transition;
module.exports = exports["default"];

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjOi9Vc2Vycy9NaWtlX0NoYWR3aWNrL0RvY3VtZW50cy9HaXRIdWIvQW5pbWF0b3ItRVM2L2pzL3RlbXAvYW5pbWF0b3IuanMiLCJjOi9Vc2Vycy9NaWtlX0NoYWR3aWNrL0RvY3VtZW50cy9HaXRIdWIvQW5pbWF0b3ItRVM2L2pzL3RlbXAvYW5pbWF0aW9uLXNlcS5qcyIsImM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC9jb21iby1zZXEuanMiLCJjOi9Vc2Vycy9NaWtlX0NoYWR3aWNrL0RvY3VtZW50cy9HaXRIdWIvQW5pbWF0b3ItRVM2L2pzL3RlbXAvY3NzLXV0aWxzLmpzIiwiYzovVXNlcnMvTWlrZV9DaGFkd2ljay9Eb2N1bWVudHMvR2l0SHViL0FuaW1hdG9yLUVTNi9qcy90ZW1wL2RvbS11dGlscy5qcyIsImM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC9wcmVmaXhlcy5qcyIsImM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC9zZXEtd3JhcHBlci5qcyIsImM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC90cmFja2VyLmpzIiwiYzovVXNlcnMvTWlrZV9DaGFkd2ljay9Eb2N1bWVudHMvR2l0SHViL0FuaW1hdG9yLUVTNi9qcy90ZW1wL3RyYW5zaXRpb24tc2VxLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOztBQUViLElBQUksWUFBWSxHQUFHLENBQUMsWUFBWTtBQUFFLFdBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUFF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bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAQW5pbWF0b3IgQ2xhc3NcclxuICAqXHJcbiAgKiBAZGVzY3JpcHRpb24gSG91c2VzIGFsbCBBbmltYXRvciBmdW5jdGlvbmFsaXR5XHJcbiAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICovXG5cbnZhciBfcHJlZml4ZXMgPSByZXF1aXJlKFwiLi9wcmVmaXhlc1wiKTtcblxudmFyIF9wcmVmaXhlczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcmVmaXhlcyk7XG5cbnZhciBfY3NzVXRpbHMgPSByZXF1aXJlKFwiLi9jc3MtdXRpbHNcIik7XG5cbnZhciBfY3NzVXRpbHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3NzVXRpbHMpO1xuXG52YXIgX2RvbVV0aWxzID0gcmVxdWlyZShcIi4vZG9tLXV0aWxzXCIpO1xuXG52YXIgX2RvbVV0aWxzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RvbVV0aWxzKTtcblxudmFyIF9hbmltYXRpb25TZXEgPSByZXF1aXJlKFwiLi9hbmltYXRpb24tc2VxXCIpO1xuXG52YXIgX2FuaW1hdGlvblNlcTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hbmltYXRpb25TZXEpO1xuXG52YXIgX3RyYW5zaXRpb25TZXEgPSByZXF1aXJlKFwiLi90cmFuc2l0aW9uLXNlcVwiKTtcblxudmFyIF90cmFuc2l0aW9uU2VxMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RyYW5zaXRpb25TZXEpO1xuXG52YXIgX2NvbWJvU2VxID0gcmVxdWlyZShcIi4vY29tYm8tc2VxXCIpO1xuXG52YXIgX2NvbWJvU2VxMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbWJvU2VxKTtcblxudmFyIF9zZXFXcmFwcGVyID0gcmVxdWlyZShcIi4vc2VxLXdyYXBwZXJcIik7XG5cbnZhciBfc2VxV3JhcHBlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZXFXcmFwcGVyKTtcblxudmFyIF90cmFja2VyID0gcmVxdWlyZShcIi4vdHJhY2tlclwiKTtcblxudmFyIF90cmFja2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RyYWNrZXIpO1xuXG52YXIgQW5pbWF0b3IgPSAoZnVuY3Rpb24gKCkge1xuXG4gIC8qKlxyXG4gICAgKiBAY29uc3RydWN0b3IgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBzdHlsZXNoZWV0IGFuZCBUcmFja2VyIG9iamVjdCB0byBiZSB1c2VkIHRocm91Z2hvdXQgQW5pbWF0b3IuXHJcbiAgICAqL1xuXG4gIGZ1bmN0aW9uIEFuaW1hdG9yKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBBbmltYXRvcik7XG5cbiAgICB0aGlzLnN0eWxlc2hlZXQgPSBuZXcgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0oKS5jcmVhdGVTdHlsZVNoZWV0KCk7XG4gICAgdGhpcy50cmFja2VyID0gbmV3IF90cmFja2VyMltcImRlZmF1bHRcIl0oX2RvbVV0aWxzMltcImRlZmF1bHRcIl0sIF9wcmVmaXhlczJbXCJkZWZhdWx0XCJdLCBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSwgX3RyYW5zaXRpb25TZXEyW1wiZGVmYXVsdFwiXSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQW5pbWF0b3IsIFt7XG4gICAga2V5OiBcImdldFByZWZpeFwiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQGdldFByZWZpeCBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7U3RyaW5nfVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIGEgcHJlZml4ZWQgQ1NTIHByb3BlcnR5IG9yIERPTSBldmVudCBuYW1lLlxyXG4gICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQcmVmaXgocHJlZml4KSB7XG4gICAgICByZXR1cm4gbmV3IF9wcmVmaXhlczJbXCJkZWZhdWx0XCJdKCkuZ2V0UHJlZml4KHByZWZpeCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldFN0eWxlc1wiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQHNldFN0eWxlcyBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7SFRNTEVsZW1lbnQsIFN0cmluZyAvIEFycmF5fVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIHByb3BlcnRpZXMgLyB2YWx1ZXMgb24gYW4gZWxlbWVudCdzIENTU1N0eWxlRGVjbGFyYXRpb24uXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0U3R5bGVzKGVsZW1lbnQsIHN0eWxlcykge1xuICAgICAgcmV0dXJuIG5ldyBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSgpLnNldFN0eWxlcyhlbGVtZW50LCBzdHlsZXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRTdHlsZXNcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBnZXRTdHlsZXMgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge0hUTUxFbGVtZW50LCBPYmplY3R9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFJldHVybiBhbiBvYmplY3Qgb2YgQ1NTIHByb3BlcnRpZXMgLyB2YWx1ZXMuXHJcbiAgICAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0eWxlcyhlbGVtZW50LCBwcm9wZXJ0aWVzKSB7XG4gICAgICByZXR1cm4gbmV3IF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdKCkuZ2V0U3R5bGVzKGVsZW1lbnQsIHByb3BlcnRpZXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVUcmFuc2l0aW9uXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAY3JlYXRlVHJhbnNpdGlvbiBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7T2JqZWN0fVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgQ1NTIHRyYW5zaXRpb24gZGVmaW5pdGlvbi5cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVUcmFuc2l0aW9uKHRyYW5zaXRpb24pIHtcbiAgICAgIG5ldyBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSgpLmNyZWF0ZVRyYW5zaXRpb24odHJhbnNpdGlvbiwgX3ByZWZpeGVzMltcImRlZmF1bHRcIl0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVBbmltYXRpb25cIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBjcmVhdGVBbmltYXRpb24gZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge09iamVjdH1cclxuICAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIENTUyBrZXlmcmFtZSBhbmltYXRpb24gZGVmaW5pdGlvbi5cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgICBuZXcgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0oKS5jcmVhdGVLZXlmcmFtZUFuaW1hdGlvbihhbmltYXRpb24sIF9wcmVmaXhlczJbXCJkZWZhdWx0XCJdLCB0aGlzLnN0eWxlc2hlZXQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVDbGFzc1wiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQGNyZWF0ZUNsYXNzIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtTdHJpbmcsIE9iamVjdH1cclxuICAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIENTUyBjbGFzcyBhbmQgYXBwZW5kcyBpdCB0byB0aGUgc3R5bGVzaGVldC5cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjbGFzc05hbWUsIHJ1bGVzKSB7XG4gICAgICBuZXcgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0oKS5jcmVhdGVDbGFzcyhjbGFzc05hbWUsIHRoaXMuc3R5bGVzaGVldCwgcnVsZXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWxldGVDbGFzc1wiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQGRlbGV0ZUNsYXNzIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtTdHJpbmd9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIERlbGV0ZXMgYSBDU1MgY2xhc3MgZnJvbSB0aGUgc3R5bGVzaGVldC5cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWxldGVDbGFzcyhjbGFzc05hbWUpIHtcbiAgICAgIG5ldyBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSgpLmRlbGV0ZUNsYXNzKGNsYXNzTmFtZSwgdGhpcy5zdHlsZXNoZWV0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlQ1NTUnVsZVwiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQGNyZWF0ZUNTU1J1bGUgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge1N0cmluZyAvIEFycmF5LCBTdHJpbmcgLyBBcnJheX1cclxuICAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzIG9iamVjdC5cclxuICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUNTU1J1bGUocHJvcGVydHksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gbmV3IF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdKCkuY3JlYXRlQ1NTUnVsZShwcm9wZXJ0eSwgdmFsdWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGRDbGFzc1wiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQGFkZENsYXNzIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtIVE1MRWxlbWVudCAvIE5vZGVsaXN0LCBTdHJpbmcgLyBBcnJheX1cclxuICAgICAgKiBAZGVzY3JpcHRpb24gU2V0cyBhIGNsYXNzKGVzKSBvbiBhbiBlbGVtZW50LlxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFkZENsYXNzKGVsZW1lbnQsIGNsYXNzTGlzdCkge1xuICAgICAgbmV3IF9kb21VdGlsczJbXCJkZWZhdWx0XCJdKCkuc2V0Q2xhc3MoZWxlbWVudCwgY2xhc3NMaXN0LCB0cnVlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlQ2xhc3NcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEByZW1vdmVDbGFzcyBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7SFRNTEVsZW1lbnQgLyBOb2RlbGlzdCwgU3RyaW5nIC8gQXJyYXl9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgYSBjbGFzcyhlcykgZnJvbSBhbiBlbGVtZW50LlxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTGlzdCkge1xuICAgICAgbmV3IF9kb21VdGlsczJbXCJkZWZhdWx0XCJdKCkuc2V0Q2xhc3MoZWxlbWVudCwgY2xhc3NMaXN0LCBmYWxzZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRyYW5zaXRpb25cIixcblxuICAgIC8qKlxyXG4gICAgICAqIEB0cmFuc2l0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtPYmplY3R9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSB0cmFuc2l0aW9uIHNlcXVlbmNlLlxyXG4gICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyYW5zaXRpb24ob3B0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBfc2VxV3JhcHBlcjJbXCJkZWZhdWx0XCJdKG9wdGlvbnMsIF9kb21VdGlsczJbXCJkZWZhdWx0XCJdLCBfcHJlZml4ZXMyW1wiZGVmYXVsdFwiXSwgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0sIF90cmFuc2l0aW9uU2VxMltcImRlZmF1bHRcIl0sIF9jb21ib1NlcTJbXCJkZWZhdWx0XCJdLCB0aGlzLnRyYWNrZXIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhbmltYXRpb25cIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBhbmltYXRpb24gZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge09iamVjdH1cclxuICAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhbiBhbmltYXRpb24gc2VxdWVuY2UuXHJcbiAgICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gYW5pbWF0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgX3NlcVdyYXBwZXIyW1wiZGVmYXVsdFwiXShvcHRpb25zLCBfZG9tVXRpbHMyW1wiZGVmYXVsdFwiXSwgX3ByZWZpeGVzMltcImRlZmF1bHRcIl0sIF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdLCBfYW5pbWF0aW9uU2VxMltcImRlZmF1bHRcIl0sIF9jb21ib1NlcTJbXCJkZWZhdWx0XCJdLCB0aGlzLnRyYWNrZXIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjb21ib1wiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQGNvbWJvIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtPYmplY3R9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYW4gY29tYmluYXRpb24gb2Ygc2VxdWVuY2UuXHJcbiAgICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tYm8oYW5pbWF0aW9ucykge1xuICAgICAgcmV0dXJuIG5ldyBfY29tYm9TZXEyW1wiZGVmYXVsdFwiXShhbmltYXRpb25zKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaXNTdXBwb3J0ZWRcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBpc1N1cHBvcnRlZCBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFRlc3RzIHRoZSBicm93c2VyIGZvciBBbmltYXRvciBzdXBwb3J0LlxyXG4gICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICAgICAgcmV0dXJuIG5ldyBfZG9tVXRpbHMyW1wiZGVmYXVsdFwiXSgpLnN1cHBvcnQoX3ByZWZpeGVzMltcImRlZmF1bHRcIl0sIF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicGF1c2VcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBwYXVzZSBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFBhdXNlIHRoZSBjdXJyZW50IHNlcXVlbmNlLlxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgICAgdGhpcy50cmFja2VyLnBhdXNlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBsYXlcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBwbGF5IGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAZGVzY3JpcHRpb24gUGxheXMgdGhlIGN1cnJlbnQgc2VxdWVuY2UuXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gcGxheSgpIHtcbiAgICAgIHRoaXMudHJhY2tlci5wbGF5KCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEFuaW1hdG9yO1xufSkoKTtcblxud2luZG93LkFuaW1hdG9yID0gbmV3IEFuaW1hdG9yKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAQW5pbWF0aW9uIENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIFByb21pc2UgYmFzZWQgYW5pbWF0aW9uIGhhbmRsZXIgdGhhdCByZXNvbHZlcyB3aGVuIGFuaW1hdGlvbnMgdHJpZ2dlcmVkIG9uIGFuIGVsZW1lbnQgYXJlIGNvbXBsZXRlLlxyXG4gICogQHJldHVybnMge1Jlc29sdmVkIFByb21pc2V9XHJcbiAgKi9cblxudmFyIEFuaW1hdGlvbiA9IChmdW5jdGlvbiAoKSB7XG5cblx0LyoqXHJcbiAgICogQGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW1zIHtPYmplY3QsIENsYXNzLCBDbGFzcywgQ2xhc3MsIENsYXNzLCBPYmplY3R9ICBcclxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIG5ldyBhbmltYXRpb24gc2VxdWVuY2UuICAgIFxyXG4gKiBAcGFyYW1zIGRlc2NyaXB0aW9uXHJcbiAtIG9wdGlvbnMge09iamVjdH0gQW5pbWF0aW9uIG9wdGlvbnMuXHJcbiBcdC0gZWxlbWVudCB7SFRNTEVsZW1lbnR9IFRoZSBlbGVtZW50IHRvIHNldCB0aGUgYW5pbWF0aW9uIG9uLlxyXG4gXHQtIHNldFN0eWxlcyB7T2JqZWN0fSBTdHlsZXMgdG8gYmUgc2V0IGJlZm9yZSAvIGFmdGVyIHRoZSBhbmltYXRpb24uXHJcbiBcdFx0LSBiZWZvcmUge09iamVjdH0gT2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzIHRvIGJlIHNldCBiZWZvcmUgdGhlIGFuaW1hdGlvbi5cclxuIFx0XHQtIGFmdGVyIHtPYmplY3R9IE9iamVjdCBvZiBDU1MgcHJvcGVydHkgLyB2YWx1ZSBwYWlycyB0byBiZSBzZXQgYWZ0ZXIgdGhlIGFuaW1hdGlvbi5cclxuIFx0LSBhZGRDbGFzcyB7T2JqZWN0fSBPYmplY3Qgb2YgY2xhc3NuYW1lcyB0byBiZSBzZXQgYmVmb3JlIC8gYWZ0ZXIgdGhlIGFuaW1hdGlvbi5cclxuIFx0XHQtIGJlZm9yZSB7U3RyaW5nfSBDbGFzc25hbWUgdG8gc2V0IGJlZm9yZSB0aGUgYW5pbWF0aW9uLlxyXG4gXHRcdC0gYWZ0ZXIge1N0cmluZ30gQ2xhc3NuYW1lIHRvIHNldCBhZnRlciB0aGUgYW5pbWF0aW9uLlxyXG4gXHQtIHJlbW92ZUNsYXNzIHtPYmplY3R9IE9iamVjdCBvZiBjbGFzc25hbWVzIHRvIGJlIHJlbW92ZWQgYmVmb3JlIC8gYWZ0ZXIgdGhlIGFuaW1hdGlvbi5cclxuIFx0XHQtIGJlZm9yZSB7U3RyaW5nfSBDbGFzc25hbWUgdG8gYmUgcmVtb3ZlZCBiZWZvcmUgdGhlIGFuaW1hdGlvbi5cclxuIFx0XHQtIGFmdGVyIHtTdHJpbmd9IENsYXNzbmFtZSB0byBiZSByZW1vdmVkIGFmdGVyIHRoZSBhbmltYXRpb24uXHJcbiAtIERvbVV0aWxzIHtDbGFzc30gRG9tIHV0aWxpdHkgY2xhc3MuXHJcbiAtIFByZWZpeCB7Q2xhc3N9IFByZWZpeCBjbGFzcy5cclxuIC0gQ3NzVXRpbHMge0NsYXNzfSBDU1MgVXRpbGl0aWVzIGNsYXNzLlxyXG4gLSBUcmFja2VyIHtPYmplY3R9IE9iamVjdCB0aGF0IHRyYWNrcyBhbmQgbW9uaXRvcnMgc2VxdWVuY2VzLlxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cblxuXHRmdW5jdGlvbiBBbmltYXRpb24ob3B0aW9ucywgRG9tVXRpbHMsIFByZWZpeCwgQ3NzVXRpbHMsIFRyYWNrZXIpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFuaW1hdGlvbik7XG5cblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHRcdHRoaXMuZG9tVXRpbHMgPSBuZXcgRG9tVXRpbHMoKTtcblx0XHR0aGlzLmNzc1V0aWxzID0gbmV3IENzc1V0aWxzKCk7XG5cdFx0dGhpcy5wcmVmaXggPSBuZXcgUHJlZml4KCkuZ2V0UHJlZml4KFwiYW5pbWF0aW9uZW5kXCIpO1xuXHRcdHRoaXMub25BbmltYXRpb25FbmQgPSB0aGlzLmFuaW1hdGlvbkVuZC5iaW5kKHRoaXMpO1xuXHRcdHRoaXMudHJhY2tlciA9IFRyYWNrZXI7XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0X3RoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0XHRfdGhpcy5yZWplY3QgPSByZWplY3Q7XG5cdFx0XHRfdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShfdGhpcy5hbmltYXRpb25TdGFydC5iaW5kKF90aGlzKSk7XG5cdFx0fSk7XG5cdH1cblxuXHRfY3JlYXRlQ2xhc3MoQW5pbWF0aW9uLCBbe1xuXHRcdGtleTogXCJhbmltYXRpb25TdGFydFwiLFxuXG5cdFx0LyoqXHJcbiAgICAqIEBhbmltYXRpb25TdGFydCBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAZGVzY3JpcHRpb24gU2V0cyBjbGFzc25hbWVzIC8gc3R5bGUgcnVsZXMgdG8gdHJpZ2dlciB0aGUgYW5pbWF0aW9uLlxyXG4gICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAqL1xuXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIGFuaW1hdGlvblN0YXJ0KCkge1xuXG5cdFx0XHR2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcblx0XHRcdG9wdHMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMucHJlZml4LCB0aGlzLm9uQW5pbWF0aW9uRW5kLCBmYWxzZSk7XG5cblx0XHRcdGlmIChvcHRzLnNldFN0eWxlcyAmJiBvcHRzLnNldFN0eWxlcy5iZWZvcmUpIHtcblx0XHRcdFx0dGhpcy5jc3NVdGlscy5zZXRTdHlsZXMob3B0cy5lbGVtZW50LCBvcHRzLnNldFN0eWxlcy5iZWZvcmUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0cy5yZW1vdmVDbGFzcyAmJiBvcHRzLnJlbW92ZUNsYXNzLmJlZm9yZSkge1xuXHRcdFx0XHR0aGlzLmRvbVV0aWxzLnNldENsYXNzKG9wdHMuZWxlbWVudCwgb3B0cy5yZW1vdmVDbGFzcy5iZWZvcmUsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdHMuYWRkQ2xhc3MgJiYgb3B0cy5hZGRDbGFzcy5iZWZvcmUpIHtcblx0XHRcdFx0dGhpcy5kb21VdGlscy5zZXRDbGFzcyhvcHRzLmVsZW1lbnQsIG9wdHMuYWRkQ2xhc3MuYmVmb3JlLCB0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6IFwiYW5pbWF0aW9uRW5kXCIsXG5cblx0XHQvKipcclxuICAgICogQGFuaW1hdGlvbkVuZCBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAZGVzY3JpcHRpb24gU2V0cyBjbGFzc25hbWVzIC8gc3R5bGUgcnVsZXMgYWZ0ZXIgYWxsIGFuaW1hdGlvbnMgaGF2ZSBjb21wbGV0ZWQgYW5kIHJlbW92ZXMgdGhlIGVsZW1lbnQgZnJvbSB0aGUgdHJhY2tlci5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKiBAcmV0dXJucyB7UmVzb2x2ZWQgUHJvbWlzZX1cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gYW5pbWF0aW9uRW5kKGV2dCkge1xuXG5cdFx0XHRldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdHZhciBvcHRzID0gdGhpcy5vcHRpb25zO1xuXHRcdFx0b3B0cy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5wcmVmaXgsIHRoaXMub25BbmltYXRpb25FbmQsIGZhbHNlKTtcblx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuXG5cdFx0XHRpZiAob3B0cy5zZXRTdHlsZXMgJiYgb3B0cy5zZXRTdHlsZXMuYWZ0ZXIpIHtcblx0XHRcdFx0dGhpcy5jc3NVdGlscy5zZXRTdHlsZXMob3B0cy5lbGVtZW50LCBvcHRzLnNldFN0eWxlcy5hZnRlcik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRzLnJlbW92ZUNsYXNzICYmIG9wdHMucmVtb3ZlQ2xhc3MuYWZ0ZXIpIHtcblx0XHRcdFx0dGhpcy5kb21VdGlscy5zZXRDbGFzcyhvcHRzLmVsZW1lbnQsIG9wdHMucmVtb3ZlQ2xhc3MuYWZ0ZXIsIGZhbHNlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdHMuYWRkQ2xhc3MgJiYgb3B0cy5hZGRDbGFzcy5hZnRlcikge1xuXHRcdFx0XHR0aGlzLmRvbVV0aWxzLnNldENsYXNzKG9wdHMuZWxlbWVudCwgb3B0cy5hZGRDbGFzcy5hZnRlciwgdHJ1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMudHJhY2tlci5yZW1vdmUoXCJBbmltYXRpb25zXCIsIG9wdHMuZWxlbWVudCk7XG5cdFx0XHR0aGlzLnJlc29sdmUob3B0cy5lbGVtZW50KTtcblx0XHR9XG5cdH1dKTtcblxuXHRyZXR1cm4gQW5pbWF0aW9uO1xufSkoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBBbmltYXRpb247XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxyXG4gICogQENvbWJvIENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIFdyYXBzIGEgUHJvbWlzZSBhcm91bmQgeCBhbW91bnQgb2Ygc2VxdWVuY2VzIGFuZCByZXNvbHZlcyB3aGVuIGFsbCBzZXF1ZW5jZXMgaGF2ZSByZXNvbHZlZC5cclxuICAqIEByZXR1cm5zIHtSZXNvbHZlZCBQcm9taXNlfVxyXG4gICovXG5cbnZhciBDb21ibyA9IChmdW5jdGlvbiAoKSB7XG5cblx0LyoqXHJcbiAgICogQGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW1zIHtBcnJheSwgQ2xhc3N9ICBcclxuICAgKiBAZGVzY3JpcHRpb24gV3JhcHMgeCBhbW91bnQgb2Ygc2VxdWVuY2VzIGluIGEgUHJvbWlzZS4gICAgXHJcbiAqIEBwYXJhbXMgZGVzY3JpcHRpb25cclxuIC0gc2VxdWVuY2VzIHtBcnJheX0gQW4gYXJyYXkgb2Ygc2VxdWVuY2VzLlxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cblxuXHRmdW5jdGlvbiBDb21ibyhzZXF1ZW5jZXMpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbWJvKTtcblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cblx0XHRcdHZhciB3YXRjaGVyID0gX3RoaXMuc2VxdWVuY2VXYXRjaGVyKCk7XG5cdFx0XHRfdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcblx0XHRcdF90aGlzLnJlamVjdCA9IHJlamVjdDtcblx0XHRcdF90aGlzLmFtb3VudCA9IHNlcXVlbmNlcy5sZW5ndGg7XG5cblx0XHRcdHNlcXVlbmNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzZXF1ZW5jZSkge1xuXG5cdFx0XHRcdHNlcXVlbmNlLnRoZW4oZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdFx0XHR3YXRjaGVyKGVsZW1lbnQpO1xuXHRcdFx0XHR9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdFx0X3RoaXMucmVqZWN0KGUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0X2NyZWF0ZUNsYXNzKENvbWJvLCBbe1xuXHRcdGtleTogXCJzZXF1ZW5jZVdhdGNoZXJcIixcblxuXHRcdC8qKlxyXG4gICAgKiBAc2VxdWVuY2VXYXRjaGVyIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBkZXNjcmlwdGlvbiBSZXNvbHZlcyB3aGVuIGFsbCBzZXF1ZW5jZXMgaGF2ZSBiZWVuIHJlc29sdmVkLiAgIFxyXG4gICogQHJldHVybnMge1Jlc29sdmVkIFByb21pc2V9XHJcbiAgICAqIEBnbG9iYWwgbm9cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gc2VxdWVuY2VXYXRjaGVyKCkge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHR2YXIgcmV0dXJuRGF0YSA9IFtdO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cblx0XHRcdFx0Y291bnQrKztcblx0XHRcdFx0cmV0dXJuRGF0YS5wdXNoKGVsZW1lbnQpO1xuXHRcdFx0XHRpZiAoY291bnQgPT09IF90aGlzMi5hbW91bnQpIHtcblx0XHRcdFx0XHRfdGhpczIucmVzb2x2ZShyZXR1cm5EYXRhKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH1dKTtcblxuXHRyZXR1cm4gQ29tYm87XG59KSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENvbWJvO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldOyByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxyXG4gICogQENzc1V0aWxzIENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIENTUyB1dGlsaXR5IGJlbHQgZm9yIEFuaW1hdG9yIHVzaW5nIHRoZSBDU1NPTSAoZmlsZTovLy8gcHJvdG9jb2wgbm90IHN1cHBvcnRlZCBpbiBDaHJvbWUpIFxyXG4gICogQHJldHVybnMge09iamVjdH1cclxuICAqL1xuXG52YXIgQ3NzVXRpbHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENzc1V0aWxzKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ3NzVXRpbHMpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhDc3NVdGlscywgW3tcbiAgICAgICAga2V5OiBcImNyZWF0ZVN0eWxlU2hlZXRcIixcblxuICAgICAgICAvKipcclxuICAgICAgICAgICogQGNyZWF0ZVN0eWxlU2hlZXQgZnVuY3Rpb25cclxuICAgICAgICAgICpcclxuICAgICAgICAgICogQGRlc2NyaXB0aW9uIEEgc3R5bGVzaGVldCBmb3IgYW55IHRyYW5zaXRpb24gLyBhbmltYXRpb24gLyBzdHlsZSBjbGFzc2VzIGNyZWF0ZWQgaW4gQW5pbWF0b3IuXHJcbiAgICAgICAgICAqIEByZXR1cm5zIHtDU1NTdHlsZVNoZWV0fSBzdHlsZXNoZWV0XHJcbiAgICAgICAgICAqIEBnbG9iYWwgbm9cclxuICAgICAgICAgICovXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZVN0eWxlU2hlZXQoKSB7XG5cbiAgICAgICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICAgICAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlLnNoZWV0O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiY3NzVGV4dFRvSnNcIixcblxuICAgICAgICAvKipcclxuICAgICAgICAgICogQGNzc1RleHRUb0pzIGZ1bmN0aW9uXHJcbiAgICAgICAgICAqXHJcbiAgICAgICAgICAqIEBwYXJhbXMge1N0cmluZ31cclxuICAgICAgICAgICogQGRlc2NyaXB0aW9uIENvbnZlcnRzIGEgaHlwaGVuIGRlbGltdGVkIENTUyBwcm9wZXJ0eSB0byBhIGNhbWVsIGNhc2VkIEphdmFTY3JpcHQgcHJvcGVydHkuXHJcbiAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgICAgICAqIEBnbG9iYWwgbm9cclxuICAgICAgICAgICovXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNzc1RleHRUb0pzKGNzc1RleHQpIHtcblxuICAgICAgICAgICAgcmV0dXJuIGNzc1RleHQucmVwbGFjZSgvXFwtKFxcdykvZywgZnVuY3Rpb24gKHN0ciwgbGV0dGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxldHRlci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJzZXRTdHlsZXNcIixcblxuICAgICAgICAvKipcclxuICAgICAgICAgICogQHNldFN0eWxlcyBmdW5jdGlvblxyXG4gICAgICAgICAgKlxyXG4gICAgICAgICAgKiBAcGFyYW1zIHtIVE1MRWxlbWVudCAvIE5vZGVsaXN0LCBPYmplY3QsIEJvb2xlYW59XHJcbiAgICAgICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIHByb3BlcnRpZXMgb24gYW4gZWxlbWVudCdzIENTU1N0eWxlRGVjbGFyYXRpb24uXHJcbiAgICAgICAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICAgICAgICogIC0gZWxlbWVudDoge0hUTUxFbGVtZW50IC8gTm9kZWxpc3R9IEhUTUwgZWxlbWVudChzKSB0byBzZXQgc3R5bGVzIHByb3BlcnRpZXMgb24uXHJcbiAgICAgICAgICAgICAtIHN0eWxlcyA6IHtPYmplY3R9IE9iamVjdCBjb250YWluaW5nIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzLlxyXG4gICAgICAgICAgICAgLSBpbXBvcnRhbnQgOiBbQm9vbGVhbl0gKE9wdGlvbmFsKSBTcGVjaWZ5aW5nIGlmIHRoZSBDU1MgdmFsdWUgaXMgdG8gYmUgc2V0IGFzIGltcG9ydGFudC4gXHJcbiAgICAgICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICAgICAqL1xuXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRTdHlsZXMoZWxlbWVudCwgc3R5bGVzLCBpbXBvcnRhbnQpIHtcblxuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZWxlbWVudC5sZW5ndGggPyBBcnJheS5mcm9tKGVsZW1lbnQpIDogW2VsZW1lbnRdO1xuICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhzdHlsZXMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbXBvcnRhbnQgPSBpbXBvcnRhbnQgfHwgU3RyaW5nKHN0eWxlc1twcm9wZXJ0eV0pLmluY2x1ZGVzKFwiaW1wb3J0YW50XCIpID8gXCJpbXBvcnRhbnRcIiA6IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlcyA9IFN0cmluZyhzdHlsZXNbcHJvcGVydHldKS5yZXBsYWNlKC8hP2ltcG9ydGFudC8sIFwiXCIpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIHJ1bGVzLCBpbXBvcnRhbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJnZXRTdHlsZXNcIixcblxuICAgICAgICAvKipcclxuICAgICAgICAgICogQGdldFN0eWxlcyBmdW5jdGlvblxyXG4gICAgICAgICAgKlxyXG4gICAgICAgICAgKiBAcGFyYW1zIHtIVE1MRWxlbWVudCwgU3RyaW5nIC8gQXJyYXl9XHJcbiAgICAgICAgICAqIEBkZXNjcmlwdGlvbiBRdWVyaWVzIHByb3BlcnRpZXMgc2V0IG9uIGFuIGVsZW1lbnQncyBDU1NTdHlsZURlY2xhcmF0aW9uLlxyXG4gICAgICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICAgICAqICAtIGVsZW1lbnQ6IHtIVE1MRWxlbWVudH0gSFRNTCBlbGVtZW50IHRvIHF1ZXJ5IGFnYWludHMgaXRzIHN0eWxlIHByb3BlcnRpZXMuXHJcbiAgICAgICAgICAgICAtIHByb3BzIDoge1N0cmluZyAvIEFycmF5fSBTdHJpbmcgb3IgQXJyYXkgb2Ygc3RyaW5ncyBvZiBDU1MgcHJvcGVydGllcyB0byBxdWVyeS5cclxuICAgICAgICAgICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzXHJcbiAgICAgICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICAgICAqL1xuXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdHlsZXMoZWxlbWVudCwgcHJvcHMpIHtcblxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBBcnJheS5pc0FycmF5KHByb3BzKSA/IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkocHJvcHMpKSA6IFtwcm9wc107XG4gICAgICAgICAgICB2YXIgc3R5bGVzID0ge30sXG4gICAgICAgICAgICAgICAgdGVtcCA9IHt9O1xuICAgICAgICAgICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIHN0eWxlc1twcm9wZXJ0eV0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlcztcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNyZWF0ZVRyYW5zaXRpb25cIixcblxuICAgICAgICAvKipcclxuICAgICAgICAgICogQGNyZWF0ZVRyYW5zaXRpb24gZnVuY3Rpb25cclxuICAgICAgICAgICpcclxuICAgICAgICAgICogQHBhcmFtcyB7T2JqZWN0LCBDbGFzc31cclxuICAgICAgICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBzdHJpbmcgZGVmaW5pbmcgYW4gZWxlbWVudCdzIENTUyB0cmFuc2l0aW9uIHZhbHVlcyBhbmQgc2V0cyBpdCBvbiB0aGUgZWxlbWVudCdzIENTU1N0eWxlRGVjbGFyYXRpb24uIFxyXG4gICAgICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICAgICAqICAtIHRyYW5zaXRpb246IHtPYmplY3R9IEFuIG9iamVjdCBvZiB0cmFuc2l0aW9uIHByb3BlcnRpZXMuXHJcbiAgICAgICAgICAgICAgICAgLSBlbGVtZW50cyB7SFRNTEVsZW1lbnQgLyBOb2RlbGlzdH0gSFRNTEVsZW1lbnQocykgdG8gc2V0IHRyYW5zaXRpb24gb24uXHJcbiAgICAgICAgICAgICAgICAgLSBwcm9wZXJ0aWVzIHtTdHJpbmcgLyBBcnJheX0gQ1NTIHByb3BlcnRpZXMgdG8gdHJhbnNpdGlvbi5cclxuICAgICAgICAgICAgICAgICAtIGR1cmF0aW9uIHtTdHJpbmcgLyBBcnJheX0gTXMgb3IgUyB0cmFuc2l0aW9uIGR1cmF0aW9uIHZhbHVlKHMpLlxyXG4gICAgICAgICAgICAgICAgIC0gZWFzaW5nIFtTdHJpbmcgLyBBcnJheV0gKE9wdGlvbmFsKSBUcmFuc2l0aW9uIHRpbWluZyBmdW5jdGlvbiB2YWx1ZShzKS5cclxuICAgICAgICAgICAgICAgICAtIGRlbGF5IFtTdHJpbmcgLyBBcnJheV0gKE9wdGlvbmFsKSBUcmFuc2l0aW9uIGRlbGF5IHZhbHVlKHMpLlxyXG4gICAgICAgICAgICAgLSBQcmVmaXggOiB7Q2xhc3N9IFByZWZpeCBjbGFzcy5cclxuICAgICAgICAgICogQGdsb2JhbCB5ZXNcclxuICAgICAgICAgICovXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zaXRpb24odHJhbnNpdGlvbiwgUHJlZml4KSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvblByZWZpeCA9IG5ldyBQcmVmaXgoKS5nZXRQcmVmaXgoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gdHJhbnNpdGlvbi5lbGVtZW50Lmxlbmd0aCA/IEFycmF5LmZyb20odHJhbnNpdGlvbi5lbGVtZW50KSA6IFt0cmFuc2l0aW9uLmVsZW1lbnRdO1xuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBBcnJheS5pc0FycmF5KHRyYW5zaXRpb24ucHJvcGVydGllcykgPyBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHRyYW5zaXRpb24ucHJvcGVydGllcykpIDogW3RyYW5zaXRpb24ucHJvcGVydGllc107XG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBBcnJheS5pc0FycmF5KHRyYW5zaXRpb24uZHVyYXRpb24pID8gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheSh0cmFuc2l0aW9uLmR1cmF0aW9uKSkgOiBbdHJhbnNpdGlvbi5kdXJhdGlvbl07XG4gICAgICAgICAgICB2YXIgZWFzaW5nID0gQXJyYXkuaXNBcnJheSh0cmFuc2l0aW9uLmVhc2luZykgPyBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHRyYW5zaXRpb24uZWFzaW5nKSkgOiBbdHJhbnNpdGlvbi5lYXNpbmddO1xuICAgICAgICAgICAgdmFyIGRlbGF5ID0gQXJyYXkuaXNBcnJheSh0cmFuc2l0aW9uLmRlbGF5KSA/IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkodHJhbnNpdGlvbi5kZWxheSkpIDogW3RyYW5zaXRpb24uZGVsYXldO1xuXG4gICAgICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNpdGlvblN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdmFyIHJ1bGVzID0ge307XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3AsIGkpIHtcblxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uU3RyaW5nICs9IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uU3RyaW5nICs9IHByb3BlcnRpZXMubGVuZ3RoID4gMSA/IHByb3BlcnRpZXNbaV0gKyBcIiBcIiA6IHByb3BlcnRpZXNbMF0gKyBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvblN0cmluZyArPSBkdXJhdGlvbi5sZW5ndGggPiAxID8gZHVyYXRpb25baV0gKyBcIiBcIiA6IGR1cmF0aW9uWzBdICsgXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25TdHJpbmcgKz0gZWFzaW5nLmxlbmd0aCA+IDEgPyBlYXNpbmdbaV0gKyBcIiBcIiA6IChlYXNpbmdbMF0gfHwgXCJlYXNlXCIpICsgXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25TdHJpbmcgKz0gZGVsYXkubGVuZ3RoID4gMSA/IGRlbGF5W2ldICsgXCIsXCIgOiAoZGVsYXlbMF0gfHwgXCIwc1wiKSArIFwiLFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvblN0cmluZyA9IHRyYW5zaXRpb25TdHJpbmcuc3Vic3RyKDAsIHRyYW5zaXRpb25TdHJpbmcubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICAgICAgcnVsZXNbdHJhbnNpdGlvblByZWZpeF0gPSB0cmFuc2l0aW9uU3RyaW5nO1xuICAgICAgICAgICAgICAgIF90aGlzLnNldFN0eWxlcyhlbGVtZW50LCBydWxlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNyZWF0ZUtleWZyYW1lQW5pbWF0aW9uXCIsXG5cbiAgICAgICAgLyoqXHJcbiAgICAgICAgICAqIEBjcmVhdGVLZXlmcmFtZUFuaW1hdGlvbiBmdW5jdGlvblxyXG4gICAgICAgICAgKlxyXG4gICAgICAgICAgKiBAcGFyYW1zIHtPYmplY3QsIENsYXNzLCBDU1NTdHlsZVNoZWV0fVxyXG4gICAgICAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIENTUyBrZXlmcmFtZSBhbmltYXRpb24sIGFuZCBvcHRpb25hbCBhc3NvY2lhdGVkIHN0eWxlIGNsYXNzLCBhbmQgaW5zZXJ0cyBpdC90aGVtIGludG8gQW5pbWF0b3IncyBzdHlsZXNoZWV0LiBcclxuICAgICAgICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgICAgICAgKiAgLSBhbmltYXRpb246IHtPYmplY3R9IEFuIG9iamVjdCBvZiBhbmltYXRpb24gcHJvcGVydGllcy5cclxuICAgICAgICAgICAgICAgICAtIG5hbWUge0hUTUxFbGVtZW50IC8gTm9kZWxpc3R9IEhUTUxFbGVtZW50KHMpIHRvIHNldCB0cmFuc2l0aW9uIG9uLlxyXG4gICAgICAgICAgICAgICAgIC0gYW5pbWF0aW9uIHtPYmplY3R9IEVpdGhlciBmcm9tIC8gdG8gb3IgJSBiYXNlZCBrZXlmcmFtZXMgYW5kIENTUyBwcm9wZXJ0aWVzIC8gdmFsdWVzLlxyXG4gICAgICAgICAgICAgICAgIC0gYW5pbWF0aW9uQ2xhc3MgW09iamVjdF0gKE9wdGlvbmFsKSBBIENTUyBjbGFzcyB0byB0cmlnZ2VyIHRoZSBhbmltYXRpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgIC0gbmFtZSB7U3RyaW5nfSBUaGUgY2xhc3NuYW1lLlxyXG4gICAgICAgICAgICAgICAgICAgICAtIHJ1bGVzIHtPYmplY3R9IE9iamVjdCBvZiBDU1MgcHJvcGVydHkgLyB2YWx1ZSBwYWlycy5cclxuICAgICAgICAgICAgIC0gUHJlZml4IDoge0NsYXNzfSBQcmVmaXggY2xhc3MuXHJcbiAgICAgICAgICAgICAtIHN0eWxlc2hlZXQgOiB7Q1NTU3R5bGVTaGVldH0gQW5pbWF0b3IncyBzdHlsZXNoZWV0LlxyXG4gICAgICAgICAgKiBAZ2xvYmFsIHllc1xyXG4gICAgICAgICAgKi9cblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlS2V5ZnJhbWVBbmltYXRpb24oYW5pbWF0aW9uLCBQcmVmaXgsIHN0eWxlc2hlZXQpIHtcblxuICAgICAgICAgICAgdmFyIGFuaW1hdGlvblN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gbmV3IFByZWZpeCgpO1xuICAgICAgICAgICAgdmFyIGtleUZyYW1lID0gcHJlZml4LmdldFByZWZpeChcImtleWZyYW1lc1wiKTtcbiAgICAgICAgICAgIGtleUZyYW1lICs9IFwiIFwiICsgYW5pbWF0aW9uLm5hbWUgKyBcIiB7XFxuXCI7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFuaW1hdGlvbi5hbmltYXRpb24pLmZvckVhY2goZnVuY3Rpb24gKGFuaW0pIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25TdHJpbmcgKz0gYW5pbSArIFwiIHtcIjtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhhbmltYXRpb24uYW5pbWF0aW9uW2FuaW1dKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25TdHJpbmcgKz0gXCJcXG5cIiArIHByb3BlcnR5ICsgXCIgOiBcIiArIGFuaW1hdGlvbi5hbmltYXRpb25bYW5pbV1bcHJvcGVydHldICsgXCI7XCI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uU3RyaW5nICs9IFwiXFxuIH1cXG5cIjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhbmltYXRpb25TdHJpbmcgKz0gXCJ9XCI7XG5cbiAgICAgICAgICAgIHN0eWxlc2hlZXQuaW5zZXJ0UnVsZShrZXlGcmFtZSArIGFuaW1hdGlvblN0cmluZywgc3R5bGVzaGVldC5ydWxlcy5sZW5ndGggfHwgc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgICAgICAgICAgaWYgKGFuaW1hdGlvbi5hbmltYXRpb25DbGFzcykge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlQ2xhc3MoYW5pbWF0aW9uLmFuaW1hdGlvbkNsYXNzLm5hbWUsIHN0eWxlc2hlZXQsIGFuaW1hdGlvbi5hbmltYXRpb25DbGFzcy5ydWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJjcmVhdGVDbGFzc1wiLFxuXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgKiBAY3JlYXRlQ2xhc3MgZnVuY3Rpb25cclxuICAgICAgICAgICpcclxuICAgICAgICAgICogQHBhcmFtcyB7U3RyaW5nLCBDU1NTdHlsZVNoZWV0LCBPYmplY3QgKE9wdGlvbmFsKX1cclxuICAgICAgICAgICogQGRlc2NyaXB0aW9uIERlZmluZXMgYSBDU1MgY2xhc3MgYW5kIGluc2VydHMgaXQgaW50byBBbmltYXRvcidzIHN0eWxlc2hlZXQuIFxyXG4gICAgICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICAgICAqICAtIGNsYXNzTmFtZToge1N0cmluZ30gVGhlIG5hbWUgb2YgdGhlIGNsYXNzLlxyXG4gICAgICAgICAgICAgLSBzdHlsZXNoZWV0IDoge0NTU1N0eWxlU2hlZXR9IEFuaW1hdG9yJ3Mgc3R5bGVzaGVldC5cclxuICAgICAgICAgICAgIC0gcnVsZXMgOiBbT2JqZWN0XSAoT3B0aW9uYWwpIE9iamVjdCBvZiBDU1MgcHJvcGVydHkgLyB2YWx1ZSBwYWlycy5cclxuICAgICAgICAgICogQGdsb2JhbCB5ZXNcclxuICAgICAgICAgICovXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUNsYXNzKGNsYXNzTmFtZSwgc3R5bGVzaGVldCkge1xuICAgICAgICAgICAgdmFyIHJ1bGVzID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1syXTtcblxuICAgICAgICAgICAgdmFyIG5hbWUgPSBcIi5cIiArIGNsYXNzTmFtZTtcbiAgICAgICAgICAgIHZhciBjc3NTdHJpbmcgPSBcInsgXCI7XG5cbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgY3NzU3RyaW5nICs9IHJ1bGUgKyBcIiA6IFwiICsgcnVsZXNbcnVsZV0gKyBcIjsgXCI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY3NzU3RyaW5nICs9IFwifVwiO1xuICAgICAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKG5hbWUgKyBjc3NTdHJpbmcsIHN0eWxlc2hlZXQucnVsZXMubGVuZ3RoIHx8IHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImRlbGV0ZUNsYXNzXCIsXG5cbiAgICAgICAgLyoqXHJcbiAgICAgICAgICAqIEBkZWxldGVDbGFzcyBmdW5jdGlvblxyXG4gICAgICAgICAgKlxyXG4gICAgICAgICAgKiBAcGFyYW1zIHtTdHJpbmcsIENTU1N0eWxlU2hlZXR9XHJcbiAgICAgICAgICAqIEBkZXNjcmlwdGlvbiBSZW1vdmVzIGEgQ1NTIGNsYXNzIGZyb20gQW5pbWF0b3IncyBzdHlsZXNoZWV0LiBcclxuICAgICAgICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgICAgICAgKiAgLSBjbGFzc05hbWU6IHtTdHJpbmd9IFRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byByZW1vdmUuXHJcbiAgICAgICAgICAgICAtIHN0eWxlc2hlZXQgOiB7Q1NTU3R5bGVTaGVldH0gQW5pbWF0b3IncyBzdHlsZXNoZWV0LlxyXG4gICAgICAgICAgKiBAZ2xvYmFsIHllc1xyXG4gICAgICAgICAgKi9cblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZGVsZXRlQ2xhc3MoY2xhc3NOYW1lLCBzdHlsZXNoZWV0KSB7XG5cbiAgICAgICAgICAgIHZhciBydWxlcyA9IHN0eWxlc2hlZXQucnVsZXMgfHwgc3R5bGVzaGVldC5jc3NSdWxlcztcbiAgICAgICAgICAgIHZhciBuYW1lID0gXCIuXCIgKyBjbGFzc05hbWU7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhydWxlcykuZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgICAgICAgICAgICAgIGlmIChydWxlc1tydWxlXSBpbnN0YW5jZW9mIENTU1N0eWxlUnVsZSAmJiBydWxlc1tydWxlXS5zZWxlY3RvclRleHQgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzaGVldC5kZWxldGVSdWxlKHJ1bGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiY3JlYXRlQ1NTUnVsZVwiLFxuXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBjcmVhdGVDU1NSdWxlIGZ1bmN0aW9uXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW1zIHtTdHJpbmcgLyBBcnJheSwgU3RyaW5nIC8gQXJyYXl9XHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgYW4gb2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlcy4gXHJcbiAgICAgICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgICAgICAqICAtIHByb3BlcnR5OiB7U3RyaW5nIC8gQXJyYXl9IFRoZSBDU1MgcHJvcGVydHkocykuXHJcbiAgICAgICAgICAgIC0gdmFsdWUgOiB7U3RyaW5nIC8gQXJyYXl9IFRoZSBDU1MgdmFsdWVzKHMpLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCBvZiBDU1MgcHJvcGVydHkgLyB2YWx1ZSBwYWlycy5cclxuICAgICAgICAgKiBAZ2xvYmFsIHllc1xyXG4gICAgICAgICAqL1xuXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVDU1NSdWxlKHByb3BlcnR5LCB2YWx1ZSkge1xuXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEFycmF5LmlzQXJyYXkocHJvcGVydHkpID8gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShwcm9wZXJ0eSkpIDogW3Byb3BlcnR5XTtcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkodmFsdWUpKSA6IFt2YWx1ZV07XG4gICAgICAgICAgICB2YXIgcnVsZSA9IHt9O1xuXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3AsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcnVsZVtwcm9wXSA9IHZhbHVlc1tpbmRleF07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJ1bGU7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gQ3NzVXRpbHM7XG59KSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IENzc1V0aWxzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTsgcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKipcclxuICAqIEBEb21VdGlscyBDbGFzc1xyXG4gICpcclxuICAqIEBkZXNjcmlwdGlvbiBQcm92aWRlcyBET00gdXRpbGl0aWVzIGZvciBBbmltYXRvci5cclxuICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgKi9cblxudmFyIERvbVV0aWxzID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRG9tVXRpbHMoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERvbVV0aWxzKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhEb21VdGlscywgW3tcbiAgICBrZXk6IFwic2V0Q2xhc3NcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBzZXRDbGFzcyBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7SFRNTEVsZW1lbnQsIFN0cmluZyAvIEFycmF5LCBCb29sZWFufVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBBZGRzIG9yIHJlbW92ZXMgY2xhc3MoZXMpIGZyb20gYW4gZWxlbWVudC5cclxuICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICogIC0gZWxlbWVudDoge0hUTUxFbGVtZW50fSBUaGUgZWxlbWVudCB0byBhZGQgLyByZW1vdmUgdGhlIGNsYXNzKGVzKSB0byAvIGZyb20uXHJcbiAgICAgICogIC0gY2xhc3NMaXN0OiB7U3RyaW5nIC8gQXJyYXl9IEEgc2luZ2xlIGNsYXNzbmFtZSBvciBhcnJheSBvZiBjbGFzc25hbWVzIHRvIGFkZCAvIHJlbW92ZS5cclxuICAgICAgKlx0LSBhZGQ6IHtCb29sZWFufSBTcGVjaWZpeWluZyB3aGV0aGVyIHRvIGFkZCAvIHJlbW92ZSB0aGUgY2xhc3MoZXMpLlxyXG4gICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Q2xhc3MoZWxlbWVudCwgY2xhc3NMaXN0LCBhZGQpIHtcblxuICAgICAgdmFyIGNsYXNzZXMgPSBBcnJheS5pc0FycmF5KGNsYXNzTGlzdCkgPyBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KGNsYXNzTGlzdCkpIDogW2NsYXNzTGlzdF07XG4gICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50Lmxlbmd0aCA/IEFycmF5LmZyb20oZWxlbWVudCkgOiBbZWxlbWVudF07XG4gICAgICB2YXIgYWN0aW9uID0gYWRkID8gXCJhZGRcIiA6IFwicmVtb3ZlXCI7XG4gICAgICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGNscykge1xuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgIGVsLmNsYXNzTGlzdFthY3Rpb25dKGNscyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN1cHBvcnRcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBzdXBwb3J0IGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtDbGFzcywgQ2xhc3N9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFRlc3RzIGZvciBDU1MgdHJhbnNpdGlvbiAvIGFuaW1hdGlvbiAvIENTU09NIG1hbmlwdWxhdGlvbiBzdXBwb3J0XHJcbiAgICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgICAqICAtIFByZWZpeDoge0NsYXNzfSBQcmVmaXggY2xhc3MuXHJcbiAgICAgICogIC0gQ3NzVXRpbHM6IHtDbGFzc30gQ1NTIHV0aWxpdGllcyBjbGFzcy5cclxuICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAgICAgKiBAZ2xvYmFsIHllc1xyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN1cHBvcnQoUHJlZml4LCBDc3NVdGlscykge1xuXG4gICAgICB2YXIgcHJlZml4ID0gbmV3IFByZWZpeCgpO1xuICAgICAgdmFyIGNzc1V0aWxzID0gbmV3IENzc1V0aWxzKCk7XG4gICAgICB2YXIgdHJhbnNpdGlvblN1cHBvcnQgPSBwcmVmaXguZ2V0UHJlZml4KFwidHJhbnNpdGlvblwiKTtcbiAgICAgIHZhciBhbmltYXRpb25TdXBwb3J0ID0gcHJlZml4LmdldFByZWZpeChcImFuaW1hdGlvblwiKTtcbiAgICAgIHZhciByYWYgPSAhIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbiAgICAgIHJldHVybiB0cmFuc2l0aW9uU3VwcG9ydCAmJiBhbmltYXRpb25TdXBwb3J0ICYmIHJhZjtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gRG9tVXRpbHM7XG59KSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IERvbVV0aWxzO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdFx0dmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxyXG4gICogQFByZWZpeCBDbGFzc1xyXG4gICpcclxuICAqIEBkZXNjcmlwdGlvbiBIYW5kbGVzIHByZWZpeGluZyBmb3IgQ1NTIHByb3BlcnRpZXMgYW5kIERPTSBldmVudHMuXHJcbiAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICovXG5cbnZhciBQcmVmaXggPSAoZnVuY3Rpb24gKCkge1xuXG5cdFx0LyoqXHJcbiAgICAqIEBjb25zdHJ1Y3RvciBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIG1hcCB0aGF0IGhvbGRzIG5vbi1wcmVmaXhlZCBwcm9wZXJ0aWVzIGFuZCBldmVudCBuYW1lcyBhcyBrZXlzIGFuZCBhc3NvY2lhdGVkIHByZWZpeGVzIGFzIHZhbHVlcyB0byB0ZXN0IGFnYWluc3QuXHJcbiAgICAqL1xuXG5cdFx0ZnVuY3Rpb24gUHJlZml4KCkge1xuXHRcdFx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHJlZml4KTtcblxuXHRcdFx0XHR0aGlzLnRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcyA9IG5ldyBNYXAoKTtcblxuXHRcdFx0XHQvLyBUcmFuc2Zvcm1zXG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwidHJhbnNmb3JtXCIsIFtcIi13ZWJraXQtdHJhbnNmb3JtXCIsIFwidHJhbnNmb3JtXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsIFtcIi13ZWJraXQtdHJhbnNmb3JtLW9yaWdpblwiLCBcInRyYW5zZm9ybS1vcmlnaW5cIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcInRyYW5zZm9ybS1zdHlsZVwiLCBbXCItd2Via2l0LXRyYW5zZm9ybS1zdHlsZVwiLCBcInRyYW5zZm9ybS1zdHlsZVwiXSk7XG5cblx0XHRcdFx0Ly8gVHJhbnNpdGlvbnNcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJ0cmFuc2l0aW9uXCIsIFtcIi13ZWJraXQtdHJhbnNpdGlvblwiLCBcInRyYW5zaXRpb25cIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcInRyYW5zaXRpb24tZGVsYXlcIiwgW1wiLXdlYmtpdC10cmFuc2l0aW9uLWRlbGF5XCIsIFwidHJhbnNpdGlvbi1kZWxheVwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLCBbXCItd2Via2l0LXRyYW5zaXRpb24tZHVyYXRpb25cIiwgXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJ0cmFuc2l0aW9uLXByb3BlcnR5XCIsIFtcIi13ZWJraXQtdHJhbnNpdGlvbi1wcm9wZXJ0eVwiLCBcInRyYW5zaXRpb24tcHJvcGVydHlcIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcInRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uXCIsIFtcIi13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb25cIiwgXCJ0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvblwiXSk7XG5cblx0XHRcdFx0Ly8gQW5pbWF0aW9uc1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcImtleWZyYW1lc1wiLCBbXCItd2Via2l0LVwiLCBcIi1tcy1cIiwgXCItbW96LVwiLCBcIlwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwiYW5pbWF0aW9uXCIsIFtcIi13ZWJraXQtYW5pbWF0aW9uXCIsIFwiLW1zLWFuaW1hdGlvblwiLCBcIi1tb3otYW5pbWF0aW9uXCIsIFwiYW5pbWF0aW9uXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb24tbmFtZVwiLCBbXCItd2Via2l0LWFuaW1hdGlvbi1uYW1lXCIsIFwiLW1zLWFuaW1hdGlvbi1uYW1lXCIsIFwiLW1vei1hbmltYXRpb24tbmFtZVwiLCBcImFuaW1hdGlvbi1uYW1lXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb24taXRlcmF0aW9uLWNvdW50XCIsIFtcIi13ZWJraXQtYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudFwiLCBcIi1tcy1hbmltYXRpb24taXRlcmF0aW9uLWNvdW50XCIsIFwiLW1vei1hbmltYXRpb24taXRlcmF0aW9uLWNvdW50XCIsIFwiYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudFwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwiYW5pbWF0aW9uLXBsYXktc3RhdGVcIiwgW1wiLXdlYmtpdC1hbmltYXRpb24tcGxheS1zdGF0ZVwiLCBcIi1tcy1hbmltYXRpb24tcGxheS1zdGF0ZVwiLCBcIi1tb3otYW5pbWF0aW9uLXBsYXktc3RhdGVcIiwgXCJhbmltYXRpb24tcGxheS1zdGF0ZVwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwiYW5pbWF0aW9uLWR1cmF0aW9uXCIsIFtcIi13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uXCIsIFwiLW1zLWFuaW1hdGlvbi1kdXJhdGlvblwiLCBcIi1tb3otYW5pbWF0aW9uLWR1cmF0aW9uXCIsIFwiYW5pbWF0aW9uLWR1cmF0aW9uXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb24tZGVsYXlcIiwgW1wiLXdlYmtpdC1hbmltYXRpb24tZGVsYXlcIiwgXCItbXMtYW5pbWF0aW9uLWRlbGF5XCIsIFwiLW1vei1hbmltYXRpb24tZGVsYXlcIiwgXCJhbmltYXRpb24tZGVsYXlcIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcImFuaW1hdGlvbi1kaXJlY3Rpb25cIiwgW1wiLXdlYmtpdC1hbmltYXRpb24tZGlyZWN0aW9uXCIsIFwiLW1zLWFuaW1hdGlvbi1kaXJlY3Rpb25cIiwgXCItbW96LWFuaW1hdGlvbi1kaXJlY3Rpb25cIiwgXCJhbmltYXRpb24tZGlyZWN0aW9uXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb24tZmlsbC1tb2RlXCIsIFtcIi13ZWJraXQtYW5pbWF0aW9uLWZpbGwtbW9kZVwiLCBcIi1tcy1hbmltYXRpb24tZmlsbC1tb2RlXCIsIFwiLW1vei1hbmltYXRpb24tZmlsbC1tb2RlXCIsIFwiYW5pbWF0aW9uLWZpbGwtbW9kZVwiXSk7XG5cblx0XHRcdFx0Ly8gVHJhbnNpdGlvbiAvIEFuaW1hdGlvbiBlbmRcblx0XHRcdFx0dmFyIFdlYmtpdFRyYW5zaXRpb24gPSBcIndlYmtpdFRyYW5zaXRpb25FbmRcIjtcblx0XHRcdFx0dmFyIHRyYW5zaXRpb24gPSBcInRyYW5zaXRpb25lbmRcIjtcblx0XHRcdFx0dmFyIFdlYmtpdEFuaW1hdGlvbiA9IFwid2Via2l0QW5pbWF0aW9uRW5kXCI7XG5cdFx0XHRcdHZhciBhbmltYXRpb24gPSBcImFuaW1hdGlvbmVuZFwiO1xuXG5cdFx0XHRcdHZhciB0cmFuc2l0aW9uZW5kID0geyBXZWJraXRUcmFuc2l0aW9uOiBXZWJraXRUcmFuc2l0aW9uLCB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uIH07XG5cdFx0XHRcdHZhciBhbmltYXRpb25lbmQgPSB7IFdlYmtpdEFuaW1hdGlvbjogV2Via2l0QW5pbWF0aW9uLCBhbmltYXRpb246IGFuaW1hdGlvbiB9O1xuXG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwidHJhbnNpdGlvbmVuZFwiLCB0cmFuc2l0aW9uZW5kKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb25lbmRcIiwgYW5pbWF0aW9uZW5kKTtcblx0XHR9XG5cblx0XHRfY3JlYXRlQ2xhc3MoUHJlZml4LCBbe1xuXHRcdFx0XHRrZXk6IFwiZ2V0UHJlZml4XCIsXG5cblx0XHRcdFx0LyoqXHJcbiAgICAgICogQGdldFByZWZpeCBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7U3RyaW5nfSBUaGUgbm9uLXByZWZpeGVkIENTUyBwcm9wZXJ0eSAvIERPTSBldmVudCBuYW1lIHRvIHNlYXJjaCB0aGUgcHJlZml4IG1hcCBmb3IuXHJcbiAgICAgICogQGRlc2NyaXB0aW9uIEhhbmRsZXMgcHJlZml4IHF1ZXJpZXMgYnkgc2VhcmNoaW5nIGFuZCB0ZXN0aW5nIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBpbiB0aGUgcHJlZml4IG1hcCBhZ2FpbnN0IGEgSFRNTEVsZW1lbnQncyBDU1NTdHlsZURlY2xhcmF0aW9uLlxyXG4gICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBxdWVyaWVkIHByZWZpeC5cclxuICAgICAgKiBAZ2xvYmFsIHllc1xyXG4gICAgICAqL1xuXG5cdFx0XHRcdHZhbHVlOiBmdW5jdGlvbiBnZXRQcmVmaXgocHJlZml4KSB7XG5cdFx0XHRcdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMucHJlZml4ZXMuaGFzKHByZWZpeCkpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHByZWZpeCA9PT0gXCJ0cmFuc2l0aW9uZW5kXCIgfHwgcHJlZml4ID09PSBcImFuaW1hdGlvbmVuZFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0UHJlZml4ZWRFdmVudE5hbWUocHJlZml4KTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHJlZml4ID09PSBcImtleWZyYW1lc1wiKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGtleWZyYW1lUHJlZml4ID0gdGhpcy5wcmVmaXhlcy5nZXQocHJlZml4KS5maWx0ZXIoZnVuY3Rpb24gKGYpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzLnRlc3RFbGVtZW50LnN0eWxlW2YgKyBcImFuaW1hdGlvbi1uYW1lXCJdICE9PSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdFx0fSlbMF07XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiQFwiICsga2V5ZnJhbWVQcmVmaXggKyBcImtleWZyYW1lc1wiO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5wcmVmaXhlcy5nZXQocHJlZml4KS5maWx0ZXIoZnVuY3Rpb24gKGYpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzLnRlc3RFbGVtZW50LnN0eWxlW2ZdICE9PSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHRcdFx0fSlbMF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRcdGtleTogXCJnZXRQcmVmaXhlZEV2ZW50TmFtZVwiLFxuXG5cdFx0XHRcdC8qKlxyXG4gICAgICAqIEBnZXRQcmVmaXhlZEV2ZW50TmFtZSBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7U3RyaW5nfSBUaGUgbm9uLXByZWZpeGVkIERPTSBldmVudCBuYW1lIHRvIHNlYXJjaCB0aGUgcHJlZml4IG1hcCBmb3IuXHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFRlc3RzIGEgSFRNTEVsZW1lbnQncyBDU1NTdHlsZURlY2xhcmF0aW9uIGZvciBzdXBwb3J0ZWQgRE9NIGV2ZW50IHByZWZpeGVzLlxyXG4gICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBxdWVyaWVkIHByZWZpeC5cclxuICAgICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAgICovXG5cblx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGdldFByZWZpeGVkRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuXHRcdFx0XHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdFx0XHRcdHZhciBldnROYW1lcyA9IHRoaXMucHJlZml4ZXMuZ2V0KGV2ZW50TmFtZSk7XG5cdFx0XHRcdFx0XHR2YXIgbWF0Y2hlcyA9IE9iamVjdC5rZXlzKGV2dE5hbWVzKS5maWx0ZXIoZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXMyLnRlc3RFbGVtZW50LnN0eWxlW2VdICE9PSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdHJldHVybiBldnROYW1lc1ttYXRjaGVzWzBdXTtcblx0XHRcdFx0fVxuXHRcdH1dKTtcblxuXHRcdHJldHVybiBQcmVmaXg7XG59KSgpO1xuXG47XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gUHJlZml4O1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAU2VxdWVuY2VXcmFwcGVyIENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIEludGVyY2VwdHMgYWxsIHNlcXVlbmNlcyBhbmQgcmV0dXJucyBhIHNpbmdsZSBvciBjb21ibyBzZXF1ZW5jZSBkZXBlbmRpbmcgb24gd2hldGhlciBhIHNpbmdsZSBIVE1MRWxlbWVudCBvciBOb2RlbGlzdCBpcyB1c2VkLlxyXG4gICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgKi9cblxudmFyIFNlcXVlbmNlV3JhcHBlciA9XG5cbi8qKlxyXG4gICogQGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAgKlxyXG4gICogQHBhcmFtcyB7T2JqZWN0LCBDbGFzcywgQ2xhc3MsIENsYXNzLCBDbGFzcywgQ2xhc3MsIENsYXNzLCBPYmplY3R9ICAgICBcclxuICAqIEBkZXNjcmlwdGlvbiBBIHdyYXBwZXIgdGhhdCBvcmdhbmlzZXMgYWxsIHNlcXVlbmNlcyBiZWZvcmUgdGhleSBhcmUgbGF1bmNoZWQuIFxyXG4qIEBwYXJhbXMgZGVzY3JpcHRpb25cclxuLSBvcHRpb25zIHtPYmplY3R9IE9iamVjdCBvZiBzZXF1ZW5jZSBvcHRpb25zLlxyXG4tIERvbVV0aWxzIHtDbGFzc30gRE9NIHV0aWxpdGllcyBjbGFzcy5cclxuLSBQcmVmaXgge0NsYXNzfSBQcmVmaXggY2xhc3MuXHJcbi0gQ3NzVXRpbHMge0NsYXNzfSBDU1MgVXRpbGl0aWVzIGNsYXNzLlxyXG4tIFNlcXVlbmNlIHtDbGFzc30gVGhlIHNlcXVlbmNlIHR5cGUgKFRyYW5zaXRpb24gLyBBbmltYXRpb24pLlxyXG4tIENvbWJvIHtDbGFzc30gV3JhcHBlciBmb3IgbXVsdGlwbGUgc2VxdWVuY2VzLlxyXG4tIFRyYWNrZXIge09iamVjdH0gT2JqZWN0IHRvIHN0b3JlIGFuZCB0cmFjayBzZXF1ZW5jZXMgdGhyb3VnaC5cclxuKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAqL1xuXG5mdW5jdGlvbiBTZXF1ZW5jZVdyYXBwZXIob3B0aW9ucywgRG9tVXRpbHMsIFByZWZpeCwgQ3NzVXRpbHMsIFNlcXVlbmNlLCBDb21ibywgVHJhY2tlcikge1xuXHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2VxdWVuY2VXcmFwcGVyKTtcblxuXHRpZiAob3B0aW9ucy5lbGVtZW50Lmxlbmd0aCkge1xuXHRcdHZhciB0cmFuc2l0aW9ucyA9IEFycmF5LmZyb20ob3B0aW9ucy5lbGVtZW50KS5tYXAoZnVuY3Rpb24gKGVsZW1lbnQpIHtcblx0XHRcdHZhciBvcHRzID0ge307XG5cdFx0XHRPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0b3B0c1trZXldID0gb3B0aW9uc1trZXldO1xuXHRcdFx0fSk7XG5cdFx0XHRvcHRzLmVsZW1lbnQgPSBlbGVtZW50O1xuXHRcdFx0VHJhY2tlci50cmFjayhvcHRzLCBTZXF1ZW5jZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFNlcXVlbmNlKG9wdHMsIERvbVV0aWxzLCBQcmVmaXgsIENzc1V0aWxzLCBUcmFja2VyKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3IENvbWJvKHRyYW5zaXRpb25zKTtcblx0fSBlbHNlIHtcblx0XHRUcmFja2VyLnRyYWNrKG9wdGlvbnMsIFNlcXVlbmNlKTtcblx0XHRyZXR1cm4gbmV3IFNlcXVlbmNlKG9wdGlvbnMsIERvbVV0aWxzLCBQcmVmaXgsIENzc1V0aWxzLCBUcmFja2VyKTtcblx0fVxufTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBTZXF1ZW5jZVdyYXBwZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldOyByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxyXG4gICogQFRyYWNrZXIgQ2xhc3NcclxuICAqXHJcbiAgKiBAZGVzY3JpcHRpb24gVHJhY2sgYWxsIHNlcXVlbmNlZCBlbGVtZW50cyB0byBhbGxvdyBzZXF1ZW5jZXMgdG8gYmUgcGxheWVkIC8gcGF1c2VkLlxyXG4gICogQHJldHVybnMge09iamVjdH1cclxuICAqL1xuXG52YXIgVHJhY2tlciA9IChmdW5jdGlvbiAoKSB7XG5cblx0LyoqXHJcbiAgICogQGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAgICpcclxuICAgKiBAcGFyYW1zIHtDbGFzcywgQ2xhc3MsIENsYXNzLCBDbGFzc30gICAgXHJcbiAgICogQGRlc2NyaXB0aW9uIEluaXRpYWxpc2UgYSBzaW5nbGUgTWFwIG9iamVjdCB0byBzdG9yZSBzZXF1ZW5jZWQgZWxlbWVudHMuIE9ubHkgb25lIGluc3RhbmNlIHBlciBBbmltYXRvciBpcyBjcmVhdGVkLiAgXHJcbiAqIEBwYXJhbXMgZGVzY3JpcHRpb25cclxuIC0gRG9tVXRpbHMge0NsYXNzfSBET00gdXRpbGl0aWVzIGNsYXNzLlxyXG4gLSBQcmVmaXgge0NsYXNzfSBQcmVmaXggY2xhc3MuXHJcbiAtIENzc1V0aWxzIHtDbGFzc30gQ1NTIFV0aWxpdGllcyBjbGFzcy5cclxuIC0gVHJhbnNpdGlvbiB7Q2xhc3N9IFN0b3JlIHRoZSBUcmFuc2l0aW9uIHByb3RveXBlIHRvIGNvbXBhcmUgYWdhaW5zdCBuZXcgc2VxdWVuY2UgdHlwZXMgcGFzc2VkIGluIHRvIHRoZSBUcmFja2VyLlxyXG4gICAqL1xuXG5cdGZ1bmN0aW9uIFRyYWNrZXIoRG9tVXRpbHMsIFByZWZpeCwgQ3NzVXRpbHMsIFRyYW5zaXRpb24pIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhY2tlcik7XG5cblx0XHR0aGlzLnRyYWNrZXIgPSBuZXcgTWFwKCk7XG5cdFx0dGhpcy50cmFja2VyLnNldChcIlRyYW5zaXRpb25zXCIsIG5ldyBNYXAoKSk7XG5cdFx0dGhpcy50cmFja2VyLnNldChcIkFuaW1hdGlvbnNcIiwgbmV3IE1hcCgpKTtcblx0XHR0aGlzLmRvbVV0aWxzID0gbmV3IERvbVV0aWxzKCk7XG5cdFx0dGhpcy5wcmVmaXggPSBuZXcgUHJlZml4KCk7XG5cdFx0dGhpcy5jc3NVdGlscyA9IG5ldyBDc3NVdGlscygpO1xuXHRcdHRoaXMudHJhbnNpdGlvblByb3RvdHlwZSA9IFRyYW5zaXRpb24ucHJvdG90eXBlO1xuXHR9XG5cblx0X2NyZWF0ZUNsYXNzKFRyYWNrZXIsIFt7XG5cdFx0a2V5OiBcInRyYWNrXCIsXG5cblx0XHQvKipcclxuICAgICogQHRyYWNrIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBwYXJhbXMge09iamVjdCwgQ2xhc3N9XHJcbiAgICAqIEBkZXNjcmlwdGlvbiBTZWFyY2hlcyB0aGUgTWFwIGZvciB0aGUgZWxlbWVudCBwYXNzZWQgaW4gYW5kIGVpdGhlciB1cGRhdGVzIGl0IGlmIGZvdW5kIG9yIGNyZWF0ZXMgYSBuZXcgZW50cnkgaW4gdGhlIE1hcCBmb3IgaXQuXHJcbiAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICogIC0gb3B0aW9uczoge09iamVjdH0gVGhlIHNlcXVlbmNlIG9wdGlvbnMuXHJcbiAgICAgICAtIFNlcXVlbmNlIDoge0NsYXNzfSBFaXRoZXIgYSBUcmFuc2l0aW9uIG9yIEFuaW1hdGlvbiBjbGFzcy5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKi9cblxuXHRcdHZhbHVlOiBmdW5jdGlvbiB0cmFjayhvcHRpb25zLCBTZXF1ZW5jZSkge1xuXG5cdFx0XHR2YXIgdHJhbnNpdGlvbiA9IHRoaXMudHJhY2tlci5nZXQoXCJUcmFuc2l0aW9uc1wiKS5nZXQob3B0aW9ucy5lbGVtZW50KTtcblx0XHRcdHZhciBhbmltYXRpb24gPSB0aGlzLnRyYWNrZXIuZ2V0KFwiQW5pbWF0aW9uc1wiKS5nZXQob3B0aW9ucy5lbGVtZW50KTtcblxuXHRcdFx0aWYgKFNlcXVlbmNlLnByb3RvdHlwZSA9PT0gdGhpcy50cmFuc2l0aW9uUHJvdG90eXBlKSB7XG5cdFx0XHRcdGlmICghdHJhbnNpdGlvbikge1xuXHRcdFx0XHRcdHRoaXMudHJhY2tUcmFuc2l0aW9uKG9wdGlvbnMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMudXBkYXRlVHJhbnNpdGlvblJlY29yZCh0cmFuc2l0aW9uLCBvcHRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHQvLyBBIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCB3aWxsIHN1ZmZpY2UgaWYgdGhlIHNlcXVlbmNlIHR5cGUgaXMgYW4gQW5pbWF0aW9uLlxuXHRcdFx0XHQvLyBDU1MgQW5pbWF0aW9ucyBjYW4gYmUgcGF1c2VkIGFuZCBwbGF5ZWQgZWFzaWx5IHVubGlrZSB0cmFuc2l0aW9ucyB3aGljaCBhcmUgYSBiaXQgdHJpY2tpZXIuXG5cdFx0XHRcdGlmICghYW5pbWF0aW9uKSB7XG5cdFx0XHRcdFx0dGhpcy50cmFja0FuaW1hdGlvbihvcHRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogXCJ0cmFja1RyYW5zaXRpb25cIixcblxuXHRcdC8qKlxyXG4gICAgKiBAdHJhY2tUcmFuc2l0aW9uIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBwYXJhbXMge09iamVjdH1cclxuICAgICogQGRlc2NyaXB0aW9uIFN0b3JlcyB0aGUgZWxlbWVudCB1bmRlciB0aGUgVHJhbnNpdGlvbnMga2V5IGluIHRoZSBUcmFja2VyIE1hcCBcclxuICAgICogXHRcdGFuZCB0aGUgdHJhbnNpdGlvbmVkIHByb3BlcnRpZXMgLyB2YWx1ZXMgc2V0IGFnYWluc3QgdGhlIGVsZW1lbnQuXHJcbiAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICogIC0gb3B0aW9uczoge09iamVjdH0gVGhlIHRyYW5zaXRpb24gc2VxdWVuY2Ugb3B0aW9ucy5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKi9cblxuXHRcdHZhbHVlOiBmdW5jdGlvbiB0cmFja1RyYW5zaXRpb24ob3B0aW9ucykge1xuXG5cdFx0XHR2YXIgZGF0YSA9IHt9LFxuXHRcdFx0ICAgIHRyYW5zaXRpb25TdHlsZXMgPSB7fTtcblx0XHRcdHZhciB0cmFuc2l0aW9ucyA9IHRoaXMudHJhY2tlci5nZXQoXCJUcmFuc2l0aW9uc1wiKTtcblx0XHRcdHZhciB0cCA9IEFuaW1hdG9yLmdldFByZWZpeChcInRyYW5zaXRpb24tcHJvcGVydHlcIiksXG5cdFx0XHQgICAgdGR1ciA9IEFuaW1hdG9yLmdldFByZWZpeChcInRyYW5zaXRpb24tZHVyYXRpb25cIiksXG5cdFx0XHQgICAgdHRmID0gQW5pbWF0b3IuZ2V0UHJlZml4KFwidHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb25cIiksXG5cdFx0XHQgICAgdGRlbCA9IEFuaW1hdG9yLmdldFByZWZpeChcInRyYW5zaXRpb24tZGVsYXlcIik7XG5cblx0XHRcdHRyYW5zaXRpb25TdHlsZXNbdHBdID0gdGhpcy5jc3NVdGlscy5nZXRTdHlsZXMob3B0aW9ucy5lbGVtZW50LCB0cClbdHBdO1xuXHRcdFx0dHJhbnNpdGlvblN0eWxlc1t0ZHVyXSA9IHRoaXMuY3NzVXRpbHMuZ2V0U3R5bGVzKG9wdGlvbnMuZWxlbWVudCwgdGR1cilbdGR1cl07XG5cdFx0XHR0cmFuc2l0aW9uU3R5bGVzW3R0Zl0gPSB0aGlzLmNzc1V0aWxzLmdldFN0eWxlcyhvcHRpb25zLmVsZW1lbnQsIHR0ZilbdHRmXTtcblx0XHRcdHRyYW5zaXRpb25TdHlsZXNbdGRlbF0gPSB0aGlzLmNzc1V0aWxzLmdldFN0eWxlcyhvcHRpb25zLmVsZW1lbnQsIHRkZWwpW3RkZWxdO1xuXHRcdFx0ZGF0YS50cmFuc2l0aW9uU3R5bGVzID0gdHJhbnNpdGlvblN0eWxlcztcblxuXHRcdFx0aWYgKG9wdGlvbnMuc2V0U3R5bGVzICYmIG9wdGlvbnMuc2V0U3R5bGVzLmJlZm9yZSkge1xuXHRcdFx0XHRkYXRhLnN0eWxlcyA9IG9wdGlvbnMuc2V0U3R5bGVzLmJlZm9yZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdGlvbnMuYWRkQ2xhc3MgJiYgb3B0aW9ucy5hZGRDbGFzcy5iZWZvcmUgfHwgb3B0aW9ucy5yZW1vdmVDbGFzcyAmJiBvcHRpb25zLnJlbW92ZUNsYXNzLmJlZm9yZSkge1xuXHRcdFx0XHRkYXRhLmNsYXNzVHJpZ2dlcmVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0ZGF0YS5wcm9wZXJ0aWVzID0gQXJyYXkuaXNBcnJheShvcHRpb25zLnByb3BlcnRpZXMpID8gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShvcHRpb25zLnByb3BlcnRpZXMpKSA6IFtvcHRpb25zLnByb3BlcnRpZXNdO1xuXHRcdFx0dHJhbnNpdGlvbnMuc2V0KG9wdGlvbnMuZWxlbWVudCwgZGF0YSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiBcInRyYWNrQW5pbWF0aW9uXCIsXG5cblx0XHQvKipcclxuICAgICogQHRyYWNrQW5pbWF0aW9uIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBwYXJhbXMge09iamVjdH1cclxuICAgICogQGRlc2NyaXB0aW9uIFN0b3JlcyBhbiBlbGVtZW50IHVuZGVyIHRoZSBBbmltYXRpb25zIGtleSBpbiB0aGUgVHJhY2tlciBNYXAuXHJcbiAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICogIC0gb3B0aW9uczoge09iamVjdH0gVGhlIGFuaW1hdGlvbiBzZXF1ZW5jZSBvcHRpb25zLlxyXG4gICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAqL1xuXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHRyYWNrQW5pbWF0aW9uKG9wdGlvbnMpIHtcblxuXHRcdFx0dmFyIGRhdGEgPSB7fTtcblx0XHRcdHZhciBhbmltYXRpb25zID0gdGhpcy50cmFja2VyLmdldChcIkFuaW1hdGlvbnNcIik7XG5cdFx0XHRhbmltYXRpb25zLnNldChvcHRpb25zLmVsZW1lbnQsIGRhdGEpO1xuXHRcdH1cblx0fSwge1xuXHRcdGtleTogXCJ1cGRhdGVUcmFuc2l0aW9uUmVjb3JkXCIsXG5cblx0XHQvKipcclxuICAgICogQHVwZGF0ZVRyYW5zaXRpb25SZWNvcmQgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQHBhcmFtcyB7T2JqZWN0LCBPYmplY3R9XHJcbiAgICAqIEBkZXNjcmlwdGlvbiBJbnNlcnRzIGFkZGl0aW9uYWwgdHJhbnNpdGlvbmVkIHByb3BlcnRpZXMgLyBzdHlsZSBydWxlcyBzZXQgaW50byBhbiBlbGVtZW50J3MgcmVjb3JkLlxyXG4gICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAqICAtIHJlY29yZDoge09iamVjdH0gVGhlIHRyYW5zaXRpb24gcmVjb3JkIGZyb20gdGhlIFRyYWNrZXIgTWFwLlxyXG4gICAgKiAgLSBvcHRpb25zOiB7T2JqZWN0fSBUaGUgdHJhbnNpdGlvbiBzZXF1ZW5jZSBvcHRpb25zLlxyXG4gICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAqL1xuXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVRyYW5zaXRpb25SZWNvcmQocmVjb3JkLCBvcHRpb25zKSB7XG5cblx0XHRcdHZhciBwcm9wZXJ0aWVzID0gQXJyYXkuaXNBcnJheShvcHRpb25zLnByb3BlcnRpZXMpID8gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShvcHRpb25zLnByb3BlcnRpZXMpKSA6IFtvcHRpb25zLnByb3BlcnRpZXNdO1xuXHRcdFx0cHJvcGVydGllcyA9IHByb3BlcnRpZXMuZmlsdGVyKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRyZXR1cm4gcmVjb3JkLnByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSkgPT09IC0xO1xuXHRcdFx0fSk7XG5cdFx0XHRyZWNvcmQucHJvcGVydGllcyA9IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkocmVjb3JkLnByb3BlcnRpZXMpLCBfdG9Db25zdW1hYmxlQXJyYXkocHJvcGVydGllcykpO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5zZXRTdHlsZXMgJiYgb3B0aW9ucy5zZXRTdHlsZXMuYmVmb3JlKSB7XG5cdFx0XHRcdGlmICghcmVjb3JkLnN0eWxlcykge1xuXHRcdFx0XHRcdHJlY29yZC5zdHlsZXMgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRPYmplY3Qua2V5cyhvcHRpb25zLnNldFN0eWxlcy5iZWZvcmUpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG5cdFx0XHRcdFx0cmVjb3JkLnN0eWxlc1twcm9wZXJ0eV0gPSBvcHRpb25zLnNldFN0eWxlcy5iZWZvcmVbcHJvcGVydHldO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6IFwicGF1c2VcIixcblxuXHRcdC8qKlxyXG4gICAgKiBAcGF1c2UgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQGRlc2NyaXB0aW9uIEl0ZXJhdGVzIHRocm91Z2ggZXZlcnkgc3RvcmVkIGVsZW1lbnQgaW4gdGhlIFRyYWNrZXIgYW5kIHNldHMgaXRzIENTUyBhcHByb3ByaWF0ZWx5IHRvIGVmZmVjdGl2ZWx5IHBhdXNlIGEgc2VxdWVuY2UuXHJcbiAgICAqIEBnbG9iYWwgbm9cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gcGF1c2UoKSB7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0XHR2YXIgdHJhbnNpdGlvbnMgPSB0aGlzLnRyYWNrZXIuZ2V0KFwiVHJhbnNpdGlvbnNcIik7XG5cdFx0XHR2YXIgdHJhbnNpdGlvbkVsZW1lbnRzID0gdHJhbnNpdGlvbnMua2V5cygpO1xuXHRcdFx0dmFyIGFuaW1hdGlvbnMgPSB0aGlzLnRyYWNrZXIuZ2V0KFwiQW5pbWF0aW9uc1wiKTtcblx0XHRcdHZhciBhbmltYXRpb25FbGVtZW50cyA9IGFuaW1hdGlvbnMua2V5cygpO1xuXG5cdFx0XHR3aGlsZSAodHJ1ZSkge1xuXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gYW5pbWF0aW9uRWxlbWVudHMubmV4dCgpLFxuXHRcdFx0XHQgICAgcnVsZSA9IHt9O1xuXHRcdFx0XHRpZiAoZWxlbWVudC5kb25lKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRydWxlW3RoaXMucHJlZml4LmdldFByZWZpeChcImFuaW1hdGlvbi1wbGF5LXN0YXRlXCIpXSA9IFwicGF1c2VkXCI7XG5cdFx0XHRcdHRoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKGVsZW1lbnQudmFsdWUsIHJ1bGUpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgX2xvb3AgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0dmFyIGVsZW1lbnQgPSB0cmFuc2l0aW9uRWxlbWVudHMubmV4dCgpLFxuXHRcdFx0XHQgICAgcmVjb3JkID0gdW5kZWZpbmVkLFxuXHRcdFx0XHQgICAgcnVsZSA9IHt9O1xuXHRcdFx0XHRpZiAoZWxlbWVudC5kb25lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwiYnJlYWtcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlY29yZCA9IHRyYW5zaXRpb25zLmdldChlbGVtZW50LnZhbHVlKTtcblx0XHRcdFx0cmVjb3JkLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcblx0XHRcdFx0XHR2YXIgcnVsZSA9IF90aGlzLmNzc1V0aWxzLmdldFN0eWxlcyhlbGVtZW50LnZhbHVlLCBwcm9wZXJ0eSk7XG5cdFx0XHRcdFx0X3RoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKGVsZW1lbnQudmFsdWUsIHJ1bGUpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRydWxlID0ge307XG5cdFx0XHRcdHJ1bGVbX3RoaXMucHJlZml4LmdldFByZWZpeChcInRyYW5zaXRpb25cIildID0gXCJub25lXCI7XG5cdFx0XHRcdF90aGlzLmNzc1V0aWxzLnNldFN0eWxlcyhlbGVtZW50LnZhbHVlLCBydWxlKTtcblx0XHRcdH07XG5cblx0XHRcdHdoaWxlICh0cnVlKSB7XG5cdFx0XHRcdHZhciBfcmV0ID0gX2xvb3AoKTtcblxuXHRcdFx0XHRpZiAoX3JldCA9PT0gXCJicmVha1wiKSBicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6IFwicGxheVwiLFxuXG5cdFx0LyoqXHJcbiAgICAqIEBwbGF5IGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBkZXNjcmlwdGlvbiBJdGVyYXRlcyB0aHJvdWdoIGV2ZXJ5IHN0b3JlZCBlbGVtZW50IGluIHRoZSBUcmFja2VyIGFuZCBzZXRzIENTUyBzdHlsZSBydWxlcyB0byBjb250aW51ZSBhIHBhdXNlZCBzZXF1ZW5jZS5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKi9cblxuXHRcdHZhbHVlOiBmdW5jdGlvbiBwbGF5KCkge1xuXHRcdFx0dmFyIF90aGlzMiA9IHRoaXM7XG5cblx0XHRcdHZhciB0cmFuc2l0aW9ucyA9IHRoaXMudHJhY2tlci5nZXQoXCJUcmFuc2l0aW9uc1wiKTtcblx0XHRcdHZhciB0cmFuc2l0aW9uRWxlbWVudHMgPSB0cmFuc2l0aW9ucy5rZXlzKCk7XG5cdFx0XHR2YXIgYW5pbWF0aW9ucyA9IHRoaXMudHJhY2tlci5nZXQoXCJBbmltYXRpb25zXCIpO1xuXHRcdFx0dmFyIGFuaW1hdGlvbkVsZW1lbnRzID0gYW5pbWF0aW9ucy5rZXlzKCk7XG5cblx0XHRcdHdoaWxlICh0cnVlKSB7XG5cblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBhbmltYXRpb25FbGVtZW50cy5uZXh0KCksXG5cdFx0XHRcdCAgICBydWxlID0ge307XG5cdFx0XHRcdGlmIChlbGVtZW50LmRvbmUpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJ1bGVbdGhpcy5wcmVmaXguZ2V0UHJlZml4KFwiYW5pbWF0aW9uLXBsYXktc3RhdGVcIildID0gXCJydW5uaW5nXCI7XG5cdFx0XHRcdHRoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKGVsZW1lbnQudmFsdWUsIHJ1bGUpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgX2xvb3AyID0gZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdHZhciBlbGVtZW50ID0gdHJhbnNpdGlvbkVsZW1lbnRzLm5leHQoKTtcblx0XHRcdFx0aWYgKGVsZW1lbnQuZG9uZSkge1xuXHRcdFx0XHRcdHJldHVybiBcImJyZWFrXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgcmVjb3JkID0gdHJhbnNpdGlvbnMuZ2V0KGVsZW1lbnQudmFsdWUpO1xuXHRcdFx0XHRfdGhpczIuY3NzVXRpbHMuc2V0U3R5bGVzKGVsZW1lbnQudmFsdWUsIHJlY29yZC50cmFuc2l0aW9uU3R5bGVzKTtcblx0XHRcdFx0aWYgKHJlY29yZC5jbGFzc1RyaWdnZXJlZCkge1xuXHRcdFx0XHRcdHJlY29yZC5wcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3ApIHtcblx0XHRcdFx0XHRcdGVsZW1lbnQudmFsdWUuc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocmVjb3JkLnN0eWxlcykge1xuXHRcdFx0XHRcdF90aGlzMi5jc3NVdGlscy5zZXRTdHlsZXMoZWxlbWVudC52YWx1ZSwgcmVjb3JkLnN0eWxlcyk7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdHdoaWxlICh0cnVlKSB7XG5cdFx0XHRcdHZhciBfcmV0MiA9IF9sb29wMigpO1xuXG5cdFx0XHRcdGlmIChfcmV0MiA9PT0gXCJicmVha1wiKSBicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6IFwicmVtb3ZlXCIsXG5cblx0XHQvKipcclxuICAgICogQHJlbW92ZSBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAcGFyYW1zIHtTdHJpbmcsIEhUTUxFbGVtZW50fVxyXG4gICAgKiBAZGVzY3JpcHRpb24gUmVtb3ZlcyBhIHN0b3JlZCBlbGVtZW50IGZyb20gdGhlIFRyYWNrZXIgb25jZSBhIHNlcXVlbmNlIGlzIGNvbXBsZXRlLlxyXG4gICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAqICAtIHR5cGU6IHtTdHJpbmd9IFRyYWNrZXIgbWFwIGtleSwgZWl0aGVyIFRyYW5zaXRpb25zIG9yIEFuaW1hdGlvbnMuXHJcbiAgICAqICAtIGVsZW1lbnQ6IHtIVE1MRWxlbWVudH0gVGhlIGVsZW1lbnQgdG8gcmVtb3ZlIGZyb20gdGhlIFRyYWNrZXIuXHJcbiAgICAqIEBnbG9iYWwgbm9cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gcmVtb3ZlKHR5cGUsIGVsZW1lbnQpIHtcblx0XHRcdHRoaXMudHJhY2tlci5nZXQodHlwZSlbXCJkZWxldGVcIl0oZWxlbWVudCk7XG5cdFx0fVxuXHR9XSk7XG5cblx0cmV0dXJuIFRyYWNrZXI7XG59KSgpO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFRyYWNrZXI7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxyXG4gICogQFRyYW5zaXRpb24gQ2xhc3NcclxuICAqXHJcbiAgKiBAZGVzY3JpcHRpb24gUHJvbWlzZSBiYXNlZCB0cmFuc2l0aW9uIGhhbmRsZXIgdGhhdCByZXNvbHZlcyB3aGVuIGFsbCB0cmFuc2l0aW9ucyBvbiBhbiBlbGVtZW50IGFyZSBjb21wbGV0ZS5cclxuICAqIEByZXR1cm5zIHtSZXNvbHZlZCBQcm9taXNlfVxyXG4gICovXG5cbnZhciBUcmFuc2l0aW9uID0gKGZ1bmN0aW9uICgpIHtcblxuXHQvKipcclxuICAgKiBAY29uc3RydWN0b3IgZnVuY3Rpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbXMge09iamVjdCwgQ2xhc3MsIENsYXNzLCBDbGFzcywgQ2xhc3MsIE9iamVjdH0gIFxyXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgbmV3IHRyYW5zaXRpb24gc2VxdWVuY2UuICAgIFxyXG4gKiBAcGFyYW1zIGRlc2NyaXB0aW9uXHJcbiAtIG9wdGlvbnMge09iamVjdH0gVHJhbnNpdGlvbiBvcHRpb25zLlxyXG4gXHQtIGVsZW1lbnQge0hUTUxFbGVtZW50fSBUaGUgZWxlbWVudCB0byBzZXQgdGhlIHRyYW5zaXRpb24gb24uXHJcbiBcdC0gcHJvcGVydGllcyB7U3RyaW5nIC8gQXJyYXl9IEEgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3Mgb2YgQ1NTIHByb3BlcnRpZXMgdGhhdCBhcmUgYmVpbmcgdHJhbnNpdGlvbmVkLlxyXG4gXHQtIHNldFN0eWxlcyB7T2JqZWN0fSBTdHlsZXMgdG8gYmUgc2V0IGJlZm9yZSAvIGFmdGVyIHRoZSB0cmFuc2l0aW9uLlxyXG4gXHRcdC0gYmVmb3JlIHtPYmplY3R9IE9iamVjdCBvZiBDU1MgcHJvcGVydHkgLyB2YWx1ZSBwYWlycyB0byBiZSBzZXQgYmVmb3JlIHRoZSB0cmFuc2l0aW9uLlxyXG4gXHRcdC0gYWZ0ZXIge09iamVjdH0gT2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzIHRvIGJlIHNldCBhZnRlciB0aGUgdHJhbnNpdGlvbi5cclxuIFx0LSBhZGRDbGFzcyB7T2JqZWN0fSBPYmplY3Qgb2YgY2xhc3NuYW1lcyB0byBiZSBzZXQgYmVmb3JlIC8gYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXHJcbiBcdFx0LSBiZWZvcmUge1N0cmluZ30gQ2xhc3NuYW1lIHRvIHNldCBiZWZvcmUgdGhlIHRyYW5zaXRpb24uXHJcbiBcdFx0LSBhZnRlciB7U3RyaW5nfSBDbGFzc25hbWUgdG8gc2V0IGFmdGVyIHRoZSB0cmFuc2l0aW9uLlxyXG4gXHQtIHJlbW92ZUNsYXNzIHtPYmplY3R9IE9iamVjdCBvZiBjbGFzc25hbWVzIHRvIGJlIHJlbW92ZWQgYmVmb3JlIC8gYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXHJcbiBcdFx0LSBiZWZvcmUge1N0cmluZ30gQ2xhc3NuYW1lIHRvIGJlIHJlbW92ZWQgYmVmb3JlIHRoZSB0cmFuc2l0aW9uLlxyXG4gXHRcdC0gYWZ0ZXIge1N0cmluZ30gQ2xhc3NuYW1lIHRvIGJlIHJlbW92ZWQgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXHJcbiAtIERvbVV0aWxzIHtDbGFzc30gRG9tIHV0aWxpdHkgY2xhc3MuXHJcbiAtIFByZWZpeCB7Q2xhc3N9IFByZWZpeCBjbGFzcy5cclxuIC0gQ3NzVXRpbHMge0NsYXNzfSBDU1MgVXRpbGl0aWVzIGNsYXNzLlxyXG4gLSBUcmFja2VyIHtPYmplY3R9IE9iamVjdCB0aGF0IHRyYWNrcyBhbmQgbW9uaXRvcnMgc2VxdWVuY2VzLlxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cblxuXHRmdW5jdGlvbiBUcmFuc2l0aW9uKG9wdGlvbnMsIERvbVV0aWxzLCBQcmVmaXgsIENzc1V0aWxzLCBUcmFja2VyKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc2l0aW9uKTtcblxuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5kb21VdGlscyA9IG5ldyBEb21VdGlscygpO1xuXHRcdHRoaXMucHJlZml4ID0gbmV3IFByZWZpeCgpLmdldFByZWZpeChcInRyYW5zaXRpb25lbmRcIik7XG5cdFx0dGhpcy5jc3NVdGlscyA9IG5ldyBDc3NVdGlscygpO1xuXHRcdHRoaXMub25UcmFuc2l0aW9uRW5kID0gdGhpcy50cmFuc2l0aW9uRW5kLmJpbmQodGhpcyk7XG5cdFx0dGhpcy50b3RhbHRyYW5zaXRpb25zID0gQXJyYXkuaXNBcnJheShvcHRpb25zLnByb3BlcnRpZXMpID8gb3B0aW9ucy5wcm9wZXJ0aWVzLmxlbmd0aCA6IDE7XG5cdFx0dGhpcy50cmFuc2l0aW9uZW5kQ291bnQgPSAwO1xuXHRcdHRoaXMudHJhY2tlciA9IFRyYWNrZXI7XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0X3RoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0XHRfdGhpcy5yZWplY3QgPSByZWplY3Q7XG5cdFx0XHRfdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShfdGhpcy50cmFuc2l0aW9uU3RhcnQuYmluZChfdGhpcykpO1xuXHRcdH0pO1xuXHR9XG5cblx0X2NyZWF0ZUNsYXNzKFRyYW5zaXRpb24sIFt7XG5cdFx0a2V5OiBcInRyYW5zaXRpb25TdGFydFwiLFxuXG5cdFx0LyoqXHJcbiAgICAqIEB0cmFuc2l0aW9uU3RhcnQgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQGRlc2NyaXB0aW9uIFNldHMgY2xhc3NuYW1lcyAvIHN0eWxlIHJ1bGVzIHRvIHRyaWdnZXIgdGhlIHRyYW5zaXRpb24uXHJcbiAgICAqIEBnbG9iYWwgbm9cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gdHJhbnNpdGlvblN0YXJ0KCkge1xuXG5cdFx0XHR2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcblx0XHRcdG9wdHMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMucHJlZml4LCB0aGlzLm9uVHJhbnNpdGlvbkVuZCwgZmFsc2UpO1xuXG5cdFx0XHRpZiAob3B0cy5zZXRTdHlsZXMgJiYgb3B0cy5zZXRTdHlsZXMuYmVmb3JlKSB7XG5cdFx0XHRcdHRoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKG9wdHMuZWxlbWVudCwgb3B0cy5zZXRTdHlsZXMuYmVmb3JlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdHMucmVtb3ZlQ2xhc3MgJiYgb3B0cy5yZW1vdmVDbGFzcy5iZWZvcmUpIHtcblx0XHRcdFx0dGhpcy5kb21VdGlscy5zZXRDbGFzcyhvcHRzLmVsZW1lbnQsIG9wdHMucmVtb3ZlQ2xhc3MuYmVmb3JlLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRzLmFkZENsYXNzICYmIG9wdHMuYWRkQ2xhc3MuYmVmb3JlKSB7XG5cdFx0XHRcdHRoaXMuZG9tVXRpbHMuc2V0Q2xhc3Mob3B0cy5lbGVtZW50LCBvcHRzLmFkZENsYXNzLmJlZm9yZSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiBcInRyYW5zaXRpb25FbmRcIixcblxuXHRcdC8qKlxyXG4gICAgKiBAdHJhbnNpdGlvbkVuZCBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAZGVzY3JpcHRpb24gU2V0cyBjbGFzc25hbWVzIC8gc3R5bGUgcnVsZXMgYWZ0ZXIgYWxsIHRyYW5zaXRpb25zIGhhdmUgb2NjdXJyZWQgYW5kIHJlbW92ZXMgdGhlIGVsZW1lbnQgZnJvbSB0aGUgdHJhY2tlci5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKiBAcmV0dXJucyB7UmVzb2x2ZWQgUHJvbWlzZX1cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gdHJhbnNpdGlvbkVuZChldnQpIHtcblxuXHRcdFx0ZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHR2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcblx0XHRcdHRoaXMudHJhbnNpdGlvbmVuZENvdW50Kys7XG5cblx0XHRcdGlmICh0aGlzLnRyYW5zaXRpb25lbmRDb3VudCA9PT0gdGhpcy50b3RhbHRyYW5zaXRpb25zKSB7XG5cblx0XHRcdFx0b3B0cy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5wcmVmaXgsIHRoaXMub25UcmFuc2l0aW9uRW5kLCBmYWxzZSk7XG5cdFx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuXG5cdFx0XHRcdGlmIChvcHRzLnNldFN0eWxlcyAmJiBvcHRzLnNldFN0eWxlcy5hZnRlcikge1xuXHRcdFx0XHRcdHRoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKG9wdHMuZWxlbWVudCwgb3B0cy5zZXRTdHlsZXMuYWZ0ZXIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG9wdHMucmVtb3ZlQ2xhc3MgJiYgb3B0cy5yZW1vdmVDbGFzcy5hZnRlcikge1xuXHRcdFx0XHRcdHRoaXMuZG9tVXRpbHMuc2V0Q2xhc3Mob3B0cy5lbGVtZW50LCBvcHRzLnJlbW92ZUNsYXNzLmFmdGVyLCBmYWxzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3B0cy5hZGRDbGFzcyAmJiBvcHRzLmFkZENsYXNzLmFmdGVyKSB7XG5cdFx0XHRcdFx0dGhpcy5kb21VdGlscy5zZXRDbGFzcyhvcHRzLmVsZW1lbnQsIG9wdHMuYWRkQ2xhc3MuYWZ0ZXIsIHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy50cmFja2VyLnJlbW92ZShcIlRyYW5zaXRpb25zXCIsIG9wdHMuZWxlbWVudCk7XG5cdFx0XHRcdHRoaXMucmVzb2x2ZShvcHRzLmVsZW1lbnQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fV0pO1xuXG5cdHJldHVybiBUcmFuc2l0aW9uO1xufSkoKTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBUcmFuc2l0aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiXX0=
