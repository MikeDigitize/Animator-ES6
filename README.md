# Animator
Animator is an ES6 animation utility belt that allows you to create and sequence CSS transitions and animations together easily from script.

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
and go to <code>http://localhost:1337</code> to see the demo. To use Animator in your projects include Animator before the closing body tag.
```html
<script src="animator.min.js"></script>
```

## Browser Support
Animator can detect browser support based on support for CSS animations / transitions and CSSOM manipulation. Animator polyfills ES6's Promise and Map if the browser does not support them so these are available to use globally too.
```javascript
if(!Animator.isSupported) {
    // handle fallbacks here
}
```

## Creating Sequences
Animator has three methods to use to create a sequence - <code>animation</code>, <code>transition</code> and <code>combo</code>. Combo is used to handle combinations of transition and / or animation sequences that need to run simultaneously. Each of these return a <code>Promise</code> that resolves when all transitions / animations are complete, so they can be easily chained together to create complex sequences.

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
  * Assign the transition to a variable so we can chain 
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
    .then(function() {
    
    /**
      * Return a transition / animation / sequencer to continue the chain
      */
    	return Animator.transition({
		    element : p,
		    properties : Animator.getPrefix("transform"),
		    removeClass : {
		        before : "tran"
		    }
		})
    })
    .then(function() {
    	// finished!
    })
    .catch(function() {
        // handle errors here!
    });

```

