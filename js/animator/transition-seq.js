/**
  * @Transition Class
  *
  * @description Promise based transition handler that resolves when all transitions on an element are complete.
  * @returns {Resolved Promise}
  */

class Transition {

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

	constructor(options, DomUtils, Prefix, CssUtils, Audio, Tracker) {

		this.options = options;
		this.domUtils = new DomUtils();
		this.prefix = new Prefix().getPrefix("transitionend");
		this.cssUtils = new CssUtils();
		this.onTransitionEnd = this.transitionEnd.bind(this);
		this.totaltransitions = Array.isArray(options.properties) ? options.properties.length : 1;
		this.transitionendCount = 0;
	    this.audio = Audio;
		this.tracker = Tracker;

		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			this.animationFrame = requestAnimationFrame(this.transitionStart.bind(this));      
		});

	}

   /**
     * @transitionStart function
     *
     * @description Sets classnames / style rules to trigger the transition.
     * @global no
     */

	transitionStart() {

		let opts = this.options;
	    if(opts.audio) {
		    this.audioTimer = new this.audio(opts.audio);
		    console.log("audio!", this.audioTimer);
	    }

		opts.element.addEventListener(this.prefix, this.onTransitionEnd, false);

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
     * @transitionEnd function
     *
     * @description Sets classnames / style rules after all transitions have occurred and removes the element from the tracker.
     * @global no
     * @returns {Resolved Promise}
     */

	transitionEnd(evt) {

	    evt.stopPropagation();

		let opts = this.options;
		this.transitionendCount++;

		if(this.transitionendCount === this.totaltransitions) {

			if(opts.audio) {
				this.audioTimer.cancel();
			}

			opts.element.removeEventListener(this.prefix, this.onTransitionEnd, false);
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

			this.tracker.remove("Transitions", opts.element);
			this.resolve(opts.element);

		}

	}

}

export default Transition;