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

		let transition = this.tracker.get("Transitions").get(options.element);
		let animation = this.tracker.get("Animations").get(options.element);

		if(Sequence.prototype === this.transition) {
			if(!transition) {
				this.trackTransition(options);
			}
			else {
				this.update(transition, options); 
			}			
		}
		else {
			if(!animation) {
				this.trackAnimation(options);
			}				
		}

	}

	store(element, reject, type) {
		this.tracker.get(type).get(element).reject.push(reject);
	}

	update(record, options) {

		let properties = Array.isArray(options.properties) ? [...options.properties] : [options.properties];
		record.properties = [...record.properties, ...properties];

		properties.forEach(property => {
			let styleRule = this.cssUtils.getStyles(options.element, property);
			Object.keys(styleRule).forEach(property => {
				record.initialValues[property] = styleRule[property];
			}); 
		});

	}

	stop() {

		let transitions = this.tracker.get("Transitions");
		let transitionElements = transitions.keys();
		let animations = this.tracker.get("Animations");
		let animationElements = animations.keys();

		let reject;

		while(true) {
	        
	        let element = animationElements.next(), rule = {};
	        if (element.done) {
	            break;
	        }

        	rule[this.prefix.getPrefix("animation-play-state")] = "paused";
        	this.cssUtils.setStyles(element.value, rule);
        	reject = animations.get(element.value).reject[0];

	    }

		while(true) {
	        
	        let element = transitionElements.next(), record;
	        if (element.done) {
	            break;
	        }

	        record = transitions.get(element.value);
	        record.properties.forEach(property => {
	        	let rule = {};
	        	rule[property] = this.cssUtils.getStyles(property);
	        	this.cssUtils.setStyles(element.value, rule);
	        });	        
	        record.reject.forEach(rejected => {
	        	rejected();
	        });

	    }

	    console.log(reject);

	    return reject("error!");

		// console.log(transitions.entries());

		// transitions.keys().forEach(transition => {
		// 	console.log(transition);
		// });

		// run through transition properties and store and then set them to stop the transition
		// run through animation elements and set animation play state to paused
		// fire all rejects

	}

	trackTransition(options) {

		let data = {};	
		let transitions = this.tracker.get("Transitions");	
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