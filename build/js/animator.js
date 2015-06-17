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
!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.returnExports=t()}(this,function(){"use strict";var e,t=Function.call.bind(Function.apply),r=Function.call.bind(Function.call),n=function(e){return function(){return!t(e,this,arguments)}},o=function(e){try{return e(),!1}catch(t){return!0}},i=function(e){try{return e()}catch(t){return!1}},a=n(o),u=function(){return!o(function(){Object.defineProperty({},"x",{})})},s=!!Object.defineProperty&&u(),c=Function.call.bind(Array.prototype.forEach),f=Function.call.bind(Array.prototype.reduce),p=(Function.call.bind(Array.prototype.filter),Function.call.bind(Array.prototype.every),function(e,t,r,n){!n&&t in e||(s?Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:!0,value:r}):e[t]=r)}),l=function(e,t){c(Object.keys(t),function(r){var n=t[r];p(e,r,n,!1)})},h=Object.create||function(e,t){var r=function(){};r.prototype=e;var n=new r;return"undefined"!=typeof t&&Object.keys(t).forEach(function(e){R.defineByDescriptor(n,e,t[e])}),n},y=function(e,t){return Object.setPrototypeOf?i(function(){var r=function n(t){var r=new e(t);return Object.setPrototypeOf(r,n.prototype),r};return Object.setPrototypeOf(r,e),r.prototype=h(e.prototype,{constructor:{value:r}}),t(r)}):!1},v=function(){return String.prototype.startsWith&&o(function(){"/a/".startsWith(/a/)})},d=function(){return String.prototype.startsWith&&"abc".startsWith("a",1/0)===!1}(),b=new Function("return this;"),w=b(),g=w.isFinite,m=(function(){return null===this}.call(null),v()&&d,Function.call.bind(String.prototype.indexOf),Function.call.bind(Object.prototype.toString)),S=(Function.call.bind(Array.prototype.concat),Function.call.bind(String.prototype.slice)),j=Function.call.bind(Array.prototype.push),T=(Function.apply.bind(Array.prototype.push),Function.call.bind(Array.prototype.shift)),I=(Math.max,Math.min,Math.floor),O=Math.abs,E=(Math.log,Math.sqrt,Function.call.bind(Object.prototype.hasOwnProperty)),M=function(){},_=w.Symbol||{},C=_.species||"@@species",k=function(){return this},x=function(e){s&&!E(e,C)&&R.getter(e,C,k)},P={object:function(e){return null!==e&&"object"==typeof e},string:function(e){return"[object String]"===m(e)},regex:function(e){return"[object RegExp]"===m(e)},symbol:function(e){return"function"==typeof w.Symbol&&"symbol"==typeof e}},F=Number.isNaN||function(e){return e!==e},A=Number.isFinite||function(e){return"number"==typeof e&&g(e)},R={getter:function(e,t,r){if(!s)throw new TypeError("getters require true ES5 support");Object.defineProperty(e,t,{configurable:!0,enumerable:!1,get:r})},proxy:function(e,t,r){if(!s)throw new TypeError("getters require true ES5 support");var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,{configurable:n.configurable,enumerable:n.enumerable,get:function(){return e[t]},set:function(r){e[t]=r}})},redefine:function(e,t,r){if(s){var n=Object.getOwnPropertyDescriptor(e,t);n.value=r,Object.defineProperty(e,t,n)}else e[t]=r},defineByDescriptor:function(e,t,r){s?Object.defineProperty(e,t,r):"value"in r&&(e[t]=r.value)},preserveToString:function(e,t){p(e,"toString",t.toString.bind(t),!0)}},z=function(e,t,r){var n=e[t];p(e,t,r,!0),R.preserveToString(e[t],n)},D=P.symbol(_.iterator)?_.iterator:"_es6-shim iterator_";w.Set&&"function"==typeof(new w.Set)["@@iterator"]&&(D="@@iterator");var N=function(e,t){var r=t||function(){return this},n={};n[D]=r,l(e,n),!e[D]&&P.symbol(D)&&(e[D]=r)},q=function(e){var t=m(e),r="[object Arguments]"===t;return r||(r="[object Array]"!==t&&null!==e&&"object"==typeof e&&"number"==typeof e.length&&e.length>=0&&"[object Function]"===m(e.callee)),r},B={Call:function(e,r){var n=arguments.length>2?arguments[2]:[];if(!B.IsCallable(e))throw new TypeError(e+" is not a function");return t(e,r,n)},RequireObjectCoercible:function(e,t){if(null==e)throw new TypeError(t||"Cannot call method on "+e)},TypeIsObject:function(e){return null!=e&&Object(e)===e},ToObject:function(e,t){return B.RequireObjectCoercible(e,t),Object(e)},IsCallable:function(e){return"function"==typeof e&&"[object Function]"===m(e)},IsConstructor:function(e){return B.IsCallable(e)},ToInt32:function(e){return B.ToNumber(e)>>0},ToUint32:function(e){return B.ToNumber(e)>>>0},ToNumber:function(e){if("[object Symbol]"===m(e))throw new TypeError("Cannot convert a Symbol value to a number");return+e},ToInteger:function(e){var t=B.ToNumber(e);return F(t)?0:0!==t&&A(t)?(t>0?1:-1)*I(O(t)):t},ToLength:function(e){var t=B.ToInteger(e);return 0>=t?0:t>Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:t},SameValue:function(e,t){return e===t?0===e?1/e===1/t:!0:F(e)&&F(t)},SameValueZero:function(e,t){return e===t||F(e)&&F(t)},IsIterable:function(e){return B.TypeIsObject(e)&&("undefined"!=typeof e[D]||q(e))},GetIterator:function(t){if(q(t))return new e(t,"value");var n=B.GetMethod(t,D);if(!B.IsCallable(n))throw new TypeError("value is not an iterable");var o=r(n,t);if(!B.TypeIsObject(o))throw new TypeError("bad iterator");return o},GetMethod:function(e,t){var r=B.ToObject(e)[t];if(void 0===r||null===r)return void 0;if(!B.IsCallable(r))throw new TypeError("Method not callable: "+t);return r},IteratorComplete:function(e){return!!e.done},IteratorClose:function(e,t){var n=B.GetMethod(e,"return");if(void 0!==n){var o,i;try{o=r(n,e)}catch(a){i=a}if(!t){if(i)throw i;if(!B.TypeIsObject(o))throw new TypeError("Iterator's return method returned a non-object.")}}},IteratorNext:function(e){var t=arguments.length>1?e.next(arguments[1]):e.next();if(!B.TypeIsObject(t))throw new TypeError("bad iterator");return t},IteratorStep:function(e){var t=B.IteratorNext(e),r=B.IteratorComplete(t);return r?!1:t},Construct:function(e,t,r,n){if(void 0===r&&(r=e),!n)return Reflect.construct(e,t,r);var o=r.prototype;B.TypeIsObject(o)||(o=Object.prototype);var i=h(o),a=B.Call(e,i,t);return B.TypeIsObject(a)?a:i},SpeciesConstructor:function(e,t){var r=e.constructor;if(void 0===r)return t;if(!B.TypeIsObject(r))throw new TypeError("Bad constructor");var n=r[C];if(void 0===n||null===n)return t;if(!B.IsConstructor(n))throw new TypeError("Bad @@species");return n},CreateHTML:function(e,t,r,n){var o=String(e),i="<"+t;if(""!==r){var a=String(n),u=a.replace(/"/g,"&quot;");i+=" "+r+'="'+u+'"'}var s=i+">",c=s+o;return c+"</"+t+">"}},G=function(e,t,r,n){if(!B.TypeIsObject(e))throw new TypeError("Constructor requires `new`: "+t.name);var o=t.prototype;B.TypeIsObject(o)||(o=r),e=h(o);for(var i in n)if(E(n,i)){var a=n[i];p(e,i,a,!0)}return e},V=function(){B.IsPromise=function(e){return B.TypeIsObject(e)?"undefined"==typeof e._promise?!1:!0:!1};var e,t=function(e){if(!B.IsConstructor(e))throw new TypeError("Bad promise constructor");var t=this,r=function(e,r){if(void 0!==t.resolve||void 0!==t.reject)throw new TypeError("Bad Promise implementation!");t.resolve=e,t.reject=r};if(t.promise=new e(r),!B.IsCallable(t.resolve)||!B.IsCallable(t.reject))throw new TypeError("Bad promise constructor")},n=w.setTimeout;"undefined"!=typeof window&&B.IsCallable(window.postMessage)&&(e=function(){var e=[],t="zero-timeout-message",r=function(r){j(e,r),window.postMessage(t,"*")},n=function(r){if(r.source===window&&r.data===t){if(r.stopPropagation(),0===e.length)return;var n=T(e);n()}};return window.addEventListener("message",n,!0),r});var o=function(){var e=w.Promise;return e&&e.resolve&&function(t){return e.resolve().then(t)}},i=B.IsCallable(w.setImmediate)?w.setImmediate.bind(w):"object"==typeof process&&process.nextTick?process.nextTick:o()||(B.IsCallable(e)?e():function(e){n(e,0)}),a=1,u=2,s=3,f=4,p=5,h=function(e,t){var r,n,o=e.capabilities,i=e.handler,s=!1;if(i===a)r=t;else if(i===u)r=t,s=!0;else try{r=i(t)}catch(c){r=c,s=!0}(n=s?o.reject:o.resolve)(r)},y=function(e,t){c(e,function(e){i(function(){h(e,t)})})},v=function(e,t){var r=e._promise,n=r.fulfillReactions;r.result=t,r.fulfillReactions=void 0,r.rejectReactions=void 0,r.state=f,y(n,t)},d=function(e,t){var r=e._promise,n=r.rejectReactions;r.result=t,r.fulfillReactions=void 0,r.rejectReactions=void 0,r.state=p,y(n,t)},b=function(e){var t=!1,r=function(r){var n;if(!t){if(t=!0,r===e)return d(e,new TypeError("Self resolution"));if(!B.TypeIsObject(r))return v(e,r);try{n=r.then}catch(o){return d(e,o)}return B.IsCallable(n)?void i(function(){g(e,r,n)}):v(e,r)}},n=function(r){return t?void 0:(t=!0,d(e,r))};return{resolve:r,reject:n}},g=function(e,t,n){var o=b(e),i=o.resolve,a=o.reject;try{r(n,t,i,a)}catch(u){a(u)}},m=function(e){if(!B.TypeIsObject(e))throw new TypeError("Promise is not object");var t=e[C];return void 0!==t&&null!==t?t:e},S=function _(e){if(!(this instanceof _))throw new TypeError('Constructor Promise requires "new"');if(this&&this._promise)throw new TypeError("Bad construction");if(!B.IsCallable(e))throw new TypeError("not a valid resolver");var t=G(this,_,I,{_promise:{result:void 0,state:s,fulfillReactions:[],rejectReactions:[]}}),r=b(t),n=r.reject;try{e(r.resolve,n)}catch(o){n(o)}return t},I=S.prototype,O=function(e,t,r,n){var o=!1;return function(i){if(!o&&(o=!0,t[e]=i,0===--n.count)){var a=r.resolve;a(t)}}},E=function(e,t,r){for(var n,o,i=e.iterator,a=[],u={count:1},s=0;;s++){try{if(n=B.IteratorStep(i),n===!1){e.done=!0;break}o=n.value}catch(c){throw e.done=!0,c}a[s]=void 0;var f=t.resolve(o),p=O(s,a,r,u);u.count++,f.then(p,r.reject)}if(0===--u.count){var l=r.resolve;l(a)}return r.promise},M=function(e,t,r){for(var n,o,i,a=e.iterator;;){try{if(n=B.IteratorStep(a),n===!1){e.done=!0;break}o=n.value}catch(u){throw e.done=!0,u}i=t.resolve(o),i.then(r.resolve,r.reject)}return r.promise};return l(S,{all:function(e){var r,n,o=m(this),i=new t(o);try{return r=B.GetIterator(e),n={iterator:r,done:!1},E(n,o,i)}catch(a){if(n&&!n.done)try{B.IteratorClose(r,!0)}catch(u){a=u}var s=i.reject;return s(a),i.promise}},race:function(e){var r,n,o=m(this),i=new t(o);try{return r=B.GetIterator(e),n={iterator:r,done:!1},M(n,o,i)}catch(a){if(n&&!n.done)try{B.IteratorClose(r,!0)}catch(u){a=u}var s=i.reject;return s(a),i.promise}},reject:function(e){var r=this,n=new t(r),o=n.reject;return o(e),n.promise},resolve:function(e){var r=this;if(B.IsPromise(e)){var n=e.constructor;if(n===r)return e}var o=new t(r),i=o.resolve;return i(e),o.promise}}),l(I,{"catch":function(e){return this.then(void 0,e)},then:function(e,r){var n=this;if(!B.IsPromise(n))throw new TypeError("not a promise");var o=B.SpeciesConstructor(n,S),c=new t(o);B.IsCallable(e)||(e=a),B.IsCallable(r)||(r=u);var l,y={capabilities:c,handler:e},v={capabilities:c,handler:r},d=n._promise;switch(d.state){case s:j(d.fulfillReactions,y),j(d.rejectReactions,v);break;case f:l=d.result,i(function(){h(y,l)});break;case p:l=d.result,i(function(){h(v,l)});break;default:throw new TypeError("unexpected")}return c.promise}}),S}();w.Promise&&(delete w.Promise.accept,delete w.Promise.defer,delete w.Promise.prototype.chain),l(w,{Promise:V});var Z=y(w.Promise,function(e){return e.resolve(42).then(function(){})instanceof e}),W=!o(function(){w.Promise.reject(42).then(null,5).then(null,M)}),L=o(function(){w.Promise.call(3,M)}),X=function(e){var t=e.resolve(5);t.constructor={};var r=e.resolve(t);return t===r}(w.Promise);Z&&W&&L&&!X||(Promise=V,z(w,"Promise",V)),x(Promise);var $=function(e){var t=Object.keys(f(e,function(e,t){return e[t]=!0,e},{}));return e.join(":")===t.join(":")},H=$(["z","a","bb"]),U=$(["z",1,"a","3",2]);if(s){var J=function(e){if(!H)return null;var t=typeof e;return"undefined"===t||null===e?"^"+String(e):"string"===t?"$"+e:"number"===t?U?e:"n"+e:"boolean"===t?"b"+e:null},K=function(){return Object.create?Object.create(null):{}},Q=function(e,t,n){if(Array.isArray(n)||P.string(n))c(n,function(e){t.set(e[0],e[1])});else if(n instanceof e)r(e.prototype.forEach,n,function(e,r){t.set(r,e)});else{var o,i;if(null!==n&&"undefined"!=typeof n){if(i=t.set,!B.IsCallable(i))throw new TypeError("bad map");o=B.GetIterator(n)}if("undefined"!=typeof o)for(;;){var a=B.IteratorStep(o);if(a===!1)break;var u=a.value;try{if(!B.TypeIsObject(u))throw new TypeError("expected iterable of pairs");r(i,t,u[0],u[1])}catch(s){throw B.IteratorClose(o,!0),s}}}},Y=function(e,t,n){if(Array.isArray(n)||P.string(n))c(n,function(e){t.add(e)});else if(n instanceof e)r(e.prototype.forEach,n,function(e){t.add(e)});else{var o,i;if(null!==n&&"undefined"!=typeof n){if(i=t.add,!B.IsCallable(i))throw new TypeError("bad set");o=B.GetIterator(n)}if("undefined"!=typeof o)for(;;){var a=B.IteratorStep(o);if(a===!1)break;var u=a.value;try{r(i,t,u)}catch(s){throw B.IteratorClose(o,!0),s}}}},ee={Map:function(){var e={},t=function(e,t){this.key=e,this.value=t,this.next=null,this.prev=null};t.prototype.isRemoved=function(){return this.key===e};var n=function(e){return!!e._es6map},o=function(e,t){if(!B.TypeIsObject(e)||!n(e))throw new TypeError("Method Map.prototype."+t+" called on incompatible receiver "+String(e))},i=function(e,t){o(e,"[[MapIterator]]"),this.head=e._head,this.i=this.head,this.kind=t};i.prototype={next:function(){var e,t=this.i,r=this.kind,n=this.head;if("undefined"==typeof this.i)return{value:void 0,done:!0};for(;t.isRemoved()&&t!==n;)t=t.prev;for(;t.next!==n;)if(t=t.next,!t.isRemoved())return e="key"===r?t.key:"value"===r?t.value:[t.key,t.value],this.i=t,{value:e,done:!1};return this.i=void 0,{value:void 0,done:!0}}},N(i.prototype);var a=function s(){if(!(this instanceof s))throw new TypeError('Constructor Map requires "new"');if(this&&this._es6map)throw new TypeError("Bad construction");var e=G(this,s,u,{_es6map:!0,_head:null,_storage:K(),_size:0}),r=new t(null,null);return r.next=r.prev=r,e._head=r,arguments.length>0&&Q(s,e,arguments[0]),e},u=a.prototype;return R.getter(u,"size",function(){if("undefined"==typeof this._size)throw new TypeError("size method called on incompatible Map");return this._size}),l(u,{get:function(e){o(this,"get");var t=J(e);if(null!==t){var r=this._storage[t];return r?r.value:void 0}for(var n=this._head,i=n;(i=i.next)!==n;)if(B.SameValueZero(i.key,e))return i.value},has:function(e){o(this,"has");var t=J(e);if(null!==t)return"undefined"!=typeof this._storage[t];for(var r=this._head,n=r;(n=n.next)!==r;)if(B.SameValueZero(n.key,e))return!0;return!1},set:function(e,r){o(this,"set");var n,i=this._head,a=i,u=J(e);if(null!==u){if("undefined"!=typeof this._storage[u])return this._storage[u].value=r,this;n=this._storage[u]=new t(e,r),a=i.prev}for(;(a=a.next)!==i;)if(B.SameValueZero(a.key,e))return a.value=r,this;return n=n||new t(e,r),B.SameValue(-0,e)&&(n.key=0),n.next=this._head,n.prev=this._head.prev,n.prev.next=n,n.next.prev=n,this._size+=1,this},"delete":function(t){o(this,"delete");var r=this._head,n=r,i=J(t);if(null!==i){if("undefined"==typeof this._storage[i])return!1;n=this._storage[i].prev,delete this._storage[i]}for(;(n=n.next)!==r;)if(B.SameValueZero(n.key,t))return n.key=n.value=e,n.prev.next=n.next,n.next.prev=n.prev,this._size-=1,!0;return!1},clear:function(){o(this,"clear"),this._size=0,this._storage=K();for(var t=this._head,r=t,n=r.next;(r=n)!==t;)r.key=r.value=e,n=r.next,r.next=r.prev=t;t.next=t.prev=t},keys:function(){return o(this,"keys"),new i(this,"key")},values:function(){return o(this,"values"),new i(this,"value")},entries:function(){return o(this,"entries"),new i(this,"key+value")},forEach:function(e){o(this,"forEach");for(var t=arguments.length>1?arguments[1]:null,n=this.entries(),i=n.next();!i.done;i=n.next())t?r(e,t,i.value[1],i.value[0],this):e(i.value[1],i.value[0],this)}}),N(u,u.entries),a}(),Set:function(){var e=function(e){return e._es6set&&"undefined"!=typeof e._storage},t=function(t,r){if(!B.TypeIsObject(t)||!e(t))throw new TypeError("Set.prototype."+r+" called on incompatible receiver "+String(t))},n=function a(){if(!(this instanceof a))throw new TypeError('Constructor Set requires "new"');if(this&&this._es6set)throw new TypeError("Bad construction");var e=G(this,a,o,{_es6set:!0,"[[SetData]]":null,_storage:K()});if(!e._es6set)throw new TypeError("bad set");return arguments.length>0&&Y(a,e,arguments[0]),e},o=n.prototype,i=function(e){if(!e["[[SetData]]"]){var t=e["[[SetData]]"]=new ee.Map;c(Object.keys(e._storage),function(e){if("^null"===e)e=null;else if("^undefined"===e)e=void 0;else{var r=e.charAt(0);e="$"===r?S(e,1):"n"===r?+S(e,1):"b"===r?"btrue"===e:+e}t.set(e,e)}),e._storage=null}};return R.getter(n.prototype,"size",function(){return t(this,"size"),i(this),this["[[SetData]]"].size}),l(n.prototype,{has:function(e){t(this,"has");var r;return this._storage&&null!==(r=J(e))?!!this._storage[r]:(i(this),this["[[SetData]]"].has(e))},add:function(e){t(this,"add");var r;return this._storage&&null!==(r=J(e))?(this._storage[r]=!0,this):(i(this),this["[[SetData]]"].set(e,e),this)},"delete":function(e){t(this,"delete");var r;if(this._storage&&null!==(r=J(e))){var n=E(this._storage,r);return delete this._storage[r]&&n}return i(this),this["[[SetData]]"]["delete"](e)},clear:function(){t(this,"clear"),this._storage?this._storage=K():this["[[SetData]]"].clear()},values:function(){return t(this,"values"),i(this),this["[[SetData]]"].values()},entries:function(){return t(this,"entries"),i(this),this["[[SetData]]"].entries()},forEach:function(e){t(this,"forEach");var n=arguments.length>1?arguments[1]:null,o=this;i(o),this["[[SetData]]"].forEach(function(t,i){n?r(e,n,i,i,o):e(i,i,o)})}}),p(n.prototype,"keys",n.prototype.values,!0),N(n.prototype,n.prototype.values),n}()};if(l(w,ee),w.Map||w.Set){var te=i(function(){return 2===new Map([[1,2]]).get(1)});if(!te){var re=w.Map;w.Map=function Ie(){if(!(this instanceof Ie))throw new TypeError('Constructor Map requires "new"');var e=new re;return arguments.length>0&&Q(Ie,e,arguments[0]),Object.setPrototypeOf(e,w.Map.prototype),p(e,"constructor",Ie,!0),e},w.Map.prototype=h(re.prototype),R.preserveToString(w.Map,re)}var ne=new Map,oe=function(e){return e["delete"](0),e["delete"](-0),e.set(0,3),e.get(-0,4),3===e.get(0)&&4===e.get(-0)}(ne),ie=ne.set(1,2)===ne;if(!oe||!ie){var ae=Map.prototype.set;z(Map.prototype,"set",function(e,t){return r(ae,this,0===e?0:e,t),this})}if(!oe){var ue=Map.prototype.get,se=Map.prototype.has;l(Map.prototype,{get:function(e){return r(ue,this,0===e?0:e)},has:function(e){return r(se,this,0===e?0:e)}},!0),R.preserveToString(Map.prototype.get,ue),R.preserveToString(Map.prototype.has,se)}var ce=new Set,fe=function(e){return e["delete"](0),e.add(-0),!e.has(0)}(ce),pe=ce.add(1)===ce;if(!fe||!pe){var le=Set.prototype.add;Set.prototype.add=function(e){return r(le,this,0===e?0:e),this},R.preserveToString(Set.prototype.add,le)}if(!fe){var he=Set.prototype.has;Set.prototype.has=function(e){return r(he,this,0===e?0:e)},R.preserveToString(Set.prototype.has,he);var ye=Set.prototype["delete"];Set.prototype["delete"]=function(e){return r(ye,this,0===e?0:e)},R.preserveToString(Set.prototype["delete"],ye)}var ve=y(w.Map,function(e){var t=new e([]);return t.set(42,42),t instanceof e}),de=Object.setPrototypeOf&&!ve,be=function(){try{return!(w.Map()instanceof w.Map)}catch(e){return e instanceof TypeError}}();if(0!==w.Map.length||de||!be){var we=w.Map;w.Map=function Oe(){if(!(this instanceof Oe))throw new TypeError('Constructor Map requires "new"');var e=new we;return arguments.length>0&&Q(Oe,e,arguments[0]),Object.setPrototypeOf(e,Oe.prototype),p(e,"constructor",Oe,!0),e},w.Map.prototype=we.prototype,R.preserveToString(w.Map,we)}var ge=y(w.Set,function(e){var t=new e([]);return t.add(42,42),t instanceof e}),me=Object.setPrototypeOf&&!ge,Se=function(){try{return!(w.Set()instanceof w.Set)}catch(e){return e instanceof TypeError}}();if(0!==w.Set.length||me||!Se){var je=w.Set;w.Set=function Ee(){if(!(this instanceof Ee))throw new TypeError('Constructor Set requires "new"');var e=new je;return arguments.length>0&&Y(Ee,e,arguments[0]),Object.setPrototypeOf(e,Ee.prototype),p(e,"constructor",Ee,!0),e},w.Set.prototype=je.prototype,R.preserveToString(w.Set,je)}var Te=!i(function(){return(new Map).keys().next().done});("function"!=typeof w.Map.prototype.clear||0!==(new w.Set).size||0!==(new w.Map).size||"function"!=typeof w.Map.prototype.keys||"function"!=typeof w.Set.prototype.keys||"function"!=typeof w.Map.prototype.forEach||"function"!=typeof w.Set.prototype.forEach||a(w.Map)||a(w.Set)||"function"!=typeof(new w.Map).keys().next||Te||!ve)&&(delete w.Map,delete w.Set,l(w,{Map:ee.Map,Set:ee.Set},!0))}w.Set.prototype.keys!==w.Set.prototype.values&&p(w.Set.prototype,"keys",w.Set.prototype.values,!0),N(Object.getPrototypeOf((new w.Map).keys())),N(Object.getPrototypeOf((new w.Set).keys()))}return x(Map),x(Set),w});
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

// import { Promise as Promise } from "./es6-promise";

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
      return new _seqWrapper2["default"](options, _domUtils2["default"], _prefixes2["default"], _cssUtils2["default"], Promise, _transitionSeq2["default"], _comboSeq2["default"], this.tracker);
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
      return new _seqWrapper2["default"](options, _domUtils2["default"], _prefixes2["default"], _cssUtils2["default"], Promise, _animationSeq2["default"], _comboSeq2["default"], this.tracker);
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
      return new _comboSeq2["default"](animations, Promise);
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
  - Promise {Class} Promise class.
  - Tracker {Object} Object that tracks and monitors sequences.
  * @returns {Promise}
    */

		function Animation(options, DomUtils, Prefix, CssUtils, Promise, Tracker) {
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

				value: function animationEnd() {

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
 - Promise {Class} Promise class.
 * @returns {Promise}
   */

	function Combo(sequences, Promise) {
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
- Promise {Class} Promise class.
- Sequence {Class} The sequence type (Transition / Animation).
- Combo {Class} Wrapper for multiple sequences.
- Tracker {Object} Object to store and track sequences through.
* @returns {Promise}
  */

function SequenceWrapper(options, DomUtils, Prefix, CssUtils, Promise, Sequence, Combo, Tracker) {
	_classCallCheck(this, SequenceWrapper);

	if (options.element.length) {
		var transitions = Array.from(options.element).map(function (element) {
			var opts = {};
			Object.keys(options).forEach(function (key) {
				opts[key] = options[key];
			});
			opts.element = element;
			Tracker.track(opts, Sequence);
			return new Sequence(opts, DomUtils, Prefix, CssUtils, Promise, Tracker);
		});
		return new Combo(transitions, Promise);
	} else {
		Tracker.track(options, Sequence);
		return new Sequence(options, DomUtils, Prefix, CssUtils, Promise, Tracker);
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
 - Promise {Class} Promise class.
 - Tracker {Object} Object that tracks and monitors sequences.
 * @returns {Promise}
   */

	function Transition(options, DomUtils, Prefix, CssUtils, Promise, Tracker) {
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

		value: function transitionEnd() {

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9NaWtlX0NoYWR3aWNrL0RvY3VtZW50cy9HaXRIdWIvQW5pbWF0b3ItRVM2L2pzL3RlbXAvYW5pbWF0b3IuanMiLCJDOi9Vc2Vycy9NaWtlX0NoYWR3aWNrL0RvY3VtZW50cy9HaXRIdWIvQW5pbWF0b3ItRVM2L2pzL3RlbXAvYW5pbWF0aW9uLXNlcS5qcyIsIkM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC9jb21iby1zZXEuanMiLCJDOi9Vc2Vycy9NaWtlX0NoYWR3aWNrL0RvY3VtZW50cy9HaXRIdWIvQW5pbWF0b3ItRVM2L2pzL3RlbXAvY3NzLXV0aWxzLmpzIiwiQzovVXNlcnMvTWlrZV9DaGFkd2ljay9Eb2N1bWVudHMvR2l0SHViL0FuaW1hdG9yLUVTNi9qcy90ZW1wL2RvbS11dGlscy5qcyIsIkM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC9wcmVmaXhlcy5qcyIsIkM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC9zZXEtd3JhcHBlci5qcyIsIkM6L1VzZXJzL01pa2VfQ2hhZHdpY2svRG9jdW1lbnRzL0dpdEh1Yi9BbmltYXRvci1FUzYvanMvdGVtcC90cmFja2VyLmpzIiwiQzovVXNlcnMvTWlrZV9DaGFkd2ljay9Eb2N1bWVudHMvR2l0SHViL0FuaW1hdG9yLUVTNi9qcy90ZW1wL3RyYW5zaXRpb24tc2VxLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOztBQUViLElBQUksWUFBWSxHQUFHLENBQUMsWUFBWTtBQUFFLFdBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUFF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InNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxyXG4gICogQEFuaW1hdG9yIENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIEhvdXNlcyBhbGwgQW5pbWF0b3IgZnVuY3Rpb25hbGl0eVxyXG4gICogQHJldHVybnMge09iamVjdH1cclxuICAqL1xuXG52YXIgX3ByZWZpeGVzID0gcmVxdWlyZShcIi4vcHJlZml4ZXNcIik7XG5cbnZhciBfcHJlZml4ZXMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJlZml4ZXMpO1xuXG52YXIgX2Nzc1V0aWxzID0gcmVxdWlyZShcIi4vY3NzLXV0aWxzXCIpO1xuXG52YXIgX2Nzc1V0aWxzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Nzc1V0aWxzKTtcblxudmFyIF9kb21VdGlscyA9IHJlcXVpcmUoXCIuL2RvbS11dGlsc1wiKTtcblxudmFyIF9kb21VdGlsczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kb21VdGlscyk7XG5cbnZhciBfYW5pbWF0aW9uU2VxID0gcmVxdWlyZShcIi4vYW5pbWF0aW9uLXNlcVwiKTtcblxudmFyIF9hbmltYXRpb25TZXEyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYW5pbWF0aW9uU2VxKTtcblxudmFyIF90cmFuc2l0aW9uU2VxID0gcmVxdWlyZShcIi4vdHJhbnNpdGlvbi1zZXFcIik7XG5cbnZhciBfdHJhbnNpdGlvblNlcTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cmFuc2l0aW9uU2VxKTtcblxudmFyIF9jb21ib1NlcSA9IHJlcXVpcmUoXCIuL2NvbWJvLXNlcVwiKTtcblxudmFyIF9jb21ib1NlcTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jb21ib1NlcSk7XG5cbnZhciBfc2VxV3JhcHBlciA9IHJlcXVpcmUoXCIuL3NlcS13cmFwcGVyXCIpO1xuXG52YXIgX3NlcVdyYXBwZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2VxV3JhcHBlcik7XG5cbnZhciBfdHJhY2tlciA9IHJlcXVpcmUoXCIuL3RyYWNrZXJcIik7XG5cbnZhciBfdHJhY2tlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cmFja2VyKTtcblxuLy8gaW1wb3J0IHsgUHJvbWlzZSBhcyBQcm9taXNlIH0gZnJvbSBcIi4vZXM2LXByb21pc2VcIjtcblxudmFyIEFuaW1hdG9yID0gKGZ1bmN0aW9uICgpIHtcblxuICAvKipcclxuICAgICogQGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgc3R5bGVzaGVldCBhbmQgVHJhY2tlciBvYmplY3QgdG8gYmUgdXNlZCB0aHJvdWdob3V0IEFuaW1hdG9yLlxyXG4gICAgKi9cblxuICBmdW5jdGlvbiBBbmltYXRvcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQW5pbWF0b3IpO1xuXG4gICAgdGhpcy5zdHlsZXNoZWV0ID0gbmV3IF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdKCkuY3JlYXRlU3R5bGVTaGVldCgpO1xuICAgIHRoaXMudHJhY2tlciA9IG5ldyBfdHJhY2tlcjJbXCJkZWZhdWx0XCJdKF9kb21VdGlsczJbXCJkZWZhdWx0XCJdLCBfcHJlZml4ZXMyW1wiZGVmYXVsdFwiXSwgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0sIF90cmFuc2l0aW9uU2VxMltcImRlZmF1bHRcIl0pO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEFuaW1hdG9yLCBbe1xuICAgIGtleTogXCJnZXRQcmVmaXhcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBnZXRQcmVmaXggZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge1N0cmluZ31cclxuICAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIHByZWZpeGVkIENTUyBwcm9wZXJ0eSBvciBET00gZXZlbnQgbmFtZS5cclxuICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UHJlZml4KHByZWZpeCkge1xuICAgICAgcmV0dXJuIG5ldyBfcHJlZml4ZXMyW1wiZGVmYXVsdFwiXSgpLmdldFByZWZpeChwcmVmaXgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJzZXRTdHlsZXNcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBzZXRTdHlsZXMgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge0hUTUxFbGVtZW50LCBTdHJpbmcgLyBBcnJheX1cclxuICAgICAgKiBAZGVzY3JpcHRpb24gU2V0cyBwcm9wZXJ0aWVzIC8gdmFsdWVzIG9uIGFuIGVsZW1lbnQncyBDU1NTdHlsZURlY2xhcmF0aW9uLlxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFN0eWxlcyhlbGVtZW50LCBzdHlsZXMpIHtcbiAgICAgIHJldHVybiBuZXcgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0oKS5zZXRTdHlsZXMoZWxlbWVudCwgc3R5bGVzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0U3R5bGVzXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAZ2V0U3R5bGVzIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtIVE1MRWxlbWVudCwgT2JqZWN0fVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gYW4gb2JqZWN0IG9mIENTUyBwcm9wZXJ0aWVzIC8gdmFsdWVzLlxyXG4gICAgICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTdHlsZXMoZWxlbWVudCwgcHJvcGVydGllcykge1xuICAgICAgcmV0dXJuIG5ldyBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSgpLmdldFN0eWxlcyhlbGVtZW50LCBwcm9wZXJ0aWVzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlVHJhbnNpdGlvblwiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQGNyZWF0ZVRyYW5zaXRpb24gZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge09iamVjdH1cclxuICAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIENTUyB0cmFuc2l0aW9uIGRlZmluaXRpb24uXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlVHJhbnNpdGlvbih0cmFuc2l0aW9uKSB7XG4gICAgICBuZXcgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0oKS5jcmVhdGVUcmFuc2l0aW9uKHRyYW5zaXRpb24sIF9wcmVmaXhlczJbXCJkZWZhdWx0XCJdKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlQW5pbWF0aW9uXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAY3JlYXRlQW5pbWF0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtPYmplY3R9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBDU1Mga2V5ZnJhbWUgYW5pbWF0aW9uIGRlZmluaXRpb24uXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlQW5pbWF0aW9uKGFuaW1hdGlvbikge1xuICAgICAgbmV3IF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdKCkuY3JlYXRlS2V5ZnJhbWVBbmltYXRpb24oYW5pbWF0aW9uLCBfcHJlZml4ZXMyW1wiZGVmYXVsdFwiXSwgdGhpcy5zdHlsZXNoZWV0KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY3JlYXRlQ2xhc3NcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBjcmVhdGVDbGFzcyBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7U3RyaW5nLCBPYmplY3R9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBDU1MgY2xhc3MgYW5kIGFwcGVuZHMgaXQgdG8gdGhlIHN0eWxlc2hlZXQuXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY2xhc3NOYW1lLCBydWxlcykge1xuICAgICAgbmV3IF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdKCkuY3JlYXRlQ2xhc3MoY2xhc3NOYW1lLCB0aGlzLnN0eWxlc2hlZXQsIHJ1bGVzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGVsZXRlQ2xhc3NcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBkZWxldGVDbGFzcyBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7U3RyaW5nfVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBEZWxldGVzIGEgQ1NTIGNsYXNzIGZyb20gdGhlIHN0eWxlc2hlZXQuXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVsZXRlQ2xhc3MoY2xhc3NOYW1lKSB7XG4gICAgICBuZXcgX2Nzc1V0aWxzMltcImRlZmF1bHRcIl0oKS5kZWxldGVDbGFzcyhjbGFzc05hbWUsIHRoaXMuc3R5bGVzaGVldCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZUNTU1J1bGVcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBjcmVhdGVDU1NSdWxlIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtTdHJpbmcgLyBBcnJheSwgU3RyaW5nIC8gQXJyYXl9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgYSBDU1MgcHJvcGVydHkgLyB2YWx1ZSBwYWlycyBvYmplY3QuXHJcbiAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVDU1NSdWxlKHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG5ldyBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSgpLmNyZWF0ZUNTU1J1bGUocHJvcGVydHksIHZhbHVlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYWRkQ2xhc3NcIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBhZGRDbGFzcyBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7SFRNTEVsZW1lbnQgLyBOb2RlbGlzdCwgU3RyaW5nIC8gQXJyYXl9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFNldHMgYSBjbGFzcyhlcykgb24gYW4gZWxlbWVudC5cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBjbGFzc0xpc3QpIHtcbiAgICAgIG5ldyBfZG9tVXRpbHMyW1wiZGVmYXVsdFwiXSgpLnNldENsYXNzKGVsZW1lbnQsIGNsYXNzTGlzdCwgdHJ1ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInJlbW92ZUNsYXNzXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAcmVtb3ZlQ2xhc3MgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge0hUTUxFbGVtZW50IC8gTm9kZWxpc3QsIFN0cmluZyAvIEFycmF5fVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBSZW1vdmVzIGEgY2xhc3MoZXMpIGZyb20gYW4gZWxlbWVudC5cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc0xpc3QpIHtcbiAgICAgIG5ldyBfZG9tVXRpbHMyW1wiZGVmYXVsdFwiXSgpLnNldENsYXNzKGVsZW1lbnQsIGNsYXNzTGlzdCwgZmFsc2UpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0cmFuc2l0aW9uXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAdHJhbnNpdGlvbiBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7T2JqZWN0fVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgdHJhbnNpdGlvbiBzZXF1ZW5jZS5cclxuICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFuc2l0aW9uKG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgX3NlcVdyYXBwZXIyW1wiZGVmYXVsdFwiXShvcHRpb25zLCBfZG9tVXRpbHMyW1wiZGVmYXVsdFwiXSwgX3ByZWZpeGVzMltcImRlZmF1bHRcIl0sIF9jc3NVdGlsczJbXCJkZWZhdWx0XCJdLCBQcm9taXNlLCBfdHJhbnNpdGlvblNlcTJbXCJkZWZhdWx0XCJdLCBfY29tYm9TZXEyW1wiZGVmYXVsdFwiXSwgdGhpcy50cmFja2VyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYW5pbWF0aW9uXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAYW5pbWF0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtPYmplY3R9XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYW4gYW5pbWF0aW9uIHNlcXVlbmNlLlxyXG4gICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFuaW1hdGlvbihvcHRpb25zKSB7XG4gICAgICByZXR1cm4gbmV3IF9zZXFXcmFwcGVyMltcImRlZmF1bHRcIl0ob3B0aW9ucywgX2RvbVV0aWxzMltcImRlZmF1bHRcIl0sIF9wcmVmaXhlczJbXCJkZWZhdWx0XCJdLCBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSwgUHJvbWlzZSwgX2FuaW1hdGlvblNlcTJbXCJkZWZhdWx0XCJdLCBfY29tYm9TZXEyW1wiZGVmYXVsdFwiXSwgdGhpcy50cmFja2VyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY29tYm9cIixcblxuICAgIC8qKlxyXG4gICAgICAqIEBjb21ibyBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQHBhcmFtcyB7T2JqZWN0fVxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGFuIGNvbWJpbmF0aW9uIG9mIHNlcXVlbmNlLlxyXG4gICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbWJvKGFuaW1hdGlvbnMpIHtcbiAgICAgIHJldHVybiBuZXcgX2NvbWJvU2VxMltcImRlZmF1bHRcIl0oYW5pbWF0aW9ucywgUHJvbWlzZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImlzU3VwcG9ydGVkXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAaXNTdXBwb3J0ZWQgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBUZXN0cyB0aGUgYnJvd3NlciBmb3IgQW5pbWF0b3Igc3VwcG9ydC5cclxuICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc1N1cHBvcnRlZCgpIHtcbiAgICAgIHJldHVybiBuZXcgX2RvbVV0aWxzMltcImRlZmF1bHRcIl0oKS5zdXBwb3J0KF9wcmVmaXhlczJbXCJkZWZhdWx0XCJdLCBfY3NzVXRpbHMyW1wiZGVmYXVsdFwiXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInBhdXNlXCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAcGF1c2UgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBQYXVzZSB0aGUgY3VycmVudCBzZXF1ZW5jZS5cclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBwYXVzZSgpIHtcbiAgICAgIHRoaXMudHJhY2tlci5wYXVzZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwbGF5XCIsXG5cbiAgICAvKipcclxuICAgICAgKiBAcGxheSBmdW5jdGlvblxyXG4gICAgICAqXHJcbiAgICAgICogQGRlc2NyaXB0aW9uIFBsYXlzIHRoZSBjdXJyZW50IHNlcXVlbmNlLlxyXG4gICAgICAqL1xuXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgICB0aGlzLnRyYWNrZXIucGxheSgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBBbmltYXRvcjtcbn0pKCk7XG5cbndpbmRvdy5BbmltYXRvciA9IG5ldyBBbmltYXRvcigpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0XHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAQW5pbWF0aW9uIENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIFByb21pc2UgYmFzZWQgYW5pbWF0aW9uIGhhbmRsZXIgdGhhdCByZXNvbHZlcyB3aGVuIGFuaW1hdGlvbnMgdHJpZ2dlcmVkIG9uIGFuIGVsZW1lbnQgYXJlIGNvbXBsZXRlLlxyXG4gICogQHJldHVybnMge1Jlc29sdmVkIFByb21pc2V9XHJcbiAgKi9cblxudmFyIEFuaW1hdGlvbiA9IChmdW5jdGlvbiAoKSB7XG5cblx0XHQvKipcclxuICAgICogQGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBwYXJhbXMge09iamVjdCwgQ2xhc3MsIENsYXNzLCBDbGFzcywgQ2xhc3MsIE9iamVjdH0gIFxyXG4gICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIG5ldyBhbmltYXRpb24gc2VxdWVuY2UuICAgIFxyXG4gICogQHBhcmFtcyBkZXNjcmlwdGlvblxyXG4gIC0gb3B0aW9ucyB7T2JqZWN0fSBBbmltYXRpb24gb3B0aW9ucy5cclxuICBcdC0gZWxlbWVudCB7SFRNTEVsZW1lbnR9IFRoZSBlbGVtZW50IHRvIHNldCB0aGUgYW5pbWF0aW9uIG9uLlxyXG4gIFx0LSBzZXRTdHlsZXMge09iamVjdH0gU3R5bGVzIHRvIGJlIHNldCBiZWZvcmUgLyBhZnRlciB0aGUgYW5pbWF0aW9uLlxyXG4gIFx0XHQtIGJlZm9yZSB7T2JqZWN0fSBPYmplY3Qgb2YgQ1NTIHByb3BlcnR5IC8gdmFsdWUgcGFpcnMgdG8gYmUgc2V0IGJlZm9yZSB0aGUgYW5pbWF0aW9uLlxyXG4gIFx0XHQtIGFmdGVyIHtPYmplY3R9IE9iamVjdCBvZiBDU1MgcHJvcGVydHkgLyB2YWx1ZSBwYWlycyB0byBiZSBzZXQgYWZ0ZXIgdGhlIGFuaW1hdGlvbi5cclxuICBcdC0gYWRkQ2xhc3Mge09iamVjdH0gT2JqZWN0IG9mIGNsYXNzbmFtZXMgdG8gYmUgc2V0IGJlZm9yZSAvIGFmdGVyIHRoZSBhbmltYXRpb24uXHJcbiAgXHRcdC0gYmVmb3JlIHtTdHJpbmd9IENsYXNzbmFtZSB0byBzZXQgYmVmb3JlIHRoZSBhbmltYXRpb24uXHJcbiAgXHRcdC0gYWZ0ZXIge1N0cmluZ30gQ2xhc3NuYW1lIHRvIHNldCBhZnRlciB0aGUgYW5pbWF0aW9uLlxyXG4gIFx0LSByZW1vdmVDbGFzcyB7T2JqZWN0fSBPYmplY3Qgb2YgY2xhc3NuYW1lcyB0byBiZSByZW1vdmVkIGJlZm9yZSAvIGFmdGVyIHRoZSBhbmltYXRpb24uXHJcbiAgXHRcdC0gYmVmb3JlIHtTdHJpbmd9IENsYXNzbmFtZSB0byBiZSByZW1vdmVkIGJlZm9yZSB0aGUgYW5pbWF0aW9uLlxyXG4gIFx0XHQtIGFmdGVyIHtTdHJpbmd9IENsYXNzbmFtZSB0byBiZSByZW1vdmVkIGFmdGVyIHRoZSBhbmltYXRpb24uXHJcbiAgLSBEb21VdGlscyB7Q2xhc3N9IERvbSB1dGlsaXR5IGNsYXNzLlxyXG4gIC0gUHJlZml4IHtDbGFzc30gUHJlZml4IGNsYXNzLlxyXG4gIC0gQ3NzVXRpbHMge0NsYXNzfSBDU1MgVXRpbGl0aWVzIGNsYXNzLlxyXG4gIC0gUHJvbWlzZSB7Q2xhc3N9IFByb21pc2UgY2xhc3MuXHJcbiAgLSBUcmFja2VyIHtPYmplY3R9IE9iamVjdCB0aGF0IHRyYWNrcyBhbmQgbW9uaXRvcnMgc2VxdWVuY2VzLlxyXG4gICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAqL1xuXG5cdFx0ZnVuY3Rpb24gQW5pbWF0aW9uKG9wdGlvbnMsIERvbVV0aWxzLCBQcmVmaXgsIENzc1V0aWxzLCBQcm9taXNlLCBUcmFja2VyKSB7XG5cdFx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdFx0X2NsYXNzQ2FsbENoZWNrKHRoaXMsIEFuaW1hdGlvbik7XG5cblx0XHRcdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHRcdFx0dGhpcy5kb21VdGlscyA9IG5ldyBEb21VdGlscygpO1xuXHRcdFx0XHR0aGlzLmNzc1V0aWxzID0gbmV3IENzc1V0aWxzKCk7XG5cdFx0XHRcdHRoaXMucHJlZml4ID0gbmV3IFByZWZpeCgpLmdldFByZWZpeChcImFuaW1hdGlvbmVuZFwiKTtcblx0XHRcdFx0dGhpcy5vbkFuaW1hdGlvbkVuZCA9IHRoaXMuYW5pbWF0aW9uRW5kLmJpbmQodGhpcyk7XG5cdFx0XHRcdHRoaXMudHJhY2tlciA9IFRyYWNrZXI7XG5cblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdFx0XHRcdF90aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0XHRcdFx0X3RoaXMucmVqZWN0ID0gcmVqZWN0O1xuXHRcdFx0XHRcdFx0X3RoaXMuYW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoX3RoaXMuYW5pbWF0aW9uU3RhcnQuYmluZChfdGhpcykpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cblx0XHRfY3JlYXRlQ2xhc3MoQW5pbWF0aW9uLCBbe1xuXHRcdFx0XHRrZXk6IFwiYW5pbWF0aW9uU3RhcnRcIixcblxuXHRcdFx0XHQvKipcclxuICAgICAgKiBAYW5pbWF0aW9uU3RhcnQgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIGNsYXNzbmFtZXMgLyBzdHlsZSBydWxlcyB0byB0cmlnZ2VyIHRoZSBhbmltYXRpb24uXHJcbiAgICAgICogQGdsb2JhbCBub1xyXG4gICAgICAqL1xuXG5cdFx0XHRcdHZhbHVlOiBmdW5jdGlvbiBhbmltYXRpb25TdGFydCgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIG9wdHMgPSB0aGlzLm9wdGlvbnM7XG5cdFx0XHRcdFx0XHRvcHRzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnByZWZpeCwgdGhpcy5vbkFuaW1hdGlvbkVuZCwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0XHRpZiAob3B0cy5zZXRTdHlsZXMgJiYgb3B0cy5zZXRTdHlsZXMuYmVmb3JlKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5jc3NVdGlscy5zZXRTdHlsZXMob3B0cy5lbGVtZW50LCBvcHRzLnNldFN0eWxlcy5iZWZvcmUpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAob3B0cy5yZW1vdmVDbGFzcyAmJiBvcHRzLnJlbW92ZUNsYXNzLmJlZm9yZSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZG9tVXRpbHMuc2V0Q2xhc3Mob3B0cy5lbGVtZW50LCBvcHRzLnJlbW92ZUNsYXNzLmJlZm9yZSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAob3B0cy5hZGRDbGFzcyAmJiBvcHRzLmFkZENsYXNzLmJlZm9yZSkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZG9tVXRpbHMuc2V0Q2xhc3Mob3B0cy5lbGVtZW50LCBvcHRzLmFkZENsYXNzLmJlZm9yZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRcdGtleTogXCJhbmltYXRpb25FbmRcIixcblxuXHRcdFx0XHQvKipcclxuICAgICAgKiBAYW5pbWF0aW9uRW5kIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAZGVzY3JpcHRpb24gU2V0cyBjbGFzc25hbWVzIC8gc3R5bGUgcnVsZXMgYWZ0ZXIgYWxsIGFuaW1hdGlvbnMgaGF2ZSBjb21wbGV0ZWQgYW5kIHJlbW92ZXMgdGhlIGVsZW1lbnQgZnJvbSB0aGUgdHJhY2tlci5cclxuICAgICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAgICogQHJldHVybnMge1Jlc29sdmVkIFByb21pc2V9XHJcbiAgICAgICovXG5cblx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGFuaW1hdGlvbkVuZCgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIG9wdHMgPSB0aGlzLm9wdGlvbnM7XG5cdFx0XHRcdFx0XHRvcHRzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnByZWZpeCwgdGhpcy5vbkFuaW1hdGlvbkVuZCwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25GcmFtZSk7XG5cblx0XHRcdFx0XHRcdGlmIChvcHRzLnNldFN0eWxlcyAmJiBvcHRzLnNldFN0eWxlcy5hZnRlcikge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKG9wdHMuZWxlbWVudCwgb3B0cy5zZXRTdHlsZXMuYWZ0ZXIpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAob3B0cy5yZW1vdmVDbGFzcyAmJiBvcHRzLnJlbW92ZUNsYXNzLmFmdGVyKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5kb21VdGlscy5zZXRDbGFzcyhvcHRzLmVsZW1lbnQsIG9wdHMucmVtb3ZlQ2xhc3MuYWZ0ZXIsIGZhbHNlKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKG9wdHMuYWRkQ2xhc3MgJiYgb3B0cy5hZGRDbGFzcy5hZnRlcikge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZG9tVXRpbHMuc2V0Q2xhc3Mob3B0cy5lbGVtZW50LCBvcHRzLmFkZENsYXNzLmFmdGVyLCB0cnVlKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dGhpcy50cmFja2VyLnJlbW92ZShcIkFuaW1hdGlvbnNcIiwgb3B0cy5lbGVtZW50KTtcblx0XHRcdFx0XHRcdHRoaXMucmVzb2x2ZShvcHRzLmVsZW1lbnQpO1xuXHRcdFx0XHR9XG5cdFx0fV0pO1xuXG5cdFx0cmV0dXJuIEFuaW1hdGlvbjtcbn0pKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQW5pbWF0aW9uO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG5cdHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKipcclxuICAqIEBDb21ibyBDbGFzc1xyXG4gICpcclxuICAqIEBkZXNjcmlwdGlvbiBXcmFwcyBhIFByb21pc2UgYXJvdW5kIHggYW1vdW50IG9mIHNlcXVlbmNlcyBhbmQgcmVzb2x2ZXMgd2hlbiBhbGwgc2VxdWVuY2VzIGhhdmUgcmVzb2x2ZWQuXHJcbiAgKiBAcmV0dXJucyB7UmVzb2x2ZWQgUHJvbWlzZX1cclxuICAqL1xuXG52YXIgQ29tYm8gPSAoZnVuY3Rpb24gKCkge1xuXG5cdC8qKlxyXG4gICAqIEBjb25zdHJ1Y3RvciBmdW5jdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtcyB7QXJyYXksIENsYXNzfSAgXHJcbiAgICogQGRlc2NyaXB0aW9uIFdyYXBzIHggYW1vdW50IG9mIHNlcXVlbmNlcyBpbiBhIFByb21pc2UuICAgIFxyXG4gKiBAcGFyYW1zIGRlc2NyaXB0aW9uXHJcbiAtIHNlcXVlbmNlcyB7QXJyYXl9IEFuIGFycmF5IG9mIHNlcXVlbmNlcy5cclxuIC0gUHJvbWlzZSB7Q2xhc3N9IFByb21pc2UgY2xhc3MuXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAqL1xuXG5cdGZ1bmN0aW9uIENvbWJvKHNlcXVlbmNlcywgUHJvbWlzZSkge1xuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29tYm8pO1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuXHRcdFx0dmFyIHdhdGNoZXIgPSBfdGhpcy5zZXF1ZW5jZVdhdGNoZXIoKTtcblx0XHRcdF90aGlzLnJlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0X3RoaXMucmVqZWN0ID0gcmVqZWN0O1xuXHRcdFx0X3RoaXMuYW1vdW50ID0gc2VxdWVuY2VzLmxlbmd0aDtcblxuXHRcdFx0c2VxdWVuY2VzLmZvckVhY2goZnVuY3Rpb24gKHNlcXVlbmNlKSB7XG5cblx0XHRcdFx0c2VxdWVuY2UudGhlbihmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0XHRcdHdhdGNoZXIoZWxlbWVudCk7XG5cdFx0XHRcdH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0XHRfdGhpcy5yZWplY3QoZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRfY3JlYXRlQ2xhc3MoQ29tYm8sIFt7XG5cdFx0a2V5OiBcInNlcXVlbmNlV2F0Y2hlclwiLFxuXG5cdFx0LyoqXHJcbiAgICAqIEBzZXF1ZW5jZVdhdGNoZXIgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQGRlc2NyaXB0aW9uIFJlc29sdmVzIHdoZW4gYWxsIHNlcXVlbmNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQuICAgXHJcbiAgKiBAcmV0dXJucyB7UmVzb2x2ZWQgUHJvbWlzZX1cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKi9cblxuXHRcdHZhbHVlOiBmdW5jdGlvbiBzZXF1ZW5jZVdhdGNoZXIoKSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdHZhciByZXR1cm5EYXRhID0gW107XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuXHRcdFx0XHRjb3VudCsrO1xuXHRcdFx0XHRyZXR1cm5EYXRhLnB1c2goZWxlbWVudCk7XG5cdFx0XHRcdGlmIChjb3VudCA9PT0gX3RoaXMyLmFtb3VudCkge1xuXHRcdFx0XHRcdF90aGlzMi5yZXNvbHZlKHJldHVybkRhdGEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblx0fV0pO1xuXG5cdHJldHVybiBDb21ibztcbn0pKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ29tYm87XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAQ3NzVXRpbHMgQ2xhc3NcclxuICAqXHJcbiAgKiBAZGVzY3JpcHRpb24gQ1NTIHV0aWxpdHkgYmVsdCBmb3IgQW5pbWF0b3IgdXNpbmcgdGhlIENTU09NIChmaWxlOi8vLyBwcm90b2NvbCBub3Qgc3VwcG9ydGVkIGluIENocm9tZSkgXHJcbiAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICovXG5cbnZhciBDc3NVdGlscyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ3NzVXRpbHMoKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDc3NVdGlscyk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKENzc1V0aWxzLCBbe1xuICAgICAgICBrZXk6IFwiY3JlYXRlU3R5bGVTaGVldFwiLFxuXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgKiBAY3JlYXRlU3R5bGVTaGVldCBmdW5jdGlvblxyXG4gICAgICAgICAgKlxyXG4gICAgICAgICAgKiBAZGVzY3JpcHRpb24gQSBzdHlsZXNoZWV0IGZvciBhbnkgdHJhbnNpdGlvbiAvIGFuaW1hdGlvbiAvIHN0eWxlIGNsYXNzZXMgY3JlYXRlZCBpbiBBbmltYXRvci5cclxuICAgICAgICAgICogQHJldHVybnMge0NTU1N0eWxlU2hlZXR9IHN0eWxlc2hlZXRcclxuICAgICAgICAgICogQGdsb2JhbCBub1xyXG4gICAgICAgICAgKi9cblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlU3R5bGVTaGVldCgpIHtcblxuICAgICAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgICAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikpO1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgICAgICAgICByZXR1cm4gc3R5bGUuc2hlZXQ7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJjc3NUZXh0VG9Kc1wiLFxuXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgKiBAY3NzVGV4dFRvSnMgZnVuY3Rpb25cclxuICAgICAgICAgICpcclxuICAgICAgICAgICogQHBhcmFtcyB7U3RyaW5nfVxyXG4gICAgICAgICAgKiBAZGVzY3JpcHRpb24gQ29udmVydHMgYSBoeXBoZW4gZGVsaW10ZWQgQ1NTIHByb3BlcnR5IHRvIGEgY2FtZWwgY2FzZWQgSmF2YVNjcmlwdCBwcm9wZXJ0eS5cclxuICAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgICogQGdsb2JhbCBub1xyXG4gICAgICAgICAgKi9cblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3NzVGV4dFRvSnMoY3NzVGV4dCkge1xuXG4gICAgICAgICAgICByZXR1cm4gY3NzVGV4dC5yZXBsYWNlKC9cXC0oXFx3KS9nLCBmdW5jdGlvbiAoc3RyLCBsZXR0ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInNldFN0eWxlc1wiLFxuXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgKiBAc2V0U3R5bGVzIGZ1bmN0aW9uXHJcbiAgICAgICAgICAqXHJcbiAgICAgICAgICAqIEBwYXJhbXMge0hUTUxFbGVtZW50IC8gTm9kZWxpc3QsIE9iamVjdCwgQm9vbGVhbn1cclxuICAgICAgICAgICogQGRlc2NyaXB0aW9uIFNldHMgcHJvcGVydGllcyBvbiBhbiBlbGVtZW50J3MgQ1NTU3R5bGVEZWNsYXJhdGlvbi5cclxuICAgICAgICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgICAgICAgKiAgLSBlbGVtZW50OiB7SFRNTEVsZW1lbnQgLyBOb2RlbGlzdH0gSFRNTCBlbGVtZW50KHMpIHRvIHNldCBzdHlsZXMgcHJvcGVydGllcyBvbi5cclxuICAgICAgICAgICAgIC0gc3R5bGVzIDoge09iamVjdH0gT2JqZWN0IGNvbnRhaW5pbmcgQ1NTIHByb3BlcnR5IC8gdmFsdWUgcGFpcnMuXHJcbiAgICAgICAgICAgICAtIGltcG9ydGFudCA6IFtCb29sZWFuXSAoT3B0aW9uYWwpIFNwZWNpZnlpbmcgaWYgdGhlIENTUyB2YWx1ZSBpcyB0byBiZSBzZXQgYXMgaW1wb3J0YW50LiBcclxuICAgICAgICAgICogQGdsb2JhbCB5ZXNcclxuICAgICAgICAgICovXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldFN0eWxlcyhlbGVtZW50LCBzdHlsZXMsIGltcG9ydGFudCkge1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBlbGVtZW50Lmxlbmd0aCA/IEFycmF5LmZyb20oZWxlbWVudCkgOiBbZWxlbWVudF07XG4gICAgICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHN0eWxlcykuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltcG9ydGFudCA9IGltcG9ydGFudCB8fCBTdHJpbmcoc3R5bGVzW3Byb3BlcnR5XSkuaW5jbHVkZXMoXCJpbXBvcnRhbnRcIikgPyBcImltcG9ydGFudFwiIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGVzID0gU3RyaW5nKHN0eWxlc1twcm9wZXJ0eV0pLnJlcGxhY2UoLyE/aW1wb3J0YW50LywgXCJcIikudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wZXJ0eSwgcnVsZXMsIGltcG9ydGFudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImdldFN0eWxlc1wiLFxuXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgKiBAZ2V0U3R5bGVzIGZ1bmN0aW9uXHJcbiAgICAgICAgICAqXHJcbiAgICAgICAgICAqIEBwYXJhbXMge0hUTUxFbGVtZW50LCBTdHJpbmcgLyBBcnJheX1cclxuICAgICAgICAgICogQGRlc2NyaXB0aW9uIFF1ZXJpZXMgcHJvcGVydGllcyBzZXQgb24gYW4gZWxlbWVudCdzIENTU1N0eWxlRGVjbGFyYXRpb24uXHJcbiAgICAgICAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICAgICAgICogIC0gZWxlbWVudDoge0hUTUxFbGVtZW50fSBIVE1MIGVsZW1lbnQgdG8gcXVlcnkgYWdhaW50cyBpdHMgc3R5bGUgcHJvcGVydGllcy5cclxuICAgICAgICAgICAgIC0gcHJvcHMgOiB7U3RyaW5nIC8gQXJyYXl9IFN0cmluZyBvciBBcnJheSBvZiBzdHJpbmdzIG9mIENTUyBwcm9wZXJ0aWVzIHRvIHF1ZXJ5LlxyXG4gICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBPYmplY3Qgb2YgQ1NTIHByb3BlcnR5IC8gdmFsdWUgcGFpcnNcclxuICAgICAgICAgICogQGdsb2JhbCB5ZXNcclxuICAgICAgICAgICovXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN0eWxlcyhlbGVtZW50LCBwcm9wcykge1xuXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEFycmF5LmlzQXJyYXkocHJvcHMpID8gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShwcm9wcykpIDogW3Byb3BzXTtcbiAgICAgICAgICAgIHZhciBzdHlsZXMgPSB7fSxcbiAgICAgICAgICAgICAgICB0ZW1wID0ge307XG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgc3R5bGVzW3Byb3BlcnR5XSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc3R5bGVzO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiY3JlYXRlVHJhbnNpdGlvblwiLFxuXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAgKiBAY3JlYXRlVHJhbnNpdGlvbiBmdW5jdGlvblxyXG4gICAgICAgICAgKlxyXG4gICAgICAgICAgKiBAcGFyYW1zIHtPYmplY3QsIENsYXNzfVxyXG4gICAgICAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIHN0cmluZyBkZWZpbmluZyBhbiBlbGVtZW50J3MgQ1NTIHRyYW5zaXRpb24gdmFsdWVzIGFuZCBzZXRzIGl0IG9uIHRoZSBlbGVtZW50J3MgQ1NTU3R5bGVEZWNsYXJhdGlvbi4gXHJcbiAgICAgICAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICAgICAgICogIC0gdHJhbnNpdGlvbjoge09iamVjdH0gQW4gb2JqZWN0IG9mIHRyYW5zaXRpb24gcHJvcGVydGllcy5cclxuICAgICAgICAgICAgICAgICAtIGVsZW1lbnRzIHtIVE1MRWxlbWVudCAvIE5vZGVsaXN0fSBIVE1MRWxlbWVudChzKSB0byBzZXQgdHJhbnNpdGlvbiBvbi5cclxuICAgICAgICAgICAgICAgICAtIHByb3BlcnRpZXMge1N0cmluZyAvIEFycmF5fSBDU1MgcHJvcGVydGllcyB0byB0cmFuc2l0aW9uLlxyXG4gICAgICAgICAgICAgICAgIC0gZHVyYXRpb24ge1N0cmluZyAvIEFycmF5fSBNcyBvciBTIHRyYW5zaXRpb24gZHVyYXRpb24gdmFsdWUocykuXHJcbiAgICAgICAgICAgICAgICAgLSBlYXNpbmcgW1N0cmluZyAvIEFycmF5XSAoT3B0aW9uYWwpIFRyYW5zaXRpb24gdGltaW5nIGZ1bmN0aW9uIHZhbHVlKHMpLlxyXG4gICAgICAgICAgICAgICAgIC0gZGVsYXkgW1N0cmluZyAvIEFycmF5XSAoT3B0aW9uYWwpIFRyYW5zaXRpb24gZGVsYXkgdmFsdWUocykuXHJcbiAgICAgICAgICAgICAtIFByZWZpeCA6IHtDbGFzc30gUHJlZml4IGNsYXNzLlxyXG4gICAgICAgICAgKiBAZ2xvYmFsIHllc1xyXG4gICAgICAgICAgKi9cblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlVHJhbnNpdGlvbih0cmFuc2l0aW9uLCBQcmVmaXgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uUHJlZml4ID0gbmV3IFByZWZpeCgpLmdldFByZWZpeChcInRyYW5zaXRpb25cIik7XG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSB0cmFuc2l0aW9uLmVsZW1lbnQubGVuZ3RoID8gQXJyYXkuZnJvbSh0cmFuc2l0aW9uLmVsZW1lbnQpIDogW3RyYW5zaXRpb24uZWxlbWVudF07XG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEFycmF5LmlzQXJyYXkodHJhbnNpdGlvbi5wcm9wZXJ0aWVzKSA/IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkodHJhbnNpdGlvbi5wcm9wZXJ0aWVzKSkgOiBbdHJhbnNpdGlvbi5wcm9wZXJ0aWVzXTtcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IEFycmF5LmlzQXJyYXkodHJhbnNpdGlvbi5kdXJhdGlvbikgPyBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHRyYW5zaXRpb24uZHVyYXRpb24pKSA6IFt0cmFuc2l0aW9uLmR1cmF0aW9uXTtcbiAgICAgICAgICAgIHZhciBlYXNpbmcgPSBBcnJheS5pc0FycmF5KHRyYW5zaXRpb24uZWFzaW5nKSA/IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkodHJhbnNpdGlvbi5lYXNpbmcpKSA6IFt0cmFuc2l0aW9uLmVhc2luZ107XG4gICAgICAgICAgICB2YXIgZGVsYXkgPSBBcnJheS5pc0FycmF5KHRyYW5zaXRpb24uZGVsYXkpID8gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheSh0cmFuc2l0aW9uLmRlbGF5KSkgOiBbdHJhbnNpdGlvbi5kZWxheV07XG5cbiAgICAgICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uU3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2YXIgcnVsZXMgPSB7fTtcblxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCwgaSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25TdHJpbmcgKz0gXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25TdHJpbmcgKz0gcHJvcGVydGllcy5sZW5ndGggPiAxID8gcHJvcGVydGllc1tpXSArIFwiIFwiIDogcHJvcGVydGllc1swXSArIFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uU3RyaW5nICs9IGR1cmF0aW9uLmxlbmd0aCA+IDEgPyBkdXJhdGlvbltpXSArIFwiIFwiIDogZHVyYXRpb25bMF0gKyBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvblN0cmluZyArPSBlYXNpbmcubGVuZ3RoID4gMSA/IGVhc2luZ1tpXSArIFwiIFwiIDogKGVhc2luZ1swXSB8fCBcImVhc2VcIikgKyBcIiBcIjtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvblN0cmluZyArPSBkZWxheS5sZW5ndGggPiAxID8gZGVsYXlbaV0gKyBcIixcIiA6IChkZWxheVswXSB8fCBcIjBzXCIpICsgXCIsXCI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uU3RyaW5nID0gdHJhbnNpdGlvblN0cmluZy5zdWJzdHIoMCwgdHJhbnNpdGlvblN0cmluZy5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICBydWxlc1t0cmFuc2l0aW9uUHJlZml4XSA9IHRyYW5zaXRpb25TdHJpbmc7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0U3R5bGVzKGVsZW1lbnQsIHJ1bGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiY3JlYXRlS2V5ZnJhbWVBbmltYXRpb25cIixcblxuICAgICAgICAvKipcclxuICAgICAgICAgICogQGNyZWF0ZUtleWZyYW1lQW5pbWF0aW9uIGZ1bmN0aW9uXHJcbiAgICAgICAgICAqXHJcbiAgICAgICAgICAqIEBwYXJhbXMge09iamVjdCwgQ2xhc3MsIENTU1N0eWxlU2hlZXR9XHJcbiAgICAgICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgQ1NTIGtleWZyYW1lIGFuaW1hdGlvbiwgYW5kIG9wdGlvbmFsIGFzc29jaWF0ZWQgc3R5bGUgY2xhc3MsIGFuZCBpbnNlcnRzIGl0L3RoZW0gaW50byBBbmltYXRvcidzIHN0eWxlc2hlZXQuIFxyXG4gICAgICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICAgICAqICAtIGFuaW1hdGlvbjoge09iamVjdH0gQW4gb2JqZWN0IG9mIGFuaW1hdGlvbiBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgICAgICAgIC0gbmFtZSB7SFRNTEVsZW1lbnQgLyBOb2RlbGlzdH0gSFRNTEVsZW1lbnQocykgdG8gc2V0IHRyYW5zaXRpb24gb24uXHJcbiAgICAgICAgICAgICAgICAgLSBhbmltYXRpb24ge09iamVjdH0gRWl0aGVyIGZyb20gLyB0byBvciAlIGJhc2VkIGtleWZyYW1lcyBhbmQgQ1NTIHByb3BlcnRpZXMgLyB2YWx1ZXMuXHJcbiAgICAgICAgICAgICAgICAgLSBhbmltYXRpb25DbGFzcyBbT2JqZWN0XSAoT3B0aW9uYWwpIEEgQ1NTIGNsYXNzIHRvIHRyaWdnZXIgdGhlIGFuaW1hdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgLSBuYW1lIHtTdHJpbmd9IFRoZSBjbGFzc25hbWUuXHJcbiAgICAgICAgICAgICAgICAgICAgIC0gcnVsZXMge09iamVjdH0gT2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzLlxyXG4gICAgICAgICAgICAgLSBQcmVmaXggOiB7Q2xhc3N9IFByZWZpeCBjbGFzcy5cclxuICAgICAgICAgICAgIC0gc3R5bGVzaGVldCA6IHtDU1NTdHlsZVNoZWV0fSBBbmltYXRvcidzIHN0eWxlc2hlZXQuXHJcbiAgICAgICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICAgICAqL1xuXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVLZXlmcmFtZUFuaW1hdGlvbihhbmltYXRpb24sIFByZWZpeCwgc3R5bGVzaGVldCkge1xuXG4gICAgICAgICAgICB2YXIgYW5pbWF0aW9uU3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBuZXcgUHJlZml4KCk7XG4gICAgICAgICAgICB2YXIga2V5RnJhbWUgPSBwcmVmaXguZ2V0UHJlZml4KFwia2V5ZnJhbWVzXCIpO1xuICAgICAgICAgICAga2V5RnJhbWUgKz0gXCIgXCIgKyBhbmltYXRpb24ubmFtZSArIFwiIHtcXG5cIjtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoYW5pbWF0aW9uLmFuaW1hdGlvbikuZm9yRWFjaChmdW5jdGlvbiAoYW5pbSkge1xuICAgICAgICAgICAgICAgIGFuaW1hdGlvblN0cmluZyArPSBhbmltICsgXCIge1wiO1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGFuaW1hdGlvbi5hbmltYXRpb25bYW5pbV0pLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvblN0cmluZyArPSBcIlxcblwiICsgcHJvcGVydHkgKyBcIiA6IFwiICsgYW5pbWF0aW9uLmFuaW1hdGlvblthbmltXVtwcm9wZXJ0eV0gKyBcIjtcIjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb25TdHJpbmcgKz0gXCJcXG4gfVxcblwiO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFuaW1hdGlvblN0cmluZyArPSBcIn1cIjtcblxuICAgICAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGtleUZyYW1lICsgYW5pbWF0aW9uU3RyaW5nLCBzdHlsZXNoZWV0LnJ1bGVzLmxlbmd0aCB8fCBzdHlsZXNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgICAgICAgICBpZiAoYW5pbWF0aW9uLmFuaW1hdGlvbkNsYXNzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVDbGFzcyhhbmltYXRpb24uYW5pbWF0aW9uQ2xhc3MubmFtZSwgc3R5bGVzaGVldCwgYW5pbWF0aW9uLmFuaW1hdGlvbkNsYXNzLnJ1bGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNyZWF0ZUNsYXNzXCIsXG5cbiAgICAgICAgLyoqXHJcbiAgICAgICAgICAqIEBjcmVhdGVDbGFzcyBmdW5jdGlvblxyXG4gICAgICAgICAgKlxyXG4gICAgICAgICAgKiBAcGFyYW1zIHtTdHJpbmcsIENTU1N0eWxlU2hlZXQsIE9iamVjdCAoT3B0aW9uYWwpfVxyXG4gICAgICAgICAgKiBAZGVzY3JpcHRpb24gRGVmaW5lcyBhIENTUyBjbGFzcyBhbmQgaW5zZXJ0cyBpdCBpbnRvIEFuaW1hdG9yJ3Mgc3R5bGVzaGVldC4gXHJcbiAgICAgICAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICAgICAgICogIC0gY2xhc3NOYW1lOiB7U3RyaW5nfSBUaGUgbmFtZSBvZiB0aGUgY2xhc3MuXHJcbiAgICAgICAgICAgICAtIHN0eWxlc2hlZXQgOiB7Q1NTU3R5bGVTaGVldH0gQW5pbWF0b3IncyBzdHlsZXNoZWV0LlxyXG4gICAgICAgICAgICAgLSBydWxlcyA6IFtPYmplY3RdIChPcHRpb25hbCkgT2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzLlxyXG4gICAgICAgICAgKiBAZ2xvYmFsIHllc1xyXG4gICAgICAgICAgKi9cblxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY2xhc3NOYW1lLCBzdHlsZXNoZWV0KSB7XG4gICAgICAgICAgICB2YXIgcnVsZXMgPSBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzJdO1xuXG4gICAgICAgICAgICB2YXIgbmFtZSA9IFwiLlwiICsgY2xhc3NOYW1lO1xuICAgICAgICAgICAgdmFyIGNzc1N0cmluZyA9IFwieyBcIjtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMocnVsZXMpLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgICAgICAgICBjc3NTdHJpbmcgKz0gcnVsZSArIFwiIDogXCIgKyBydWxlc1tydWxlXSArIFwiOyBcIjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjc3NTdHJpbmcgKz0gXCJ9XCI7XG4gICAgICAgICAgICBzdHlsZXNoZWV0Lmluc2VydFJ1bGUobmFtZSArIGNzc1N0cmluZywgc3R5bGVzaGVldC5ydWxlcy5sZW5ndGggfHwgc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwiZGVsZXRlQ2xhc3NcIixcblxuICAgICAgICAvKipcclxuICAgICAgICAgICogQGRlbGV0ZUNsYXNzIGZ1bmN0aW9uXHJcbiAgICAgICAgICAqXHJcbiAgICAgICAgICAqIEBwYXJhbXMge1N0cmluZywgQ1NTU3R5bGVTaGVldH1cclxuICAgICAgICAgICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgYSBDU1MgY2xhc3MgZnJvbSBBbmltYXRvcidzIHN0eWxlc2hlZXQuIFxyXG4gICAgICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICAgICAqICAtIGNsYXNzTmFtZToge1N0cmluZ30gVGhlIG5hbWUgb2YgdGhlIGNsYXNzIHRvIHJlbW92ZS5cclxuICAgICAgICAgICAgIC0gc3R5bGVzaGVldCA6IHtDU1NTdHlsZVNoZWV0fSBBbmltYXRvcidzIHN0eWxlc2hlZXQuXHJcbiAgICAgICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICAgICAqL1xuXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZWxldGVDbGFzcyhjbGFzc05hbWUsIHN0eWxlc2hlZXQpIHtcblxuICAgICAgICAgICAgdmFyIHJ1bGVzID0gc3R5bGVzaGVldC5ydWxlcyB8fCBzdHlsZXNoZWV0LmNzc1J1bGVzO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBcIi5cIiArIGNsYXNzTmFtZTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJ1bGVzW3J1bGVdIGluc3RhbmNlb2YgQ1NTU3R5bGVSdWxlICYmIHJ1bGVzW3J1bGVdLnNlbGVjdG9yVGV4dCA9PT0gbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZXNoZWV0LmRlbGV0ZVJ1bGUocnVsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJjcmVhdGVDU1NSdWxlXCIsXG5cbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGNyZWF0ZUNTU1J1bGUgZnVuY3Rpb25cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbXMge1N0cmluZyAvIEFycmF5LCBTdHJpbmcgLyBBcnJheX1cclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhbiBvYmplY3Qgb2YgQ1NTIHByb3BlcnR5IC8gdmFsdWVzLiBcclxuICAgICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICAgICogIC0gcHJvcGVydHk6IHtTdHJpbmcgLyBBcnJheX0gVGhlIENTUyBwcm9wZXJ0eShzKS5cclxuICAgICAgICAgICAgLSB2YWx1ZSA6IHtTdHJpbmcgLyBBcnJheX0gVGhlIENTUyB2YWx1ZXMocykuXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzLlxyXG4gICAgICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICAgICovXG5cbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUNTU1J1bGUocHJvcGVydHksIHZhbHVlKSB7XG5cbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gQXJyYXkuaXNBcnJheShwcm9wZXJ0eSkgPyBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHByb3BlcnR5KSkgOiBbcHJvcGVydHldO1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IEFycmF5LmlzQXJyYXkodmFsdWUpID8gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheSh2YWx1ZSkpIDogW3ZhbHVlXTtcbiAgICAgICAgICAgIHZhciBydWxlID0ge307XG5cbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBydWxlW3Byb3BdID0gdmFsdWVzW2luZGV4XTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcnVsZTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDc3NVdGlscztcbn0pKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gQ3NzVXRpbHM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gKGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0pKCk7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldOyByZXR1cm4gYXJyMjsgfSBlbHNlIHsgcmV0dXJuIEFycmF5LmZyb20oYXJyKTsgfSB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbi8qKlxyXG4gICogQERvbVV0aWxzIENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIFByb3ZpZGVzIERPTSB1dGlsaXRpZXMgZm9yIEFuaW1hdG9yLlxyXG4gICogQHJldHVybnMge09iamVjdH1cclxuICAqL1xuXG52YXIgRG9tVXRpbHMgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEb21VdGlscygpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRG9tVXRpbHMpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKERvbVV0aWxzLCBbe1xuICAgIGtleTogXCJzZXRDbGFzc1wiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQHNldENsYXNzIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtIVE1MRWxlbWVudCwgU3RyaW5nIC8gQXJyYXksIEJvb2xlYW59XHJcbiAgICAgICogQGRlc2NyaXB0aW9uIEFkZHMgb3IgcmVtb3ZlcyBjbGFzcyhlcykgZnJvbSBhbiBlbGVtZW50LlxyXG4gICAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICAgKiAgLSBlbGVtZW50OiB7SFRNTEVsZW1lbnR9IFRoZSBlbGVtZW50IHRvIGFkZCAvIHJlbW92ZSB0aGUgY2xhc3MoZXMpIHRvIC8gZnJvbS5cclxuICAgICAgKiAgLSBjbGFzc0xpc3Q6IHtTdHJpbmcgLyBBcnJheX0gQSBzaW5nbGUgY2xhc3NuYW1lIG9yIGFycmF5IG9mIGNsYXNzbmFtZXMgdG8gYWRkIC8gcmVtb3ZlLlxyXG4gICAgICAqXHQtIGFkZDoge0Jvb2xlYW59IFNwZWNpZml5aW5nIHdoZXRoZXIgdG8gYWRkIC8gcmVtb3ZlIHRoZSBjbGFzcyhlcykuXHJcbiAgICAgICogQGdsb2JhbCB5ZXNcclxuICAgICAgKi9cblxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRDbGFzcyhlbGVtZW50LCBjbGFzc0xpc3QsIGFkZCkge1xuXG4gICAgICB2YXIgY2xhc3NlcyA9IEFycmF5LmlzQXJyYXkoY2xhc3NMaXN0KSA/IFtdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoY2xhc3NMaXN0KSkgOiBbY2xhc3NMaXN0XTtcbiAgICAgIHZhciBlbGVtZW50cyA9IGVsZW1lbnQubGVuZ3RoID8gQXJyYXkuZnJvbShlbGVtZW50KSA6IFtlbGVtZW50XTtcbiAgICAgIHZhciBhY3Rpb24gPSBhZGQgPyBcImFkZFwiIDogXCJyZW1vdmVcIjtcbiAgICAgIGNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbiAoY2xzKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZWwuY2xhc3NMaXN0W2FjdGlvbl0oY2xzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic3VwcG9ydFwiLFxuXG4gICAgLyoqXHJcbiAgICAgICogQHN1cHBvcnQgZnVuY3Rpb25cclxuICAgICAgKlxyXG4gICAgICAqIEBwYXJhbXMge0NsYXNzLCBDbGFzc31cclxuICAgICAgKiBAZGVzY3JpcHRpb24gVGVzdHMgZm9yIENTUyB0cmFuc2l0aW9uIC8gYW5pbWF0aW9uIC8gQ1NTT00gbWFuaXB1bGF0aW9uIHN1cHBvcnRcclxuICAgICAgKiBAcGFyYW1zIGRlc2NyaXB0aW9uICAgICAgXHJcbiAgICAgICogIC0gUHJlZml4OiB7Q2xhc3N9IFByZWZpeCBjbGFzcy5cclxuICAgICAgKiAgLSBDc3NVdGlsczoge0NsYXNzfSBDU1MgdXRpbGl0aWVzIGNsYXNzLlxyXG4gICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICovXG5cbiAgICB2YWx1ZTogZnVuY3Rpb24gc3VwcG9ydChQcmVmaXgsIENzc1V0aWxzKSB7XG5cbiAgICAgIHZhciBwcmVmaXggPSBuZXcgUHJlZml4KCk7XG4gICAgICB2YXIgY3NzVXRpbHMgPSBuZXcgQ3NzVXRpbHMoKTtcbiAgICAgIHZhciB0cmFuc2l0aW9uU3VwcG9ydCA9IHByZWZpeC5nZXRQcmVmaXgoXCJ0cmFuc2l0aW9uXCIpO1xuICAgICAgdmFyIGFuaW1hdGlvblN1cHBvcnQgPSBwcmVmaXguZ2V0UHJlZml4KFwiYW5pbWF0aW9uXCIpO1xuICAgICAgdmFyIHJhZiA9ICEhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxuICAgICAgcmV0dXJuIHRyYW5zaXRpb25TdXBwb3J0ICYmIGFuaW1hdGlvblN1cHBvcnQgJiYgcmFmO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBEb21VdGlscztcbn0pKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gRG9tVXRpbHM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0XHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAUHJlZml4IENsYXNzXHJcbiAgKlxyXG4gICogQGRlc2NyaXB0aW9uIEhhbmRsZXMgcHJlZml4aW5nIGZvciBDU1MgcHJvcGVydGllcyBhbmQgRE9NIGV2ZW50cy5cclxuICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgKi9cblxudmFyIFByZWZpeCA9IChmdW5jdGlvbiAoKSB7XG5cblx0XHQvKipcclxuICAgICogQGNvbnN0cnVjdG9yIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgbWFwIHRoYXQgaG9sZHMgbm9uLXByZWZpeGVkIHByb3BlcnRpZXMgYW5kIGV2ZW50IG5hbWVzIGFzIGtleXMgYW5kIGFzc29jaWF0ZWQgcHJlZml4ZXMgYXMgdmFsdWVzIHRvIHRlc3QgYWdhaW5zdC5cclxuICAgICovXG5cblx0XHRmdW5jdGlvbiBQcmVmaXgoKSB7XG5cdFx0XHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQcmVmaXgpO1xuXG5cdFx0XHRcdHRoaXMudGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzID0gbmV3IE1hcCgpO1xuXG5cdFx0XHRcdC8vIFRyYW5zZm9ybXNcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJ0cmFuc2Zvcm1cIiwgW1wiLXdlYmtpdC10cmFuc2Zvcm1cIiwgXCJ0cmFuc2Zvcm1cIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcInRyYW5zZm9ybS1vcmlnaW5cIiwgW1wiLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luXCIsIFwidHJhbnNmb3JtLW9yaWdpblwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwidHJhbnNmb3JtLXN0eWxlXCIsIFtcIi13ZWJraXQtdHJhbnNmb3JtLXN0eWxlXCIsIFwidHJhbnNmb3JtLXN0eWxlXCJdKTtcblxuXHRcdFx0XHQvLyBUcmFuc2l0aW9uc1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcInRyYW5zaXRpb25cIiwgW1wiLXdlYmtpdC10cmFuc2l0aW9uXCIsIFwidHJhbnNpdGlvblwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwidHJhbnNpdGlvbi1kZWxheVwiLCBbXCItd2Via2l0LXRyYW5zaXRpb24tZGVsYXlcIiwgXCJ0cmFuc2l0aW9uLWRlbGF5XCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJ0cmFuc2l0aW9uLWR1cmF0aW9uXCIsIFtcIi13ZWJraXQtdHJhbnNpdGlvbi1kdXJhdGlvblwiLCBcInRyYW5zaXRpb24tZHVyYXRpb25cIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcInRyYW5zaXRpb24tcHJvcGVydHlcIiwgW1wiLXdlYmtpdC10cmFuc2l0aW9uLXByb3BlcnR5XCIsIFwidHJhbnNpdGlvbi1wcm9wZXJ0eVwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwidHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb25cIiwgW1wiLXdlYmtpdC10cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvblwiLCBcInRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uXCJdKTtcblxuXHRcdFx0XHQvLyBBbmltYXRpb25zXG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwia2V5ZnJhbWVzXCIsIFtcIi13ZWJraXQtXCIsIFwiLW1zLVwiLCBcIi1tb3otXCIsIFwiXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb25cIiwgW1wiLXdlYmtpdC1hbmltYXRpb25cIiwgXCItbXMtYW5pbWF0aW9uXCIsIFwiLW1vei1hbmltYXRpb25cIiwgXCJhbmltYXRpb25cIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcImFuaW1hdGlvbi1uYW1lXCIsIFtcIi13ZWJraXQtYW5pbWF0aW9uLW5hbWVcIiwgXCItbXMtYW5pbWF0aW9uLW5hbWVcIiwgXCItbW96LWFuaW1hdGlvbi1uYW1lXCIsIFwiYW5pbWF0aW9uLW5hbWVcIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcImFuaW1hdGlvbi1pdGVyYXRpb24tY291bnRcIiwgW1wiLXdlYmtpdC1hbmltYXRpb24taXRlcmF0aW9uLWNvdW50XCIsIFwiLW1zLWFuaW1hdGlvbi1pdGVyYXRpb24tY291bnRcIiwgXCItbW96LWFuaW1hdGlvbi1pdGVyYXRpb24tY291bnRcIiwgXCJhbmltYXRpb24taXRlcmF0aW9uLWNvdW50XCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb24tcGxheS1zdGF0ZVwiLCBbXCItd2Via2l0LWFuaW1hdGlvbi1wbGF5LXN0YXRlXCIsIFwiLW1zLWFuaW1hdGlvbi1wbGF5LXN0YXRlXCIsIFwiLW1vei1hbmltYXRpb24tcGxheS1zdGF0ZVwiLCBcImFuaW1hdGlvbi1wbGF5LXN0YXRlXCJdKTtcblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJhbmltYXRpb24tZHVyYXRpb25cIiwgW1wiLXdlYmtpdC1hbmltYXRpb24tZHVyYXRpb25cIiwgXCItbXMtYW5pbWF0aW9uLWR1cmF0aW9uXCIsIFwiLW1vei1hbmltYXRpb24tZHVyYXRpb25cIiwgXCJhbmltYXRpb24tZHVyYXRpb25cIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcImFuaW1hdGlvbi1kZWxheVwiLCBbXCItd2Via2l0LWFuaW1hdGlvbi1kZWxheVwiLCBcIi1tcy1hbmltYXRpb24tZGVsYXlcIiwgXCItbW96LWFuaW1hdGlvbi1kZWxheVwiLCBcImFuaW1hdGlvbi1kZWxheVwiXSk7XG5cdFx0XHRcdHRoaXMucHJlZml4ZXMuc2V0KFwiYW5pbWF0aW9uLWRpcmVjdGlvblwiLCBbXCItd2Via2l0LWFuaW1hdGlvbi1kaXJlY3Rpb25cIiwgXCItbXMtYW5pbWF0aW9uLWRpcmVjdGlvblwiLCBcIi1tb3otYW5pbWF0aW9uLWRpcmVjdGlvblwiLCBcImFuaW1hdGlvbi1kaXJlY3Rpb25cIl0pO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcImFuaW1hdGlvbi1maWxsLW1vZGVcIiwgW1wiLXdlYmtpdC1hbmltYXRpb24tZmlsbC1tb2RlXCIsIFwiLW1zLWFuaW1hdGlvbi1maWxsLW1vZGVcIiwgXCItbW96LWFuaW1hdGlvbi1maWxsLW1vZGVcIiwgXCJhbmltYXRpb24tZmlsbC1tb2RlXCJdKTtcblxuXHRcdFx0XHQvLyBUcmFuc2l0aW9uIC8gQW5pbWF0aW9uIGVuZFxuXHRcdFx0XHR2YXIgV2Via2l0VHJhbnNpdGlvbiA9IFwid2Via2l0VHJhbnNpdGlvbkVuZFwiO1xuXHRcdFx0XHR2YXIgdHJhbnNpdGlvbiA9IFwidHJhbnNpdGlvbmVuZFwiO1xuXHRcdFx0XHR2YXIgV2Via2l0QW5pbWF0aW9uID0gXCJ3ZWJraXRBbmltYXRpb25FbmRcIjtcblx0XHRcdFx0dmFyIGFuaW1hdGlvbiA9IFwiYW5pbWF0aW9uZW5kXCI7XG5cblx0XHRcdFx0dmFyIHRyYW5zaXRpb25lbmQgPSB7IFdlYmtpdFRyYW5zaXRpb246IFdlYmtpdFRyYW5zaXRpb24sIHRyYW5zaXRpb246IHRyYW5zaXRpb24gfTtcblx0XHRcdFx0dmFyIGFuaW1hdGlvbmVuZCA9IHsgV2Via2l0QW5pbWF0aW9uOiBXZWJraXRBbmltYXRpb24sIGFuaW1hdGlvbjogYW5pbWF0aW9uIH07XG5cblx0XHRcdFx0dGhpcy5wcmVmaXhlcy5zZXQoXCJ0cmFuc2l0aW9uZW5kXCIsIHRyYW5zaXRpb25lbmQpO1xuXHRcdFx0XHR0aGlzLnByZWZpeGVzLnNldChcImFuaW1hdGlvbmVuZFwiLCBhbmltYXRpb25lbmQpO1xuXHRcdH1cblxuXHRcdF9jcmVhdGVDbGFzcyhQcmVmaXgsIFt7XG5cdFx0XHRcdGtleTogXCJnZXRQcmVmaXhcIixcblxuXHRcdFx0XHQvKipcclxuICAgICAgKiBAZ2V0UHJlZml4IGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtTdHJpbmd9IFRoZSBub24tcHJlZml4ZWQgQ1NTIHByb3BlcnR5IC8gRE9NIGV2ZW50IG5hbWUgdG8gc2VhcmNoIHRoZSBwcmVmaXggbWFwIGZvci5cclxuICAgICAgKiBAZGVzY3JpcHRpb24gSGFuZGxlcyBwcmVmaXggcXVlcmllcyBieSBzZWFyY2hpbmcgYW5kIHRlc3RpbmcgcHJvcGVydGllcyBhbmQgdmFsdWVzIGluIHRoZSBwcmVmaXggbWFwIGFnYWluc3QgYSBIVE1MRWxlbWVudCdzIENTU1N0eWxlRGVjbGFyYXRpb24uXHJcbiAgICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHF1ZXJpZWQgcHJlZml4LlxyXG4gICAgICAqIEBnbG9iYWwgeWVzXHJcbiAgICAgICovXG5cblx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uIGdldFByZWZpeChwcmVmaXgpIHtcblx0XHRcdFx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdFx0XHRcdGlmICghdGhpcy5wcmVmaXhlcy5oYXMocHJlZml4KSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHJlZml4ID09PSBcInRyYW5zaXRpb25lbmRcIiB8fCBwcmVmaXggPT09IFwiYW5pbWF0aW9uZW5kXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRQcmVmaXhlZEV2ZW50TmFtZShwcmVmaXgpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChwcmVmaXggPT09IFwia2V5ZnJhbWVzXCIpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIga2V5ZnJhbWVQcmVmaXggPSB0aGlzLnByZWZpeGVzLmdldChwcmVmaXgpLmZpbHRlcihmdW5jdGlvbiAoZikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXMudGVzdEVsZW1lbnQuc3R5bGVbZiArIFwiYW5pbWF0aW9uLW5hbWVcIl0gIT09IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0XHR9KVswXTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gXCJAXCIgKyBrZXlmcmFtZVByZWZpeCArIFwia2V5ZnJhbWVzXCI7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnByZWZpeGVzLmdldChwcmVmaXgpLmZpbHRlcihmdW5jdGlvbiAoZikge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gX3RoaXMudGVzdEVsZW1lbnQuc3R5bGVbZl0gIT09IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0XHR9KVswXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sIHtcblx0XHRcdFx0a2V5OiBcImdldFByZWZpeGVkRXZlbnROYW1lXCIsXG5cblx0XHRcdFx0LyoqXHJcbiAgICAgICogQGdldFByZWZpeGVkRXZlbnROYW1lIGZ1bmN0aW9uXHJcbiAgICAgICpcclxuICAgICAgKiBAcGFyYW1zIHtTdHJpbmd9IFRoZSBub24tcHJlZml4ZWQgRE9NIGV2ZW50IG5hbWUgdG8gc2VhcmNoIHRoZSBwcmVmaXggbWFwIGZvci5cclxuICAgICAgKiBAZGVzY3JpcHRpb24gVGVzdHMgYSBIVE1MRWxlbWVudCdzIENTU1N0eWxlRGVjbGFyYXRpb24gZm9yIHN1cHBvcnRlZCBET00gZXZlbnQgcHJlZml4ZXMuXHJcbiAgICAgICogQHJldHVybnMge1N0cmluZ30gVGhlIHF1ZXJpZWQgcHJlZml4LlxyXG4gICAgICAqIEBnbG9iYWwgbm9cclxuICAgICAgKi9cblxuXHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24gZ2V0UHJlZml4ZWRFdmVudE5hbWUoZXZlbnROYW1lKSB7XG5cdFx0XHRcdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0XHRcdFx0dmFyIGV2dE5hbWVzID0gdGhpcy5wcmVmaXhlcy5nZXQoZXZlbnROYW1lKTtcblx0XHRcdFx0XHRcdHZhciBtYXRjaGVzID0gT2JqZWN0LmtleXMoZXZ0TmFtZXMpLmZpbHRlcihmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiBfdGhpczIudGVzdEVsZW1lbnQuc3R5bGVbZV0gIT09IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGV2dE5hbWVzW21hdGNoZXNbMF1dO1xuXHRcdFx0XHR9XG5cdFx0fV0pO1xuXG5cdFx0cmV0dXJuIFByZWZpeDtcbn0pKCk7XG5cbjtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBQcmVmaXg7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcblx0dmFsdWU6IHRydWVcbn0pO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG4vKipcclxuICAqIEBTZXF1ZW5jZVdyYXBwZXIgQ2xhc3NcclxuICAqXHJcbiAgKiBAZGVzY3JpcHRpb24gSW50ZXJjZXB0cyBhbGwgc2VxdWVuY2VzIGFuZCByZXR1cm5zIGEgc2luZ2xlIG9yIGNvbWJvIHNlcXVlbmNlIGRlcGVuZGluZyBvbiB3aGV0aGVyIGEgc2luZ2xlIEhUTUxFbGVtZW50IG9yIE5vZGVsaXN0IGlzIHVzZWQuXHJcbiAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAqL1xuXG52YXIgU2VxdWVuY2VXcmFwcGVyID1cblxuLyoqXHJcbiAgKiBAY29uc3RydWN0b3IgZnVuY3Rpb25cclxuICAqXHJcbiAgKiBAcGFyYW1zIHtPYmplY3QsIENsYXNzLCBDbGFzcywgQ2xhc3MsIENsYXNzLCBDbGFzcywgQ2xhc3MsIE9iamVjdH0gICAgIFxyXG4gICogQGRlc2NyaXB0aW9uIEEgd3JhcHBlciB0aGF0IG9yZ2FuaXNlcyBhbGwgc2VxdWVuY2VzIGJlZm9yZSB0aGV5IGFyZSBsYXVuY2hlZC4gXHJcbiogQHBhcmFtcyBkZXNjcmlwdGlvblxyXG4tIG9wdGlvbnMge09iamVjdH0gT2JqZWN0IG9mIHNlcXVlbmNlIG9wdGlvbnMuXHJcbi0gRG9tVXRpbHMge0NsYXNzfSBET00gdXRpbGl0aWVzIGNsYXNzLlxyXG4tIFByZWZpeCB7Q2xhc3N9IFByZWZpeCBjbGFzcy5cclxuLSBDc3NVdGlscyB7Q2xhc3N9IENTUyBVdGlsaXRpZXMgY2xhc3MuXHJcbi0gUHJvbWlzZSB7Q2xhc3N9IFByb21pc2UgY2xhc3MuXHJcbi0gU2VxdWVuY2Uge0NsYXNzfSBUaGUgc2VxdWVuY2UgdHlwZSAoVHJhbnNpdGlvbiAvIEFuaW1hdGlvbikuXHJcbi0gQ29tYm8ge0NsYXNzfSBXcmFwcGVyIGZvciBtdWx0aXBsZSBzZXF1ZW5jZXMuXHJcbi0gVHJhY2tlciB7T2JqZWN0fSBPYmplY3QgdG8gc3RvcmUgYW5kIHRyYWNrIHNlcXVlbmNlcyB0aHJvdWdoLlxyXG4qIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICovXG5cbmZ1bmN0aW9uIFNlcXVlbmNlV3JhcHBlcihvcHRpb25zLCBEb21VdGlscywgUHJlZml4LCBDc3NVdGlscywgUHJvbWlzZSwgU2VxdWVuY2UsIENvbWJvLCBUcmFja2VyKSB7XG5cdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTZXF1ZW5jZVdyYXBwZXIpO1xuXG5cdGlmIChvcHRpb25zLmVsZW1lbnQubGVuZ3RoKSB7XG5cdFx0dmFyIHRyYW5zaXRpb25zID0gQXJyYXkuZnJvbShvcHRpb25zLmVsZW1lbnQpLm1hcChmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdFx0dmFyIG9wdHMgPSB7fTtcblx0XHRcdE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRvcHRzW2tleV0gPSBvcHRpb25zW2tleV07XG5cdFx0XHR9KTtcblx0XHRcdG9wdHMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0XHRUcmFja2VyLnRyYWNrKG9wdHMsIFNlcXVlbmNlKTtcblx0XHRcdHJldHVybiBuZXcgU2VxdWVuY2Uob3B0cywgRG9tVXRpbHMsIFByZWZpeCwgQ3NzVXRpbHMsIFByb21pc2UsIFRyYWNrZXIpO1xuXHRcdH0pO1xuXHRcdHJldHVybiBuZXcgQ29tYm8odHJhbnNpdGlvbnMsIFByb21pc2UpO1xuXHR9IGVsc2Uge1xuXHRcdFRyYWNrZXIudHJhY2sob3B0aW9ucywgU2VxdWVuY2UpO1xuXHRcdHJldHVybiBuZXcgU2VxdWVuY2Uob3B0aW9ucywgRG9tVXRpbHMsIFByZWZpeCwgQ3NzVXRpbHMsIFByb21pc2UsIFRyYWNrZXIpO1xuXHR9XG59O1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IFNlcXVlbmNlV3JhcHBlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07IHJldHVybiBhcnIyOyB9IGVsc2UgeyByZXR1cm4gQXJyYXkuZnJvbShhcnIpOyB9IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAVHJhY2tlciBDbGFzc1xyXG4gICpcclxuICAqIEBkZXNjcmlwdGlvbiBUcmFjayBhbGwgc2VxdWVuY2VkIGVsZW1lbnRzIHRvIGFsbG93IHNlcXVlbmNlcyB0byBiZSBwbGF5ZWQgLyBwYXVzZWQuXHJcbiAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICovXG5cbnZhciBUcmFja2VyID0gKGZ1bmN0aW9uICgpIHtcblxuXHQvKipcclxuICAgKiBAY29uc3RydWN0b3IgZnVuY3Rpb25cclxuICAgKlxyXG4gICAqIEBwYXJhbXMge0NsYXNzLCBDbGFzcywgQ2xhc3MsIENsYXNzfSAgICBcclxuICAgKiBAZGVzY3JpcHRpb24gSW5pdGlhbGlzZSBhIHNpbmdsZSBNYXAgb2JqZWN0IHRvIHN0b3JlIHNlcXVlbmNlZCBlbGVtZW50cy4gT25seSBvbmUgaW5zdGFuY2UgcGVyIEFuaW1hdG9yIGlzIGNyZWF0ZWQuICBcclxuICogQHBhcmFtcyBkZXNjcmlwdGlvblxyXG4gLSBEb21VdGlscyB7Q2xhc3N9IERPTSB1dGlsaXRpZXMgY2xhc3MuXHJcbiAtIFByZWZpeCB7Q2xhc3N9IFByZWZpeCBjbGFzcy5cclxuIC0gQ3NzVXRpbHMge0NsYXNzfSBDU1MgVXRpbGl0aWVzIGNsYXNzLlxyXG4gLSBUcmFuc2l0aW9uIHtDbGFzc30gU3RvcmUgdGhlIFRyYW5zaXRpb24gcHJvdG95cGUgdG8gY29tcGFyZSBhZ2FpbnN0IG5ldyBzZXF1ZW5jZSB0eXBlcyBwYXNzZWQgaW4gdG8gdGhlIFRyYWNrZXIuXHJcbiAgICovXG5cblx0ZnVuY3Rpb24gVHJhY2tlcihEb21VdGlscywgUHJlZml4LCBDc3NVdGlscywgVHJhbnNpdGlvbikge1xuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFja2VyKTtcblxuXHRcdHRoaXMudHJhY2tlciA9IG5ldyBNYXAoKTtcblx0XHR0aGlzLnRyYWNrZXIuc2V0KFwiVHJhbnNpdGlvbnNcIiwgbmV3IE1hcCgpKTtcblx0XHR0aGlzLnRyYWNrZXIuc2V0KFwiQW5pbWF0aW9uc1wiLCBuZXcgTWFwKCkpO1xuXHRcdHRoaXMuZG9tVXRpbHMgPSBuZXcgRG9tVXRpbHMoKTtcblx0XHR0aGlzLnByZWZpeCA9IG5ldyBQcmVmaXgoKTtcblx0XHR0aGlzLmNzc1V0aWxzID0gbmV3IENzc1V0aWxzKCk7XG5cdFx0dGhpcy50cmFuc2l0aW9uUHJvdG90eXBlID0gVHJhbnNpdGlvbi5wcm90b3R5cGU7XG5cdH1cblxuXHRfY3JlYXRlQ2xhc3MoVHJhY2tlciwgW3tcblx0XHRrZXk6IFwidHJhY2tcIixcblxuXHRcdC8qKlxyXG4gICAgKiBAdHJhY2sgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQHBhcmFtcyB7T2JqZWN0LCBDbGFzc31cclxuICAgICogQGRlc2NyaXB0aW9uIFNlYXJjaGVzIHRoZSBNYXAgZm9yIHRoZSBlbGVtZW50IHBhc3NlZCBpbiBhbmQgZWl0aGVyIHVwZGF0ZXMgaXQgaWYgZm91bmQgb3IgY3JlYXRlcyBhIG5ldyBlbnRyeSBpbiB0aGUgTWFwIGZvciBpdC5cclxuICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgKiAgLSBvcHRpb25zOiB7T2JqZWN0fSBUaGUgc2VxdWVuY2Ugb3B0aW9ucy5cclxuICAgICAgIC0gU2VxdWVuY2UgOiB7Q2xhc3N9IEVpdGhlciBhIFRyYW5zaXRpb24gb3IgQW5pbWF0aW9uIGNsYXNzLlxyXG4gICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAqL1xuXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHRyYWNrKG9wdGlvbnMsIFNlcXVlbmNlKSB7XG5cblx0XHRcdHZhciB0cmFuc2l0aW9uID0gdGhpcy50cmFja2VyLmdldChcIlRyYW5zaXRpb25zXCIpLmdldChvcHRpb25zLmVsZW1lbnQpO1xuXHRcdFx0dmFyIGFuaW1hdGlvbiA9IHRoaXMudHJhY2tlci5nZXQoXCJBbmltYXRpb25zXCIpLmdldChvcHRpb25zLmVsZW1lbnQpO1xuXG5cdFx0XHRpZiAoU2VxdWVuY2UucHJvdG90eXBlID09PSB0aGlzLnRyYW5zaXRpb25Qcm90b3R5cGUpIHtcblx0XHRcdFx0aWYgKCF0cmFuc2l0aW9uKSB7XG5cdFx0XHRcdFx0dGhpcy50cmFja1RyYW5zaXRpb24ob3B0aW9ucyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy51cGRhdGVUcmFuc2l0aW9uUmVjb3JkKHRyYW5zaXRpb24sIG9wdGlvbnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdC8vIEEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHdpbGwgc3VmZmljZSBpZiB0aGUgc2VxdWVuY2UgdHlwZSBpcyBhbiBBbmltYXRpb24uXG5cdFx0XHRcdC8vIENTUyBBbmltYXRpb25zIGNhbiBiZSBwYXVzZWQgYW5kIHBsYXllZCBlYXNpbHkgdW5saWtlIHRyYW5zaXRpb25zIHdoaWNoIGFyZSBhIGJpdCB0cmlja2llci5cblx0XHRcdFx0aWYgKCFhbmltYXRpb24pIHtcblx0XHRcdFx0XHR0aGlzLnRyYWNrQW5pbWF0aW9uKG9wdGlvbnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiBcInRyYWNrVHJhbnNpdGlvblwiLFxuXG5cdFx0LyoqXHJcbiAgICAqIEB0cmFja1RyYW5zaXRpb24gZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQHBhcmFtcyB7T2JqZWN0fVxyXG4gICAgKiBAZGVzY3JpcHRpb24gU3RvcmVzIHRoZSBlbGVtZW50IHVuZGVyIHRoZSBUcmFuc2l0aW9ucyBrZXkgaW4gdGhlIFRyYWNrZXIgTWFwIFxyXG4gICAgKiBcdFx0YW5kIHRoZSB0cmFuc2l0aW9uZWQgcHJvcGVydGllcyAvIHZhbHVlcyBzZXQgYWdhaW5zdCB0aGUgZWxlbWVudC5cclxuICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgKiAgLSBvcHRpb25zOiB7T2JqZWN0fSBUaGUgdHJhbnNpdGlvbiBzZXF1ZW5jZSBvcHRpb25zLlxyXG4gICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAqL1xuXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHRyYWNrVHJhbnNpdGlvbihvcHRpb25zKSB7XG5cblx0XHRcdHZhciBkYXRhID0ge30sXG5cdFx0XHQgICAgdHJhbnNpdGlvblN0eWxlcyA9IHt9O1xuXHRcdFx0dmFyIHRyYW5zaXRpb25zID0gdGhpcy50cmFja2VyLmdldChcIlRyYW5zaXRpb25zXCIpO1xuXHRcdFx0dmFyIHRwID0gQW5pbWF0b3IuZ2V0UHJlZml4KFwidHJhbnNpdGlvbi1wcm9wZXJ0eVwiKSxcblx0XHRcdCAgICB0ZHVyID0gQW5pbWF0b3IuZ2V0UHJlZml4KFwidHJhbnNpdGlvbi1kdXJhdGlvblwiKSxcblx0XHRcdCAgICB0dGYgPSBBbmltYXRvci5nZXRQcmVmaXgoXCJ0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvblwiKSxcblx0XHRcdCAgICB0ZGVsID0gQW5pbWF0b3IuZ2V0UHJlZml4KFwidHJhbnNpdGlvbi1kZWxheVwiKTtcblxuXHRcdFx0dHJhbnNpdGlvblN0eWxlc1t0cF0gPSB0aGlzLmNzc1V0aWxzLmdldFN0eWxlcyhvcHRpb25zLmVsZW1lbnQsIHRwKVt0cF07XG5cdFx0XHR0cmFuc2l0aW9uU3R5bGVzW3RkdXJdID0gdGhpcy5jc3NVdGlscy5nZXRTdHlsZXMob3B0aW9ucy5lbGVtZW50LCB0ZHVyKVt0ZHVyXTtcblx0XHRcdHRyYW5zaXRpb25TdHlsZXNbdHRmXSA9IHRoaXMuY3NzVXRpbHMuZ2V0U3R5bGVzKG9wdGlvbnMuZWxlbWVudCwgdHRmKVt0dGZdO1xuXHRcdFx0dHJhbnNpdGlvblN0eWxlc1t0ZGVsXSA9IHRoaXMuY3NzVXRpbHMuZ2V0U3R5bGVzKG9wdGlvbnMuZWxlbWVudCwgdGRlbClbdGRlbF07XG5cdFx0XHRkYXRhLnRyYW5zaXRpb25TdHlsZXMgPSB0cmFuc2l0aW9uU3R5bGVzO1xuXG5cdFx0XHRpZiAob3B0aW9ucy5zZXRTdHlsZXMgJiYgb3B0aW9ucy5zZXRTdHlsZXMuYmVmb3JlKSB7XG5cdFx0XHRcdGRhdGEuc3R5bGVzID0gb3B0aW9ucy5zZXRTdHlsZXMuYmVmb3JlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0aW9ucy5hZGRDbGFzcyAmJiBvcHRpb25zLmFkZENsYXNzLmJlZm9yZSB8fCBvcHRpb25zLnJlbW92ZUNsYXNzICYmIG9wdGlvbnMucmVtb3ZlQ2xhc3MuYmVmb3JlKSB7XG5cdFx0XHRcdGRhdGEuY2xhc3NUcmlnZ2VyZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRkYXRhLnByb3BlcnRpZXMgPSBBcnJheS5pc0FycmF5KG9wdGlvbnMucHJvcGVydGllcykgPyBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG9wdGlvbnMucHJvcGVydGllcykpIDogW29wdGlvbnMucHJvcGVydGllc107XG5cdFx0XHR0cmFuc2l0aW9ucy5zZXQob3B0aW9ucy5lbGVtZW50LCBkYXRhKTtcblx0XHR9XG5cdH0sIHtcblx0XHRrZXk6IFwidHJhY2tBbmltYXRpb25cIixcblxuXHRcdC8qKlxyXG4gICAgKiBAdHJhY2tBbmltYXRpb24gZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQHBhcmFtcyB7T2JqZWN0fVxyXG4gICAgKiBAZGVzY3JpcHRpb24gU3RvcmVzIGFuIGVsZW1lbnQgdW5kZXIgdGhlIEFuaW1hdGlvbnMga2V5IGluIHRoZSBUcmFja2VyIE1hcC5cclxuICAgICogQHBhcmFtcyBkZXNjcmlwdGlvbiAgICAgIFxyXG4gICAgKiAgLSBvcHRpb25zOiB7T2JqZWN0fSBUaGUgYW5pbWF0aW9uIHNlcXVlbmNlIG9wdGlvbnMuXHJcbiAgICAqIEBnbG9iYWwgbm9cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gdHJhY2tBbmltYXRpb24ob3B0aW9ucykge1xuXG5cdFx0XHR2YXIgZGF0YSA9IHt9O1xuXHRcdFx0dmFyIGFuaW1hdGlvbnMgPSB0aGlzLnRyYWNrZXIuZ2V0KFwiQW5pbWF0aW9uc1wiKTtcblx0XHRcdGFuaW1hdGlvbnMuc2V0KG9wdGlvbnMuZWxlbWVudCwgZGF0YSk7XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiBcInVwZGF0ZVRyYW5zaXRpb25SZWNvcmRcIixcblxuXHRcdC8qKlxyXG4gICAgKiBAdXBkYXRlVHJhbnNpdGlvblJlY29yZCBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAcGFyYW1zIHtPYmplY3QsIE9iamVjdH1cclxuICAgICogQGRlc2NyaXB0aW9uIEluc2VydHMgYWRkaXRpb25hbCB0cmFuc2l0aW9uZWQgcHJvcGVydGllcyAvIHN0eWxlIHJ1bGVzIHNldCBpbnRvIGFuIGVsZW1lbnQncyByZWNvcmQuXHJcbiAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICogIC0gcmVjb3JkOiB7T2JqZWN0fSBUaGUgdHJhbnNpdGlvbiByZWNvcmQgZnJvbSB0aGUgVHJhY2tlciBNYXAuXHJcbiAgICAqICAtIG9wdGlvbnM6IHtPYmplY3R9IFRoZSB0cmFuc2l0aW9uIHNlcXVlbmNlIG9wdGlvbnMuXHJcbiAgICAqIEBnbG9iYWwgbm9cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gdXBkYXRlVHJhbnNpdGlvblJlY29yZChyZWNvcmQsIG9wdGlvbnMpIHtcblxuXHRcdFx0dmFyIHByb3BlcnRpZXMgPSBBcnJheS5pc0FycmF5KG9wdGlvbnMucHJvcGVydGllcykgPyBbXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KG9wdGlvbnMucHJvcGVydGllcykpIDogW29wdGlvbnMucHJvcGVydGllc107XG5cdFx0XHRwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5maWx0ZXIoZnVuY3Rpb24gKHByb3BlcnR5KSB7XG5cdFx0XHRcdHJldHVybiByZWNvcmQucHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5KSA9PT0gLTE7XG5cdFx0XHR9KTtcblx0XHRcdHJlY29yZC5wcm9wZXJ0aWVzID0gW10uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShyZWNvcmQucHJvcGVydGllcyksIF90b0NvbnN1bWFibGVBcnJheShwcm9wZXJ0aWVzKSk7XG5cblx0XHRcdGlmIChvcHRpb25zLnNldFN0eWxlcyAmJiBvcHRpb25zLnNldFN0eWxlcy5iZWZvcmUpIHtcblx0XHRcdFx0aWYgKCFyZWNvcmQuc3R5bGVzKSB7XG5cdFx0XHRcdFx0cmVjb3JkLnN0eWxlcyA9IHt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdE9iamVjdC5rZXlzKG9wdGlvbnMuc2V0U3R5bGVzLmJlZm9yZSkuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcblx0XHRcdFx0XHRyZWNvcmQuc3R5bGVzW3Byb3BlcnR5XSA9IG9wdGlvbnMuc2V0U3R5bGVzLmJlZm9yZVtwcm9wZXJ0eV07XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogXCJwYXVzZVwiLFxuXG5cdFx0LyoqXHJcbiAgICAqIEBwYXVzZSBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAZGVzY3JpcHRpb24gSXRlcmF0ZXMgdGhyb3VnaCBldmVyeSBzdG9yZWQgZWxlbWVudCBpbiB0aGUgVHJhY2tlciBhbmQgc2V0cyBpdHMgQ1NTIGFwcHJvcHJpYXRlbHkgdG8gZWZmZWN0aXZlbHkgcGF1c2UgYSBzZXF1ZW5jZS5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKi9cblxuXHRcdHZhbHVlOiBmdW5jdGlvbiBwYXVzZSgpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cblx0XHRcdHZhciB0cmFuc2l0aW9ucyA9IHRoaXMudHJhY2tlci5nZXQoXCJUcmFuc2l0aW9uc1wiKTtcblx0XHRcdHZhciB0cmFuc2l0aW9uRWxlbWVudHMgPSB0cmFuc2l0aW9ucy5rZXlzKCk7XG5cdFx0XHR2YXIgYW5pbWF0aW9ucyA9IHRoaXMudHJhY2tlci5nZXQoXCJBbmltYXRpb25zXCIpO1xuXHRcdFx0dmFyIGFuaW1hdGlvbkVsZW1lbnRzID0gYW5pbWF0aW9ucy5rZXlzKCk7XG5cblx0XHRcdHdoaWxlICh0cnVlKSB7XG5cblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBhbmltYXRpb25FbGVtZW50cy5uZXh0KCksXG5cdFx0XHRcdCAgICBydWxlID0ge307XG5cdFx0XHRcdGlmIChlbGVtZW50LmRvbmUpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJ1bGVbdGhpcy5wcmVmaXguZ2V0UHJlZml4KFwiYW5pbWF0aW9uLXBsYXktc3RhdGVcIildID0gXCJwYXVzZWRcIjtcblx0XHRcdFx0dGhpcy5jc3NVdGlscy5zZXRTdHlsZXMoZWxlbWVudC52YWx1ZSwgcnVsZSk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBfbG9vcCA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHR2YXIgZWxlbWVudCA9IHRyYW5zaXRpb25FbGVtZW50cy5uZXh0KCksXG5cdFx0XHRcdCAgICByZWNvcmQgPSB1bmRlZmluZWQsXG5cdFx0XHRcdCAgICBydWxlID0ge307XG5cdFx0XHRcdGlmIChlbGVtZW50LmRvbmUpIHtcblx0XHRcdFx0XHRyZXR1cm4gXCJicmVha1wiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVjb3JkID0gdHJhbnNpdGlvbnMuZ2V0KGVsZW1lbnQudmFsdWUpO1xuXHRcdFx0XHRyZWNvcmQucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuXHRcdFx0XHRcdHZhciBydWxlID0gX3RoaXMuY3NzVXRpbHMuZ2V0U3R5bGVzKGVsZW1lbnQudmFsdWUsIHByb3BlcnR5KTtcblx0XHRcdFx0XHRfdGhpcy5jc3NVdGlscy5zZXRTdHlsZXMoZWxlbWVudC52YWx1ZSwgcnVsZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJ1bGUgPSB7fTtcblx0XHRcdFx0cnVsZVtfdGhpcy5wcmVmaXguZ2V0UHJlZml4KFwidHJhbnNpdGlvblwiKV0gPSBcIm5vbmVcIjtcblx0XHRcdFx0X3RoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKGVsZW1lbnQudmFsdWUsIHJ1bGUpO1xuXHRcdFx0fTtcblxuXHRcdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdFx0dmFyIF9yZXQgPSBfbG9vcCgpO1xuXG5cdFx0XHRcdGlmIChfcmV0ID09PSBcImJyZWFrXCIpIGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogXCJwbGF5XCIsXG5cblx0XHQvKipcclxuICAgICogQHBsYXkgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQGRlc2NyaXB0aW9uIEl0ZXJhdGVzIHRocm91Z2ggZXZlcnkgc3RvcmVkIGVsZW1lbnQgaW4gdGhlIFRyYWNrZXIgYW5kIHNldHMgQ1NTIHN0eWxlIHJ1bGVzIHRvIGNvbnRpbnVlIGEgcGF1c2VkIHNlcXVlbmNlLlxyXG4gICAgKiBAZ2xvYmFsIG5vXHJcbiAgICAqL1xuXG5cdFx0dmFsdWU6IGZ1bmN0aW9uIHBsYXkoKSB7XG5cdFx0XHR2YXIgX3RoaXMyID0gdGhpcztcblxuXHRcdFx0dmFyIHRyYW5zaXRpb25zID0gdGhpcy50cmFja2VyLmdldChcIlRyYW5zaXRpb25zXCIpO1xuXHRcdFx0dmFyIHRyYW5zaXRpb25FbGVtZW50cyA9IHRyYW5zaXRpb25zLmtleXMoKTtcblx0XHRcdHZhciBhbmltYXRpb25zID0gdGhpcy50cmFja2VyLmdldChcIkFuaW1hdGlvbnNcIik7XG5cdFx0XHR2YXIgYW5pbWF0aW9uRWxlbWVudHMgPSBhbmltYXRpb25zLmtleXMoKTtcblxuXHRcdFx0d2hpbGUgKHRydWUpIHtcblxuXHRcdFx0XHR2YXIgZWxlbWVudCA9IGFuaW1hdGlvbkVsZW1lbnRzLm5leHQoKSxcblx0XHRcdFx0ICAgIHJ1bGUgPSB7fTtcblx0XHRcdFx0aWYgKGVsZW1lbnQuZG9uZSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cnVsZVt0aGlzLnByZWZpeC5nZXRQcmVmaXgoXCJhbmltYXRpb24tcGxheS1zdGF0ZVwiKV0gPSBcInJ1bm5pbmdcIjtcblx0XHRcdFx0dGhpcy5jc3NVdGlscy5zZXRTdHlsZXMoZWxlbWVudC52YWx1ZSwgcnVsZSk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBfbG9vcDIgPSBmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0dmFyIGVsZW1lbnQgPSB0cmFuc2l0aW9uRWxlbWVudHMubmV4dCgpO1xuXHRcdFx0XHRpZiAoZWxlbWVudC5kb25lKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwiYnJlYWtcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciByZWNvcmQgPSB0cmFuc2l0aW9ucy5nZXQoZWxlbWVudC52YWx1ZSk7XG5cdFx0XHRcdF90aGlzMi5jc3NVdGlscy5zZXRTdHlsZXMoZWxlbWVudC52YWx1ZSwgcmVjb3JkLnRyYW5zaXRpb25TdHlsZXMpO1xuXHRcdFx0XHRpZiAocmVjb3JkLmNsYXNzVHJpZ2dlcmVkKSB7XG5cdFx0XHRcdFx0cmVjb3JkLnByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuXHRcdFx0XHRcdFx0ZWxlbWVudC52YWx1ZS5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyZWNvcmQuc3R5bGVzKSB7XG5cdFx0XHRcdFx0X3RoaXMyLmNzc1V0aWxzLnNldFN0eWxlcyhlbGVtZW50LnZhbHVlLCByZWNvcmQuc3R5bGVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdFx0dmFyIF9yZXQyID0gX2xvb3AyKCk7XG5cblx0XHRcdFx0aWYgKF9yZXQyID09PSBcImJyZWFrXCIpIGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fSwge1xuXHRcdGtleTogXCJyZW1vdmVcIixcblxuXHRcdC8qKlxyXG4gICAgKiBAcmVtb3ZlIGZ1bmN0aW9uXHJcbiAgICAqXHJcbiAgICAqIEBwYXJhbXMge1N0cmluZywgSFRNTEVsZW1lbnR9XHJcbiAgICAqIEBkZXNjcmlwdGlvbiBSZW1vdmVzIGEgc3RvcmVkIGVsZW1lbnQgZnJvbSB0aGUgVHJhY2tlciBvbmNlIGEgc2VxdWVuY2UgaXMgY29tcGxldGUuXHJcbiAgICAqIEBwYXJhbXMgZGVzY3JpcHRpb24gICAgICBcclxuICAgICogIC0gdHlwZToge1N0cmluZ30gVHJhY2tlciBtYXAga2V5LCBlaXRoZXIgVHJhbnNpdGlvbnMgb3IgQW5pbWF0aW9ucy5cclxuICAgICogIC0gZWxlbWVudDoge0hUTUxFbGVtZW50fSBUaGUgZWxlbWVudCB0byByZW1vdmUgZnJvbSB0aGUgVHJhY2tlci5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKi9cblxuXHRcdHZhbHVlOiBmdW5jdGlvbiByZW1vdmUodHlwZSwgZWxlbWVudCkge1xuXHRcdFx0dGhpcy50cmFja2VyLmdldCh0eXBlKVtcImRlbGV0ZVwiXShlbGVtZW50KTtcblx0XHR9XG5cdH1dKTtcblxuXHRyZXR1cm4gVHJhY2tlcjtcbn0pKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gVHJhY2tlcjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuXHR2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSAoZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyoqXHJcbiAgKiBAVHJhbnNpdGlvbiBDbGFzc1xyXG4gICpcclxuICAqIEBkZXNjcmlwdGlvbiBQcm9taXNlIGJhc2VkIHRyYW5zaXRpb24gaGFuZGxlciB0aGF0IHJlc29sdmVzIHdoZW4gYWxsIHRyYW5zaXRpb25zIG9uIGFuIGVsZW1lbnQgYXJlIGNvbXBsZXRlLlxyXG4gICogQHJldHVybnMge1Jlc29sdmVkIFByb21pc2V9XHJcbiAgKi9cblxudmFyIFRyYW5zaXRpb24gPSAoZnVuY3Rpb24gKCkge1xuXG5cdC8qKlxyXG4gICAqIEBjb25zdHJ1Y3RvciBmdW5jdGlvblxyXG4gICAqXHJcbiAgICogQHBhcmFtcyB7T2JqZWN0LCBDbGFzcywgQ2xhc3MsIENsYXNzLCBDbGFzcywgT2JqZWN0fSAgXHJcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBuZXcgdHJhbnNpdGlvbiBzZXF1ZW5jZS4gICAgXHJcbiAqIEBwYXJhbXMgZGVzY3JpcHRpb25cclxuIC0gb3B0aW9ucyB7T2JqZWN0fSBUcmFuc2l0aW9uIG9wdGlvbnMuXHJcbiBcdC0gZWxlbWVudCB7SFRNTEVsZW1lbnR9IFRoZSBlbGVtZW50IHRvIHNldCB0aGUgdHJhbnNpdGlvbiBvbi5cclxuIFx0LSBwcm9wZXJ0aWVzIHtTdHJpbmcgLyBBcnJheX0gQSBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyBvZiBDU1MgcHJvcGVydGllcyB0aGF0IGFyZSBiZWluZyB0cmFuc2l0aW9uZWQuXHJcbiBcdC0gc2V0U3R5bGVzIHtPYmplY3R9IFN0eWxlcyB0byBiZSBzZXQgYmVmb3JlIC8gYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXHJcbiBcdFx0LSBiZWZvcmUge09iamVjdH0gT2JqZWN0IG9mIENTUyBwcm9wZXJ0eSAvIHZhbHVlIHBhaXJzIHRvIGJlIHNldCBiZWZvcmUgdGhlIHRyYW5zaXRpb24uXHJcbiBcdFx0LSBhZnRlciB7T2JqZWN0fSBPYmplY3Qgb2YgQ1NTIHByb3BlcnR5IC8gdmFsdWUgcGFpcnMgdG8gYmUgc2V0IGFmdGVyIHRoZSB0cmFuc2l0aW9uLlxyXG4gXHQtIGFkZENsYXNzIHtPYmplY3R9IE9iamVjdCBvZiBjbGFzc25hbWVzIHRvIGJlIHNldCBiZWZvcmUgLyBhZnRlciB0aGUgdHJhbnNpdGlvbi5cclxuIFx0XHQtIGJlZm9yZSB7U3RyaW5nfSBDbGFzc25hbWUgdG8gc2V0IGJlZm9yZSB0aGUgdHJhbnNpdGlvbi5cclxuIFx0XHQtIGFmdGVyIHtTdHJpbmd9IENsYXNzbmFtZSB0byBzZXQgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uXHJcbiBcdC0gcmVtb3ZlQ2xhc3Mge09iamVjdH0gT2JqZWN0IG9mIGNsYXNzbmFtZXMgdG8gYmUgcmVtb3ZlZCBiZWZvcmUgLyBhZnRlciB0aGUgdHJhbnNpdGlvbi5cclxuIFx0XHQtIGJlZm9yZSB7U3RyaW5nfSBDbGFzc25hbWUgdG8gYmUgcmVtb3ZlZCBiZWZvcmUgdGhlIHRyYW5zaXRpb24uXHJcbiBcdFx0LSBhZnRlciB7U3RyaW5nfSBDbGFzc25hbWUgdG8gYmUgcmVtb3ZlZCBhZnRlciB0aGUgdHJhbnNpdGlvbi5cclxuIC0gRG9tVXRpbHMge0NsYXNzfSBEb20gdXRpbGl0eSBjbGFzcy5cclxuIC0gUHJlZml4IHtDbGFzc30gUHJlZml4IGNsYXNzLlxyXG4gLSBDc3NVdGlscyB7Q2xhc3N9IENTUyBVdGlsaXRpZXMgY2xhc3MuXHJcbiAtIFByb21pc2Uge0NsYXNzfSBQcm9taXNlIGNsYXNzLlxyXG4gLSBUcmFja2VyIHtPYmplY3R9IE9iamVjdCB0aGF0IHRyYWNrcyBhbmQgbW9uaXRvcnMgc2VxdWVuY2VzLlxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgKi9cblxuXHRmdW5jdGlvbiBUcmFuc2l0aW9uKG9wdGlvbnMsIERvbVV0aWxzLCBQcmVmaXgsIENzc1V0aWxzLCBQcm9taXNlLCBUcmFja2VyKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblxuXHRcdF9jbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc2l0aW9uKTtcblxuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5kb21VdGlscyA9IG5ldyBEb21VdGlscygpO1xuXHRcdHRoaXMucHJlZml4ID0gbmV3IFByZWZpeCgpLmdldFByZWZpeChcInRyYW5zaXRpb25lbmRcIik7XG5cdFx0dGhpcy5jc3NVdGlscyA9IG5ldyBDc3NVdGlscygpO1xuXHRcdHRoaXMub25UcmFuc2l0aW9uRW5kID0gdGhpcy50cmFuc2l0aW9uRW5kLmJpbmQodGhpcyk7XG5cdFx0dGhpcy50b3RhbHRyYW5zaXRpb25zID0gQXJyYXkuaXNBcnJheShvcHRpb25zLnByb3BlcnRpZXMpID8gb3B0aW9ucy5wcm9wZXJ0aWVzLmxlbmd0aCA6IDE7XG5cdFx0dGhpcy50cmFuc2l0aW9uZW5kQ291bnQgPSAwO1xuXHRcdHRoaXMudHJhY2tlciA9IFRyYWNrZXI7XG5cblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0X3RoaXMucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0XHRfdGhpcy5yZWplY3QgPSByZWplY3Q7XG5cdFx0XHRfdGhpcy5hbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShfdGhpcy50cmFuc2l0aW9uU3RhcnQuYmluZChfdGhpcykpO1xuXHRcdH0pO1xuXHR9XG5cblx0X2NyZWF0ZUNsYXNzKFRyYW5zaXRpb24sIFt7XG5cdFx0a2V5OiBcInRyYW5zaXRpb25TdGFydFwiLFxuXG5cdFx0LyoqXHJcbiAgICAqIEB0cmFuc2l0aW9uU3RhcnQgZnVuY3Rpb25cclxuICAgICpcclxuICAgICogQGRlc2NyaXB0aW9uIFNldHMgY2xhc3NuYW1lcyAvIHN0eWxlIHJ1bGVzIHRvIHRyaWdnZXIgdGhlIHRyYW5zaXRpb24uXHJcbiAgICAqIEBnbG9iYWwgbm9cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gdHJhbnNpdGlvblN0YXJ0KCkge1xuXG5cdFx0XHR2YXIgb3B0cyA9IHRoaXMub3B0aW9ucztcblx0XHRcdG9wdHMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHRoaXMucHJlZml4LCB0aGlzLm9uVHJhbnNpdGlvbkVuZCwgZmFsc2UpO1xuXG5cdFx0XHRpZiAob3B0cy5zZXRTdHlsZXMgJiYgb3B0cy5zZXRTdHlsZXMuYmVmb3JlKSB7XG5cdFx0XHRcdHRoaXMuY3NzVXRpbHMuc2V0U3R5bGVzKG9wdHMuZWxlbWVudCwgb3B0cy5zZXRTdHlsZXMuYmVmb3JlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdHMucmVtb3ZlQ2xhc3MgJiYgb3B0cy5yZW1vdmVDbGFzcy5iZWZvcmUpIHtcblx0XHRcdFx0dGhpcy5kb21VdGlscy5zZXRDbGFzcyhvcHRzLmVsZW1lbnQsIG9wdHMucmVtb3ZlQ2xhc3MuYmVmb3JlLCBmYWxzZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRzLmFkZENsYXNzICYmIG9wdHMuYWRkQ2xhc3MuYmVmb3JlKSB7XG5cdFx0XHRcdHRoaXMuZG9tVXRpbHMuc2V0Q2xhc3Mob3B0cy5lbGVtZW50LCBvcHRzLmFkZENsYXNzLmJlZm9yZSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LCB7XG5cdFx0a2V5OiBcInRyYW5zaXRpb25FbmRcIixcblxuXHRcdC8qKlxyXG4gICAgKiBAdHJhbnNpdGlvbkVuZCBmdW5jdGlvblxyXG4gICAgKlxyXG4gICAgKiBAZGVzY3JpcHRpb24gU2V0cyBjbGFzc25hbWVzIC8gc3R5bGUgcnVsZXMgYWZ0ZXIgYWxsIHRyYW5zaXRpb25zIGhhdmUgb2NjdXJyZWQgYW5kIHJlbW92ZXMgdGhlIGVsZW1lbnQgZnJvbSB0aGUgdHJhY2tlci5cclxuICAgICogQGdsb2JhbCBub1xyXG4gICAgKiBAcmV0dXJucyB7UmVzb2x2ZWQgUHJvbWlzZX1cclxuICAgICovXG5cblx0XHR2YWx1ZTogZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcblxuXHRcdFx0dmFyIG9wdHMgPSB0aGlzLm9wdGlvbnM7XG5cdFx0XHR0aGlzLnRyYW5zaXRpb25lbmRDb3VudCsrO1xuXG5cdFx0XHRpZiAodGhpcy50cmFuc2l0aW9uZW5kQ291bnQgPT09IHRoaXMudG90YWx0cmFuc2l0aW9ucykge1xuXG5cdFx0XHRcdG9wdHMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMucHJlZml4LCB0aGlzLm9uVHJhbnNpdGlvbkVuZCwgZmFsc2UpO1xuXHRcdFx0XHRjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcblxuXHRcdFx0XHRpZiAob3B0cy5zZXRTdHlsZXMgJiYgb3B0cy5zZXRTdHlsZXMuYWZ0ZXIpIHtcblx0XHRcdFx0XHR0aGlzLmNzc1V0aWxzLnNldFN0eWxlcyhvcHRzLmVsZW1lbnQsIG9wdHMuc2V0U3R5bGVzLmFmdGVyKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvcHRzLnJlbW92ZUNsYXNzICYmIG9wdHMucmVtb3ZlQ2xhc3MuYWZ0ZXIpIHtcblx0XHRcdFx0XHR0aGlzLmRvbVV0aWxzLnNldENsYXNzKG9wdHMuZWxlbWVudCwgb3B0cy5yZW1vdmVDbGFzcy5hZnRlciwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG9wdHMuYWRkQ2xhc3MgJiYgb3B0cy5hZGRDbGFzcy5hZnRlcikge1xuXHRcdFx0XHRcdHRoaXMuZG9tVXRpbHMuc2V0Q2xhc3Mob3B0cy5lbGVtZW50LCBvcHRzLmFkZENsYXNzLmFmdGVyLCB0cnVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMudHJhY2tlci5yZW1vdmUoXCJUcmFuc2l0aW9uc1wiLCBvcHRzLmVsZW1lbnQpO1xuXHRcdFx0XHR0aGlzLnJlc29sdmUob3B0cy5lbGVtZW50KTtcblx0XHRcdH1cblx0XHR9XG5cdH1dKTtcblxuXHRyZXR1cm4gVHJhbnNpdGlvbjtcbn0pKCk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gVHJhbnNpdGlvbjtcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1tcImRlZmF1bHRcIl07Il19
