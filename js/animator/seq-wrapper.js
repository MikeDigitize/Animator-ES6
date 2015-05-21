class SequenceWrapper {
	
	constructor(options, DomUtils, Prefix, CssUtils, Promise, Sequence, Combo) {

		if(options.element.length) {
			let transitions = Array.from(options.element).map((element) => {
				let opts = {};
				Object.keys(options).forEach((key) => {
					opts[key] = options[key];
				});
				opts.element = element;
				return new Sequence(opts, DomUtils, Prefix, CssUtils, Promise);
			});
			return new Combo(transitions, Promise);
		}
		else {
			return new Sequence(options, DomUtils, Prefix, CssUtils, Promise);
		}		

	}

}

export default SequenceWrapper;