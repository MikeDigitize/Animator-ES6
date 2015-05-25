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
        	console.log(rule, element.value);
        	animations.get(element.value).reject.forEach(rejected => {
        		rejected();
        	});

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

	    this.tracker.get("Combos").reject.forEach(reject => {
	    	reject();
	    });

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