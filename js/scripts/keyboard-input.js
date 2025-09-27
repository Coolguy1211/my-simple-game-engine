import Gravity from './gravity.js';
import AudioSource from './AudioSource.js';

export default class KeyboardInput {
    constructor(params = {}) {
        this.speed = params.speed || 5;
        this.gravityComponent = null;
        this.audioSource = null;
    }

    onStart(scene) {
        this.gravityComponent = this.gameObject.getComponent(Gravity);
        if (!this.gravityComponent) {
            console.warn(`KeyboardInput on "${this.gameObject.name}" requires a Gravity component.`);
        }

        this.audioSource = this.gameObject.getComponent(AudioSource);
        if (!this.audioSource) {
            console.warn(`KeyboardInput on "${this.gameObject.name}" could not find an AudioSource component.`);
        }
    }

    update(deltaTime, scene, inputManager) {
        if (!this.gravityComponent) return;

        let newVelocityX = 0;
        let newVelocityZ = 0;
        let isMoving = false;

        if (inputManager.isKeyDown('ArrowUp') || inputManager.isKeyDown('KeyW')) {
            newVelocityZ = -this.speed;
            isMoving = true;
        } else if (inputManager.isKeyDown('ArrowDown') || inputManager.isKeyDown('KeyS')) {
            newVelocityZ = this.speed;
            isMoving = true;
        }

        if (inputManager.isKeyDown('ArrowLeft') || inputManager.isKeyDown('KeyA')) {
            newVelocityX = -this.speed;
            isMoving = true;
        } else if (inputManager.isKeyDown('ArrowRight') || inputManager.isKeyDown('KeyD')) {
            newVelocityX = this.speed;
            isMoving = true;
        }

        this.gravityComponent.velocity.x = newVelocityX;
        this.gravityComponent.velocity.z = newVelocityZ;

        // If the character is moving and an audio source is available, play the sound.
        // The AudioSource's play() method already prevents it from restarting if it's already playing.
        if (isMoving && this.audioSource) {
            this.audioSource.play();
        }
    }

    onCollisionEnter(other) {}
    onDestroy() {}
}