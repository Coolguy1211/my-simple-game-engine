import * as THREE from 'three';

export default class Rotate {
    constructor() {
    }

    onStart() {
        console.log('Rotate script started!');
    }

    update(dt) {
        // Rotate the game object around the Y axis
        this.gameObject.transform.rotation.y += dt;
    }

    onDestroy() {
        console.log(`Rotate component on ${this.gameObject.name} is being destroyed.`);
    }
}
