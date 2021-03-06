The prototype / test repo for [https://github.com/MikeDigitize/Animator](https://github.com/MikeDigitize/Animator)

# Animator
Animator is an ES6 animation utility belt to help you quickly and easily create and sequence CSS transitions and animations programatically. Use it whenever there's a need to animate in the browser, whether it be for every day needs like creating rotating banners, giving visual feedback to user interactions, or for complex animation sequences whose values are calculated dynamically. For a full API breakdown see the [WIKI](https://github.com/MikeDigitize/Animator-ES6/wiki).

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
Animator can detect browser support based on support for CSS animations / transitions and CSSOM manipulation. Animator uses an edited version of Paul Miller's [ES6-shim](https://github.com/paulmillr/es6-shim/) to polyfill Map and Promise if either aren't available and likewise Mathias Bynen's [String-includes](https://github.com/mathiasbynens/String.prototype.includes) and [Array.from](https://github.com/mathiasbynens/Array.from) polyfills.
```javascript
if(!Animator.isSupported()) {
    // handle fallbacks here.
}
```

## Creating Sequences
Animator has three methods to use to create a sequence - <code>animation</code> for keyframe animations, <code>transition</code> for CSS transitions and <code>combo</code> for combinations of the two that need to run simultaneously. Each of these return a <code>Promise</code> that resolves when all transitions / animations are complete, so they can be easily chained together to create complex sequences. Transitions and animations can be triggered either by setting styles directly on the element or adding / removing classes. See the [API guide](https://github.com/MikeDigitize/Animator-ES6/wiki/Animator-API-Guide) for more details.

```css
/**
 *  Some basic CSS setup, omitting prefixes for brevity.
 */

.text { transition: transform 4s ease-out; }
.enlarge { transform: scale(2) }
.blink { animation : blink 2s 2 }

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
  * Combine an animation and transition together with the combo method.
  * Assign the combo to a variable to allow chaining.
  */
 
var sequence = Animator.combo([
	Animator.transition({
	    element : p,
	    properties : Animator.getPrefix("transform"),
	    addClass : {
	        before : "enlarge"
	    }
	}),
	Animator.animation({
	    element : p,
	    addClass : {
	        before : "blink"
	    }
	})
]);       

sequence
    .then(function(elements) {
    
    /**
      * Any sequenced elements are passed into the next callback.
      *	Return a transition / animation / combo to continue the chain.
      */
    	return Animator.transition({
			element : elements[0],
			properties : Animator.getPrefix("transform"),
			removeClass : {
	        		before : "enlarge"
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

Quickly define keyframe animations with Animator's <code>createAnimation</code> method. It has an optional style class creator to use to create an associated class to trigger an animation. Animator handles styles as an object with CSS property name / value pairs. There's a handy method called <code>createCSSRule()</code> that converts property names / values into objects for you.

```javascript
/**
  * Create a class to trigger the animation and style rules for the class. 
  * The `createCSSRule` method returns an object of CSS property / value pairs.
  */

var ninjaRules = Animator.createCSSRule(Animator.getPrefix("animation"), "ninjaAnimation 0.3s infinite");
// e.g. returns { "animation" : "ninjaAnimation 0.3s infinite" }.

/**
  * Define the keyframe animation with either syntax e.g. from, to or % based.
  */
  
Animator.createAnimation({
	name : "ninjaAnimation",
	animation : { 
		"0%, 24.9%, 100%" : { "background-position" : "0px" }, 
		"25%, 49.9%" : { "background-position" : "-250px" },
		"50%, 74.9%" : { "background-position" : "-500px" },
		"75%, 99%" : { "background-position" : "-750px" }
	},
	
	/**
  	  * Define an (optional) class to use to trigger the animation.
  	  * Pass in the rules created with the `createCSSrule` method above.
  	  */
  	  
	animationClass : {
		name : "ninjaAnimation",
		rules : ninjaRules
	}
});	

/**
  * Trigger the animation by adding the class created directly to the element.
  */

Animator.addClass(p, "ninjaAnimation");

/**
  * Or adding the class as part of a sequence.
  */
  
Animator.animation({
	element : p,
	addClass : {
		before : "ninjaAnimation"
	}
});

/**
  * OR, omit the `animationClass` property in the `createAnimation` options object 
  * And set the style rules directly.
  */

Animator.setStyles(p, ninjaRules);

/**
  * Or set the style rule as part of a sequence.
  */

Animator.animation({
	element : p,
	setStyles : {
		before : ninjaRules
	}
});
```

## Defining Transitions

Defining single or multiple CSS transitions against an element or Nodelist within Animator is made quick and painless by the <code>createTransition</code> method. See the [API guide](https://github.com/MikeDigitize/Animator-ES6/wiki/Animator-API-Guide) for an in depth description.

```javascript
Animator.createTransition({
	element : p,
	properties : [Animator.getPrefix("transform"), "opacity"],
	duration : "250ms",
	easing : ["ease-in", "linear"],
	delay : "50ms"
});
```

```css
/**
  * The above is the equivalent of this (prefixes handled automatically).
  */

.text { transition : transform 250ms ease-in 50ms, opacity 250ms linear 50ms }  
```
## All Methods
For an in-depth description with examples of each Animator method visit the [WIKI](https://github.com/MikeDigitize/Animator-ES6/wiki) page.

## Create A Style Class
```javascript
   /**
     * @createClass function
     *
     * @params {String, Object}
     * @description Creates a CSS class from a classname and an object of CSS property / value pairs.
     */
     
Animator.createClass(params);
```

## Delete A Style Class
```javascript
   /**
     * @deleteClass function
     *
     * @params {String}
     * @description Deletes a CSS class from Animator's stylesheet.
     */
     
Animator.deleteClass(params);
```

## Getting A Prefix
```javascript
   /**
     * @getPrefix function
     *
     * @params {String}
     * @description Returns a prefixed CSS property or DOM event name.
     * @return {String}
     */
     
Animator.getPrefix(params);
```

## Setting Styles
```javascript
   /**
     * @setStyles function
     *
     * @params {HTMLElement, String / Array}
     * @description Sets properties / values on an element's CSSStyleDeclaration.
     */
     
Animator.setStyles(params);
```

## Getting Styles
```javascript
   /**
     * @getStyles function
     *
     * @params {HTMLElement, Object}
     * @description Return an object of CSS properties / values.
     * @return {Object}
     */
     
Animator.getStyles(params);
```

## Create Style Rule Object
```javascript
   /**
     * @createCSSRule function
     *
     * @params {String / Array, String / Array}
     * @description Returns an object of CSS property / value pairs.
     * @returns {Object}
     */
     
Animator.createCSSRule(params);
```

## Add Class
```javascript
   /**
     * @addClass function
     *
     * @params {HTMLElement / Nodelist, String / Array}
     * @description Sets a class(es) on an element.
     */
     
Animator.addClass(params);
```

## Remove Class
```javascript
    /**
     * @removeClass function
     *
     * @params {HTMLElement / Nodelist, String / Array}
     * @description Removes a class(es) from an element.
     */
     
Animator.removeClass(params);
```

## Create CSS Transition 
```javascript
   /**
     * @createTransition function
     *
     * @params {Object}
     * @description Creates a CSS transition definition.
     */

Animator.createTransition(params);
```

## Create CSS Keyframe Animation 
```javascript
   /**
     * @createAnimation function
     *
     * @params {Object}
     * @description Creates a CSS keyframe animation definition.
     */

Animator.createAnimation(params);
```

## Create Transition Sequence
```javascript
   /**
     * @transition function
     *
     * @params {Object}
     * @description Creates a transition sequence.
     * @returns {Promise}
     */

Animator.transition(params);
```

## Create Animation Sequence
```javascript
   /**
     * @animation function
     *
     * @params {Object}
     * @description Creates an animation sequence.
     * @returns {Promise}
     */

Animator.animation(params);
```

## Create Combo of Transition / Animation Sequences
```javascript
   /**
     * @combo function
     *
     * @params {Object}
     * @description Creates an combination of sequence.
     * @returns {Promise}
     */

Animator.combo(params);
```

## Detect Browser Support
```javascript
   /**
     * @isSupported function
     *
     * @description Tests the browser for Animator support.
     * @returns {Boolean}
     */

Animator.isSupported();  
```

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
