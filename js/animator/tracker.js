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

	trackTransition(options) {

		let data = {};	
		let transitions = this.tracker.get("Transitions");	
		if(options.setStyles && options.setStyles.before) {
			data.styles = options.setStyles.before;
		}
		data.properties = Array.isArray(options.properties) ? [...options.properties] : [options.properties];
		data.initialValues = {};
		this.storeInitialValues(options.element, data.initialValues, data.properties);
		transitions.set(options.element, data);

	}

	trackAnimation(options) {

		let data = {};	
		let animations = this.tracker.get("Animations");
		animations.set(options.element, data);

	}

	update(record, options) {

		let properties = Array.isArray(options.properties) ? [...options.properties] : [options.properties];
		properties = properties.filter(property => {
			return record.properties.indexOf(property) === -1;
		});
		
		record.properties = [...record.properties, ...properties];

		if(options.setStyles && options.setStyles.before) {
			if(!record.styles) {
				record.styles = {};
			}
			Object.keys(options.setStyles.before).forEach(property => {
				record.styles[property] = options.setStyles.before[property];
			});
		}

		this.storeInitialValues(options.element, record.initialValues, properties);

	}

	storeInitialValues(element, initialValues, properties) {

		properties.forEach(property => {
			let styleRule = this.cssUtils.getStyles(element, property);
			Object.keys(styleRule).forEach(property => {
				initialValues[property] = styleRule[property];
			}); 
		});

	}

	pause() {

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

	    }

		while(true) {
	        
	        let element = transitionElements.next(), record;
	        if (element.done) {
	            break;
	        }

	        record = transitions.get(element.value);
	        record.properties.forEach(property => {
	        	let rule = this.cssUtils.getStyles(element.value, property);
	        	this.cssUtils.setStyles(element.value, rule, true);
	        });	

	    }

	}

	play() {

		let transitions = this.tracker.get("Transitions");
		let transitionElements = transitions.keys();
		let animations = this.tracker.get("Animations");
		let animationElements = animations.keys();

		while(true) {
	        
	        let element = animationElements.next(), rule = {};
	        if (element.done) {
	            break;
	        }

        	rule[this.prefix.getPrefix("animation-play-state")] = "running";
        	this.cssUtils.setStyles(element.value, rule);

	    }

	    while(true) {
	        
	        let element = transitionElements.next();
	        if (element.done) {
	            break;
	        }

	        let record = transitions.get(element.value);
	        record.properties.forEach(property => {
	        	element.value.style.removeProperty(property);
	        });

	        this.cssUtils.setStyles(element.value, record.styles);

	    }

	}

	remove(type, element) {
		this.tracker.get(type).delete(element);
	}

}

export default Tracker;