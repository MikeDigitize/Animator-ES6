class Transition {

	constructor(options, DomUtils, Prefix, CssUtils, Promise) {

		console.log("element", options.element);

		this.options = options;
		this.domUtils = new DomUtils();
		this.prefix = new Prefix().getPrefix("transitionend");
		this.cssUtils = new CssUtils();
		this.onTransitionEnd = this.callback.bind(this);
		this.totaltransitions = Array.isArray(options.properties) ? options.properties.length : 1;
		this.transitionendCount = 0;

		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			this.animationFrame = requestAnimationFrame(this.startTransition.bind(this));      
		});

	}

	startTransition() {

		let opts = this.options;

		opts.element.addEventListener(this.prefix, this.onTransitionEnd, false);

		if(opts.removeClass && opts.removeClass.before) {
			this.domUtils.setClass(opts.element, opts.removeClass.before, false);
		}

		if(opts.addClass && opts.addClass.before) {
			this.domUtils.setClass(opts.element, opts.addClass.before, true);	
		}	

		if(opts.setStyles && opts.setStyles.before) {
			this.cssUtils.setStyles(opts.element, opts.setStyles.before);
		}

	}

	callback() {

		let opts = this.options;
		this.transitionendCount++;

		if(this.transitionendCount === this.totaltransitions) {

			opts.element.removeEventListener(this.prefix, this.onTransitionEnd, false);
			cancelAnimationFrame(this.animationFrame);

			if(opts.removeClass && opts.removeClass.after) {
				this.domUtils.setClass(options.element, opts.removeClass.after, false);
			}

			if(opts.addClass && opts.addClass.after) {
				this.domUtils.setClass(options.element, opts.addClass.after, true);	
			}	

			if(opts.setStyles && opts.setStyles.after) {
				this.cssUtils.setStyles(opts.element, opts.setStyles.after);
			}

			this.resolve(opts.element);

		}

	}

}

export default Transition;