/**
  * @Animation Class
  *
  * @description Promise based animation handler that resolves when animations triggered on an element are complete.
  * @returns {Resolved Promise}
  */

class Animation {

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

	constructor(options, DomUtils, Prefix, CssUtils, Promise, Tracker) {

		this.options = options;
		this.domUtils = new DomUtils();
		this.cssUtils = new CssUtils();
		this.prefix = new Prefix().getPrefix("animationend");
		this.onAnimationEnd = this.animationEnd.bind(this);
		this.tracker = Tracker;

		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			this.animationFrame = requestAnimationFrame(this.animationStart.bind(this));      
		});

	}

   /**
     * @animationStart function
     *
     * @description Sets classnames / style rules to trigger the animation.
     * @global no
     */

	animationStart() {

		let opts = this.options;
		opts.element.addEventListener(this.prefix, this.onAnimationEnd, false);

		if(opts.setStyles && opts.setStyles.before) {
			this.cssUtils.setStyles(opts.element, opts.setStyles.before);
		}	

		if(opts.removeClass && opts.removeClass.before) {
			this.domUtils.setClass(opts.element, opts.removeClass.before, false);
		}

		if(opts.addClass && opts.addClass.before) {
			this.domUtils.setClass(opts.element, opts.addClass.before, true);	
		}		

	}

   /**
     * @animationEnd function
     *
     * @description Sets classnames / style rules after all animations have completed and removes the element from the tracker.
     * @global no
     * @returns {Resolved Promise}
     */

	animationEnd() {

		let opts = this.options;
		opts.element.removeEventListener(this.prefix, this.onAnimationEnd, false);
		cancelAnimationFrame(this.animationFrame);

		if(opts.setStyles && opts.setStyles.after) {
			this.cssUtils.setStyles(opts.element, opts.setStyles.after);
		}

		if(opts.removeClass && opts.removeClass.after) {
			this.domUtils.setClass(opts.element, opts.removeClass.after, false);
		}

		if(opts.addClass && opts.addClass.after) {
			this.domUtils.setClass(opts.element, opts.addClass.after, true);	
		}	

		this.tracker.remove("Animations", opts.element);
		this.resolve(opts.element);

	}

}

export default Animation;