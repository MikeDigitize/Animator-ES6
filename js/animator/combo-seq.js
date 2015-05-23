class Combo {
	
	constructor(sequences, Promise, Tracker, Transition) {

		return new Promise((resolve, reject) => {

			let watcher = this.sequenceWatcher();
			this.resolve = resolve;
			this.reject = reject;
			this.amount = sequences.length;

			sequences.forEach(sequence => {

				if(sequence.prototype === Transition.prototype) {
					Tracker.track(options, sequence);
				}
				else {
					Tracker.track(options, sequence);
				}

				sequence.then(element => {
					watcher(element);
				});

			});
			
		});

	}

	sequenceWatcher() {

		let count = 0;
		let returnData = [];
		return element => {

			count++;
			returnData.push(element);
			if(count === this.amount) {
				this.resolve(returnData);
			}
			
		}

	}

}

export default Combo;