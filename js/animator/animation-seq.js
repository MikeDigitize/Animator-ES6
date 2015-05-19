class Animation {

	constructor(options, domUtils, prefix, promise) {

		this.options = options;
		this.domUtils = domUtils;
		this.prefix = prefix.getPrefix("animationend");
		this.onAnimationEnd = this.callback.bind(this);

		return new promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
			this.animationFrame = requestAnimationFrame(this.startAnimation.bind(this));      
		});

	}

	startAnimation() {

		let opts = this.options;
		opts.element.addEventListener(this.prefix, this.onAnimationEnd, false);

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

		if(opts.removeClass && opts.removeClass.after) {
			this.domUtils.setClass(options.element, opts.removeClass.after, false);
		}

		if(opts.addClass && opts.addClass.after) {
			this.domUtils.setClass(options.element, opts.addClass.after, true);	
		}	

		this.resolve(opts.element);

	}

}

export default Animation;