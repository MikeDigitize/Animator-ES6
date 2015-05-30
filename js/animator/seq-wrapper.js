class SequenceWrapper {
	
	constructor(options, DomUtils, Prefix, CssUtils, Promise, Sequence, Combo, Tracker) {

		if(options.element.length) {
			let transitions = Array.from(options.element).map((element) => {
				let opts = {};
				Object.keys(options).forEach((key) => {
					opts[key] = options[key];
				});
				opts.element = element;	 
				Tracker.track(opts, Sequence);
				return new Sequence(opts, DomUtils, Prefix, CssUtils, Promise, Tracker);
			});
			return new Combo(transitions, Promise);
		}
		else {
			Tracker.track(options, Sequence);
			return new Sequence(options, DomUtils, Prefix, CssUtils, Promise, Tracker);
		}		

	}

}

export default SequenceWrapper; 