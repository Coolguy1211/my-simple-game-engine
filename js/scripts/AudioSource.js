import * as THREE from 'three';
import AudioManager from '../engine/AudioManager.js';

export default class AudioSource {
    constructor(params = {}) {
        this.src = params.src;
        this.autoplay = params.autoplay || false;
        this.loop = params.loop || false;
        this.volume = params.volume !== undefined ? params.volume : 1;

        this.audio = null; // Will be a THREE.Audio or THREE.PositionalAudio instance
    }

    async onStart(scene) {
        if (!this.src) {
            console.warn(`AudioSource on "${this.gameObject.name}" has no 'src' specified.`);
            return;
        }

        // Get the single AudioListener from the AudioManager
        const listener = AudioManager.getListener();
        if (!listener) {
            console.error('AudioSource requires an AudioListener in the scene. Please add one to the camera.');
            return;
        }

        // Create positional audio so the sound comes from the object's position
        this.audio = new THREE.PositionalAudio(listener);

        try {
            const buffer = await AudioManager.load(this.src);
            this.audio.setBuffer(buffer);
            this.audio.setLoop(this.loop);
            this.audio.setVolume(this.volume);

            // Add the audio object to this GameObject's transform so it's positioned correctly
            this.gameObject.transform.add(this.audio);

            if (this.autoplay) {
                this.play();
            }
        } catch (error) {
            console.error(`AudioSource on "${this.gameObject.name}" failed to set up audio.`, error);
        }
    }

    play() {
        if (this.audio && !this.audio.isPlaying) {
            this.audio.play();
        }
    }

    pause() {
        if (this.audio && this.audio.isPlaying) {
            this.audio.pause();
        }
    }

    stop() {
        if (this.audio && this.audio.isPlaying) {
            this.audio.stop();
        }
    }

    onDestroy() {
        if (this.audio) {
            if (this.audio.isPlaying) {
                this.audio.stop();
            }
            // The audio object is a child of the transform, so it will be removed from the scene
            // when the game object is destroyed. No extra cleanup needed for the audio object itself.
        }
    }
}