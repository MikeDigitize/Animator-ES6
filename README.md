# Animator
Animator is an ES6 animation utility belt that allows you to easily create and sequence CSS transitions and animations programatically. See the [WIKI](https://github.com/MikeDigitize/Animator-ES6/wiki) for the API guide.

## Features
* CSS transition / keyframe animation creator
* Promise based animation / transition sequencer
* Style class creator
* Prefix handler
* Pause / Play sequences
* Class / style manipulation

## Usage
To run the demo download the zip and run
```unix
npm install
```
Animator uses the CSSOM for some tasks which isn't supported from the file:/// protocol in Chrome, so be sure to run the files from a server. Once the modules are installed run
```unix
npm start
```
and go to <code>http://localhost:1337</code> to see the demo. To use, just include Animator before the closing body tag.
```html
<script src="animator.min.js"></script>
```

## Browser Support
Animator can detect browser support based on support for CSS animations / transitions and CSSOM manipulation. Animator uses Jake Archibald's excellent [ES6 Promise](https://github.com/jakearchibald/es6-promise) polyfill and Paul Miller's fantastic [ES6-shim](https://github.com/paulmillr/es6-shim/) for other ES6 features like Map and Array.from, so just by using Animator you'll have access these and other ES6 goodies.
```javascript
if(!Animator.isSupported) {
    // handle fallbacks here
}
```

## Creating Sequences
Animator has three methods to use to create a sequence - <code>animation</code> for keyframe animations, <code>transition</code> for CSS transitions and <code>combo</code> for combinations of the two that need to run simultaneously. Each of these return a <code>Promise</code> that resolves when all transitions / animations are complete, so they can be easily chained together to create complex sequences. Transitions and animations can be triggered either by setting styles directly on the element or adding / removing classes. See the [API guide](https://github.com/MikeDigitize/Animator-ES6/wiki) for more details.

```css
/**
 *  Some basic CSS setup, omitting prefixes for brevity
 */

.text { transition: transform 4s ease-out; }
.tran { transform: scale(2) }
.anim { animation : shrink 2s 2 }

@keyframes blink {
    0% {
    	opacity: 1
    }
    25% {
    	opacity: 0
    }
    50% {
    	opacity: 1
    }
    75% {
    	opacity: 0
    }
    100% {
    	opacity: 1
    }
}
``` 

```javascript
var p = document.querySelectorAll(".text");

/**
  * Assign the transition to a variable to allow chaining 
  */
 
var sequence = Animator.combo([
	Animator.transition({
	    element : p,
	    properties : Animator.getPrefix("transform"),
	    addClass : {
	        before : "tran"
	    }
	}),
	Animator.animation({
	    element : p,
	    addClass : {
	        before : "anim"
	    }
	})
]);       

sequence
    .then(function(elements) {
    
    /**
      * Any sequenced elements are passed back into the callback.
      *	Return a transition / animation / sequencer to continue the chain
      */
    	return Animator.transition({
			element : elements[0],
			properties : Animator.getPrefix("transform"),
			removeClass : {
	        		before : "tran"
	    		}
		});
    })
    .then(function() {
    	// continue or finish!
    })
    .catch(function() {
        // handle errors here!
    });

```

## Playing / Pausing Sequences

Sequences can be paused at any point by calling
```javascript
Animator.pause();
```

and resumed by
```javascript
Animator.play();
```

## Defining Keyframe Animations

Quickly create keyframe animations with Animator's <code>createAnimation</code> method. All browser prefixing is handled internally.

```javascript
/**
  * Define the keyframe animation with any syntax e.g. from, to or % based
  * and an optional class to use to trigger the animation.
  */

var ninjaRules = {};
ninjaRules[Animator.getPrefix("animation")] = "ninjaAnimation 0.3s infinite";

Animator.createAnimation({
	name : "ninjaAnimation",
	animation : { 
		"0%, 24.9%, 100%" : { "background-position" : "0px" }, 
		"25%, 49.9%" : { "background-position" : "-250px" },
		"50%, 74.9%" : { "background-position" : "-500px" },
		"75%, 99%" : { "background-position" : "-750px" }
	},
	animationClass : {
		name : "ninjaAnimation",
		rules : ninjaRules
	}
});	

/**
  * Trigger the animation directly or use it in a sequence
  */

Animator.addClass(p, "ninjaAnimation");

/**
  * OR, omit the `animationClass` property in the createAnimation param 
  * and set the style rules directly as part of a sequence definition
  */

Animator.animation({
	element : p,
	setStyles : {
		before : ninjaRules
	}
});
```

## Defining Transitions

Defining single or multiple CSS transitions against an element or Nodelist within Animator is made quick and painless by the powerful <code>createTransition</code> method. See the [API guide](https://github.com/MikeDigitize/Animator-ES6/wiki) for an in depth description.

```javascript
Animator.createTransition({
	element : p,
	properties : Animator.getPrefix("transform"),
	duration : "250ms",
	easing : "ease-in",
	delay : "50ms"
});
```

```css
/**
  * The above is the equivalent of this (prefixes handled automatically)
  */

.text { transition : transform 250ms ease-in 50ms }  
```

For a full list and description of each method and property within Animator take a look at the [WIKI](https://github.com/MikeDigitize/Animator-ES6/wiki).

## Licence

The MIT License (MIT)

Copyright (c) 2015 Michael Chadwick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
