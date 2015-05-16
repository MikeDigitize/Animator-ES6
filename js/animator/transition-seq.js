import { Promise as p } from "./es6-promise";
import Prefix from "./prefixes";
import DomUtils from "./dom-utils";

let Promise = p;

class Transition {

	constructor(options) {

		this.options = options;
		this.utils = new DomUtils();
		this.prefix = new Prefix();

		return new Promise((resolve, reject) => {

			this.resolve = resolve;
			this.reject = reject;
			this.onTransitionEnd = this.callback.bind(this);

			setTimeout(() => {

				options.element.addEventListener(this.prefix.getPrefix("transitionend"), this.onTransitionEnd, false);

				if(options.removeClass) {
					this.utils.setClass(options.element, "transition", false);
				}

				if(options.addClass) {
					this.utils.setClass(options.element, "transition", true);	
				}	

			}, 0);            

		});

	}

	callback() {

		this.options.element.removeEventListener(this.prefix.getPrefix("transitionend"), this.onTransitionEnd, false);
		this.resolve();

	}

}

export default Transition;