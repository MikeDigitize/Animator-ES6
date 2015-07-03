/**
  * @Audio Class
  *
  * @description Provides Audio sample playback / timing.
  * - check for web audio support
  * - if none defer back to audio element playback / volume only
  * - if supported play audio with panning, filtering, volume, loop options
  * @returns {Object}
  */

class Audio {

	constructor(config) {

		this.isWebAudioSupported = !!(window.AudioContext || window.webkitAudioContext);
		this.milliseconds = 0;
		this.audioSettings = Array.isArray(config) ? config : [config];
		this.startTimer();

	}

	startTimer() {
		this.timer = setInterval(() => {
			this.milliseconds += 100;
			this.audioSettings.forEach((config) => {
				if(config.time === this.milliseconds) {
					this.isWebAudioSupported ?	this.getAudio(config) : this.playAudioFallback(config);
				}
			});
		}, 100);
	}

	getAudio(config) {

		let player = new (window.AudioContext || window.webkitAudioContext)();
        let request = new XMLHttpRequest();

		request.open("GET", config.audio, true);
		request.responseType = "arraybuffer";
		request.onload = () => {

            player.decodeAudioData(request.response, (buffer) => {
                this.playAudio(player, buffer, config);
			},
			(e) => {
				"Error with decoding audio data" + e.err;
			});

		};

		request.send();

	}

    playAudio(player, buffer, config) {

        let source = player.createBufferSource();
        source.buffer = buffer;

        if(config.pan) {
            let panner = this.createPanner(player, config.pan);
            source.connect(panner);
        }

        let volume = this.createVolume(player, config.volume);
        source.connect(volume);
        volume.connect(player.destination);
        source.start(0);

    }

    // -1 to 1
    createPanner(player, panValue) {
        let panner = player.createStereoPanner();
        panner.pan.value = panValue;
        return panner;
    }


    createVolume(player, volumeLevel) {
        let volume = player.createGain();
        volume.gain.value = volumeLevel || 1;
        return volume;
    }

	playAudioFallback(config) {
		let audioPlayer = document.createElement("audio");
		audioPlayer.src = config.audio;
		audioPlayer.play();
	}

	cancel() {
		clearInterval(this.timer);
		console.log("timer cancelled");
	}

}

export default Audio;