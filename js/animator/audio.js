/**
  * @Audio Class
  *
  * @description Provides Audio sample playback / timing.
  * - check for web audio support
  * - if none defer back to audio element playback / volume only
  * - if supported play audio with panning, filtering, volume options
  * @returns {Object}
  */

class Audio {

	constructor(config) {

		this.milliseconds = 0;
		this.audioSettings = Array.isArray(config) ? config : [...config];
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
        //let audio = document.createElement("audio");
        //audio.src = config.audio;
        //audio.play();

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//set up the different audio nodes we will use for the app
        var analyser = audioCtx.createAnalyser();
        var distortion = audioCtx.createWaveShaper();
        var gainNode = audioCtx.createGain();
        var biquadFilter = audioCtx.createBiquadFilter();
        var convolver = audioCtx.createConvolver();

// connect the nodes together

        let source = audioCtx.createMediaStreamSource(config.audio);
        source.connect(analyser);
        analyser.connect(distortion);
        distortion.connect(biquadFilter);
        biquadFilter.connect(convolver);
        convolver.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Manipulate the Biquad filter

        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = 25;

        console.log(source);
	}

	cancel() {
		clearInterval(this.timer);
		console.log("timer cancelled")
	}

}

export default Audio;