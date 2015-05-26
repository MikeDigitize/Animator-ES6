class Tracker {

	constructor(DomUtils, Prefix, CssUtils, Transition) {

		this.tracker = new Map();
		this.tracker.set("Transitions", new Map());
		this.tracker.set("Animations", new Map());
		this.tracker.set("Combos", { reject : [] });
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

	store(type, reject, element) {
		let record = element ? this.tracker.get(type).get(element) : this.tracker.get(type);
		record.reject.push(reject);
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

		console.log("Update", this.tracker);

	}

	stop() {

		let transitions = this.tracker.get("Transitions");
		let transitionElements = transitions.keys();
		let animations = this.tracker.get("Animations");
		let animationElements = animations.keys();

		while(true) {
	        
	        let element = animationElements.next(), rule = {};
	        if (element.done) {
	            break;
	        }

        	rule[this.prefix.getPrefix("animation-play-state")] = "paused";
        	this.cssUtils.setStyles(element.value, rule);

        	// if(this.tracker.get("Combos").reject.length) {
        	// 	this.end(this.tracker.get("Combos").reject);
        	// }
        	// else {
        	// 	this.end(animations.get(element.value).reject);
        	// }

	    }

		while(true) {
	        
	        let element = transitionElements.next(), record;
	        if (element.done) {
	            break;
	        }

	        record = transitions.get(element.value);
	        record.properties.forEach(property => {
	        	let rule = {};
	        	rule[property] = this.cssUtils.getStyles(element.value, property);
	        	console.log("tr: ", element.value, rule);
	        	this.cssUtils.setStyles(element.value, rule);
	        });	

	        // if(this.tracker.get("Combos").reject.length) {
        	// 	this.end(this.tracker.get("Combos").reject);
        	// }
        	// else {
        	// 	this.end(record.reject);
        	// }

	    }

	}

	end(rejections) {

		rejections.forEach(rejected => {
    		rejected();
    	});

	}

	trackTransition(options) {

		// if no transition data exists for an element create a new record
		// store the transitioned properties
		// store the initial values of those transitioned properties
		// store the reject functions for that element

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

		console.log("Transition:", this.tracker);

	}

	trackAnimation(options) {

		let data = {};	
		let animations = this.tracker.get("Animations");
		data.reject = [];
		animations.set(options.element, data);

		console.log("Animation:", this.tracker);

	}

	remove(type, element) {
		this.tracker.get(type).delete(element);
		console.log("Remove!", this.tracker);
	}

	removeCombo() {
		this.tracker.get("Combos").reject = [];
		console.log("Remove combos!", this.tracker);
	}

}

export default Tracker;