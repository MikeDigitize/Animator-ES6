class SequenceWrapper {
	
	constructor(options, DomUtils, Prefix, CssUtils, Promise, Sequence, Combo) {

		if(options.element.length) {
			let sequences = Array.from(options.element).map(element => {
				let optionsCopy = options;
				optionsCopy.element = element;
				return Sequence(optionsCopy, DomUtils, Prefix, CssUtils, Promise);
			});

			console.log(sequences);

			return new Combo(sequences, Promise);
		}
		else {
			return new Sequence(options, DomUtils, Prefix, CssUtils, Promise);
		}

	}

}

export default SequenceWrapper;