/**
  * @Audio Class
  *
  * @description Provides Audio sample playback / timing.
  * @returns {Object}
  */

class Audio {

	constructor(config) {

		this.milliseconds = 0;
		this.audioSettings = config;
		this.startTimer();

	}

	startTimer() {
		this.timer = setInterval(() => {
			this.milliseconds += 100;
			this.audioSettings.forEach((config) => {
				if(config.time === this.milliseconds) {
					this.playAudio(config);
				}
			});
		}, 100);
	}

	playAudio(config) {
		console.log("play!", config);
	}

	cancel() {
		clearInterval(this.timer);
		console.log("timer cancelled")
	}

}

export default Audio;