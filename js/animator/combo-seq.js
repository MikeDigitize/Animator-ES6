class Combo {
	
	constructor(sequences, Promise, Tracker) {

		return new Promise((resolve, reject) => {

			let watcher = this.sequenceWatcher();
			this.resolve = resolve;
			this.reject = reject;
			this.amount = sequences.length;
			this.tracker = Tracker;
			//Tracker.store("Combos", reject);

			sequences.forEach(sequence => {
				sequence.then(element => {
					watcher(element);
				})
				.catch(e => {
					this.reject(e);
				})

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
				//this.tracker.removeCombo();
				this.resolve(returnData);
			}

		}

	}

}

export default Combo;