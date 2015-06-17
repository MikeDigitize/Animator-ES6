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