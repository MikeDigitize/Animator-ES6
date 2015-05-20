class SequenceWrapper {
	
	constructor(options, domUtils, prefix, cssutils, promise, sequenceType, Combo) {

		if(options.element.length) {
			this.createSequenceWrapper(options, domUtils, prefix, cssutils, promise, sequenceType, Combo);
		}
		else {
			return new sequenceType(options, domUtils, prefix, cssutils, promise);
		}

	}

	createSequenceWrapper(options, domUtils, prefix, cssutils, promise, sequenceType, Combo) {

		let sequences = [];
		Array.from(options.element).forEach(element => {
			let optionsCopy = options;
			optionsCopy.element = element;
			sequences.push(new this.sequenceType(optionsCopy, domUtils, prefix. cssutils, promise));
		});
		return new Combo(sequences);
	}

}

export default SequenceWrapper;