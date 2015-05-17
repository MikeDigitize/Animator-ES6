import { Promise as p } from "./es6-promise";
import Prefix from "./prefixes";
import DomUtils from "./dom-utils";

let Promise = p;

class Transition {

	constructor(options) {

		this.options = options;
		this.utils = new DomUtils();
		this.prefix = new Prefix();
		this.onTransitionEnd = this.callback.bind(this);
		this.totaltransitions = options.properties.length;
		this.transitionendCount = 0;

		return new Promise((resolve, reject) => {

			this.resolve = resolve;
			this.reject = reject;

			setTimeout(() => {

				options.element.addEventListener(this.prefix.getPrefix("transitionend"), this.onTransitionEnd, false);

				if(options.removeClass && options.removeClass.before) {
					this.utils.setClass(options.element, "transition", false);
				}

				if(options.addClass && options.addClass.before) {
					this.utils.setClass(options.element, "transition", true);	
				}	

			}, 0);            

		});

	}

	callback() {

		this.transitionendCount++;

		console.log("count", this.transitionendCount);

		if(this.transitionendCount === this.totaltransitions) {

			this.options.element.removeEventListener(this.prefix.getPrefix("transitionend"), this.onTransitionEnd, false);

			if(this.options.removeClass && this.options.removeClass.after) {
				this.utils.setClass(options.element, "transition", false);
			}

			if(this.options.addClass && this.options.addClass.after) {
				this.utils.setClass(options.element, "transition", true);	
			}	

			this.resolve();

		}

	}

}

export default Transition;