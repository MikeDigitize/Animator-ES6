class Transition {

	constructor(options, DomUtils, Prefix, CssUtils, Promise, Tracker) {

		this.options = options;
		this.domUtils = new DomUtils();
		this.prefix = new Prefix().getPrefix("transitionend");
		this.cssUtils = new CssUtils();
		this.onTransitionEnd = this.callback.bind(this);
		this.totaltransitions = Array.isArray(options.properties) ? options.properties.length : 1;
		this.transitionendCount = 0;
		this.tracker = Tracker;

		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			this.animationFrame = requestAnimationFrame(this.startTransition.bind(this));      
		});

	}

	startTransition() {

		let opts = this.options;
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

	callback() {

		let opts = this.options;
		this.transitionendCount++;

		if(this.transitionendCount === this.totaltransitions) {

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