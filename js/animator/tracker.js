class Tracker {

	constructor(DomUtils, Prefix, CssUtils, Transition) {

		this.tracker = new Map();
		this.tracker.set("Transitions", new Map());
		this.tracker.set("Animations", new Map());
		this.domUtils = new DomUtils();
		this.prefix = new Prefix();
		this.cssUtils = new CssUtils();
		this.transition = Transition.prototype;

	}

	track(options, Sequence) {

		if(Sequence.prototype === this.transition) {
			this.trackTransition(options);
		}
		else {
			this.trackAnimation(options);
		}

	}

	storeReject(element, reject, type) {
		this.tracker.get(type).get(element).reject.push(reject);
		console.log(this.tracker.get(type).get(element));
	}

	trackTransition(options) {

		let data = {};	
		let transitions = this.tracker.get("Transitions");	
		data.options = options;
		data.properties = Array.isArray(options.properties) ? [...options.properties] : [options.properties];
		data.initialValues = {};

		data.properties.forEach(property => {
			let styleRule = this.cssUtils.getStyles(options.element, property);
			Object.keys(styleRule).forEach(property => {
				data.initialValues[property] = styleRule[property];
			}); 
		});

		data.reject = [];
		transitions.set(options.element, data);

	}

	trackAnimation(options) {

		let data = {};	
		let animations = this.tracker.get("Animations");
		data.options = options;
		data.reject = [];
		animations.set(options.element, data);

	}

}

export default Tracker;