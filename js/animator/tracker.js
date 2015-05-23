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

		let data = this.tracker.get(type).get(element);
		data.reject.push(reject);

	}

	trackTransition(options) {

		console.log(options);

		let transitions = this.tracker.get("Transitions");
		let data = {};
		
		data.options = options;
		data.properties = options.properties;
		data.initialValues = {};

		data.properties.forEach(property => {
			let styleRule = this.cssUtils.getStyles(options.element, property);
			Object.keys(styleRule).forEach(property => {
				data.initialValues[property] = styleRule[property];
			});
		});

		data.reject = [];

		transitions.set(options.element, data);
		console.log(transitions.get(options.element));

	}

	trackAnimation(options) {

		let animations = this.tracker.get("Animations");
		animations.set(options.element, { options : options });
		console.log("animation", this.tracker.get("Animations"));

	}

}

export default Tracker;