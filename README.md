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
Animator can detect browser support based on support for CSS animations / transitions and CSSOM manipulation. Animator polyfills Promise and Map if the browser does not suppor them so these are available to use globally too.
```javascript
if(!Animator.isSupported) {
    // handle fallbacks here
}
```

## Creating Sequences
Animator has three methods to use to create a sequence - <code>animation</code>, <code>transition</code> and <code>combo</code>. Combo is used to handle combinations of transition and / or animation sequences that need to run simultaneously. Each of these return a <code>Promise</code> that resolves when all transitions / animations are complete, so they can be easily chained together to create complex sequences.

### Transition 
```javascript
/**
 * ...
 * @param {Object} options. An object containing all transition details.
 * @param {Number} options.element. A HTMLElement / Nodelist to transition.
 * @param {String / Array} options.properties. The CSS properties to be transitioned.
 * @param [Object] options.setStyles (optional). 
 *  - An object containing CSS property / values to apply before / after the transition.
 *    @param [Object] options.setStyles.before. Styles to apply before the transition starts.
 *    @param [Object] options.setStyles.after. Styles to apply after the transition ends.
 * @param [Object] options.addClass (optional).
 *  - An object containing a classname or array of classnames to apply before / after the transition.
 *    @param [String / Array] options.addClass.before. Classnames to apply before the transition starts.
 *    @param [String / Array] options.addClass.after. Classnames to apply after the transition ends.
 * @param [Object] options.removeClass (optional).
 *  - An object containing a classname or array of classnames to remove before / after the transition.
 *    @param [String / Array] options.removeClass.before. Classnames to remove before the transition starts.
 *    @param [String / Array] options.removeClass.before. Classnames to apply after the transition ends. 
 * ...
 */
Animator.transition(description);
```

### Animation
<code>Animation</code> uses the same options object parameter as <code>Transition</code> but omits the <code>properties</code> property. A keyframe animation will resolve as a whole no matter how many properties are animated as opposed to a transition which resolves each transitioned property individually. As such there is no need to specify the animated properties when defining an animation sequence. 
```javascript
Animator.animation(description);
```

### Combo
<code>Combo</code> aggregates Animator sequences and runs them concurrently.
```javascript
/**
 * ...
 * @param {Array} An array of Transition and / or Animation sequences.
 * ...
 */
Animator.combo(description);
```



