import * as THREE from 'three';

class AudioManager {
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }

        this.audioLoader = new THREE.AudioLoader();
        this.listener = null; // The single AudioListener for the scene
        this.cache = new Map();
        AudioManager.instance = this;
    }

    /**
     * Initializes the AudioListener and attaches it to the main camera.
     * This must be called once when the scene is setting up.
     * @param {THREE.Camera} camera - The main camera of the scene.
     */
    init(camera) {
        if (!this.listener) {
            this.listener = new THREE.AudioListener();
            camera.add(this.listener);
            console.log('AudioListener created and attached to camera.');
        }
    }

    /**
     * Returns the single AudioListener instance.
     * @returns {THREE.AudioListener}
     */
    getListener() {
        return this.listener;
    }

    /**
     * Loads an audio file and returns a promise that resolves with the AudioBuffer.
     * Caches the buffer to avoid redundant loads.
     * @param {string} src - The URL of the audio file.
     * @returns {Promise<AudioBuffer>}
     */
    async load(src) {
        if (this.cache.has(src)) {
            return this.cache.get(src);
        }

        try {
            const buffer = await this.audioLoader.loadAsync(src);
            this.cache.set(src, buffer);
            return buffer;
        } catch (error) {
            console.error(`AudioManager: Failed to load audio from ${src}`, error);
            throw error;
        }
    }
}

// Export a single instance to act as a global audio manager
const audioManager = new AudioManager();
export default audioManager;