/**
  * @Tracker Class
  *
  * @description Track all sequenced elements to allow sequences to be played / paused.
  * @returns {Object}
  */

class Tracker {

   /**
     * @constructor function
     *
     * @params {Class, Class, Class, Class}    
     * @description Initialise a single Map object to store sequenced elements. Only one instance per Animator is created.  
	 * @params description
	 	- DomUtils {Class} DOM utilities class.
	 	- Prefix {Class} Prefix class.
	 	- CssUtils {Class} CSS Utilities class.
	 	- Transition {Class} Store the Transition protoype to compare against new sequence types passed in to the Tracker.
     */

	constructor(DomUtils, Prefix, CssUtils, Transition) {

		this.tracker = new Map();
		this.tracker.set("Transitions", new Map());
		this.tracker.set("Animations", new Map());
		this.domUtils = new DomUtils();
		this.prefix = new Prefix();
		this.cssUtils = new CssUtils();
		this.transitionPrototype = Transition.prototype;

	}

   /**
     * @track function
     *
     * @params {Object, Class}
     * @description Searches the Map for the element passed in and either updates it if found or creates a new entry in the Map for it.
     * @params description      
     *  - options: {Object} The sequence options.
        - Sequence : {Class} Either a Transition or Animation class.
     * @global no
     */

	track(options, Sequence) {

		let transition = this.tracker.get("Transitions").get(options.element);
		let animation = this.tracker.get("Animations").get(options.element);

		if(Sequence.prototype === this.transitionPrototype) {
			if(!transition) {
				this.trackTransition(options);
			}
			else {
				this.updateTransitionRecord(transition, options); 
			}			
		}
		else {

			// A reference to the element will suffice if the sequence type is an Animation.
			// CSS properties are not stored for Animations therefore don't need updating.
			if(!animation) {
				this.trackAnimation(options);
			}				
		}

	}

   /**
     * @trackTransition function
     *
     * @params {Object}
     * @description Stores the element under Transitions in the Tracker Map and the transitioned properties / style rules set against the element.
     * @params description      
     *  - options: {Object} The transition sequence options.
     * @global no
     */

	trackTransition(options) {

		let data = {}, 
			transitionStyles = {},
			tp = Animator.getPrefix("transition-property"),
			tdur = Animator.getPrefix("transition-duration"),
			ttf = Animator.getPrefix("transition-timing-function"),
			tdel = Animator.getPrefix("transition-delay"),
			transitions = this.tracker.get("Transitions");	
 
		if(options.setStyles && options.setStyles.before) {
			data.styles = options.setStyles.before;
		}
		
		transitionStyles[tp] = this.cssUtils.getStyles(options.element, tp)[tp];
		transitionStyles[tdur] = this.cssUtils.getStyles(options.element, tdur)[tdur];
		transitionStyles[ttf] = this.cssUtils.getStyles(options.element, ttf)[ttf];
		transitionStyles[tdel] = this.cssUtils.getStyles(options.element, tdel)[tdel];
		data.transitionStyles = transitionStyles;
		data.properties = Array.isArray(options.properties) ? [...options.properties] : [options.properties];
		transitions.set(options.element, data);

	}

   /**
     * @trackAnimation function
     *
     * @params {Object}
     * @description Stores the element under Animations in the Tracker Map.
     * @params description      
     *  - options: {Object} The animation sequence options.
     * @global no
     */

	trackAnimation(options) {

		let data = {};	
		let animations = this.tracker.get("Animations");
		animations.set(options.element, data);

	}

   /**
     * @updateTransitionRecord function
     *
     * @params {Object, Object}
     * @description Inserts additional transitioned properties / style rules set into an element's record.
     * @params description      
     *  - record: {Object} The transition record from the Tracker Map.
     *  - options: {Object} The transition sequence options.
     * @global no
     */

	updateTransitionRecord(record, options) {

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

	}

   /**
     * @pause function
     *
     * @description Iterates through every stored element in the Tracker and sets its CSS appropriately to effectively pause a sequence.
     * @global no
     */

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
	        
	        let element = transitionElements.next(), record, rule = {};
	        if (element.done) {
	            break;
	        }

	        rule[this.prefix.getPrefix("transition")] = "none";
	        this.cssUtils.setStyles(element.value, rule);
	        record = transitions.get(element.value);
	        record.properties.forEach(property => {
	        	let rule = this.cssUtils.getStyles(element.value, property);
	        	console.log(rule);
	        	this.cssUtils.setStyles(element.value, rule, true);
	        });	

	    }

	}

   /**
     * @play function
     *
     * @description Iterates through every stored element in the Tracker and sets CSS style rules to continue a paused sequence.
     * @global no
     */

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

	        this.cssUtils.setStyles(element.value, transitions.get(element.value).transitionStyles);
	        let record = transitions.get(element.value);
	        record.properties.forEach(property => {
	        	element.value.style.removeProperty(property);
	        });

	        if(record.styles) {
	        	this.cssUtils.setStyles(element.value, record.styles);
	        }

	    }

	}

   /**
     * @remove function
     *
     * @params {String, HTMLElement}
     * @description Removes a stored element from the Tracker once a sequence is complete.
     * @params description      
     *  - type: {String} Map key, either Transitions or Animations.
     *  - element: {HTMLElement} The element to remove from the Tracker.
     * @global no
     */

	remove(type, element) {
		this.tracker.get(type).delete(element);
	}

}

export default Tracker;