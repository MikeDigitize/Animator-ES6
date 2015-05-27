class Animation {

	constructor(options, DomUtils, Prefix, CssUtils, Promise, Tracker) {

		this.options = options;
		this.domUtils = new DomUtils();
		this.cssUtils = new CssUtils();
		this.prefix = new Prefix().getPrefix("animationend");
		this.onAnimationEnd = this.callback.bind(this);
		this.tracker = Tracker;

		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			Tracker.store("Animations", reject, options.element);
			this.animationFrame = requestAnimationFrame(this.startAnimation.bind(this));      
		});

	}

	startAnimation() {

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

	callback() {

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

		//this.tracker.remove("Animations", opts.element);
		this.resolve(opts.element);

	}

}

export default Animation;