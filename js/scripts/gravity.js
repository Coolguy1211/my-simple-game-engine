import * as THREE from 'three';

const GRAVITY_CONSTANT = -9.8;

export default class Gravity {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        // Optimization: Pre-allocate Box3 instances to avoid per-frame GC pressure from instantiation.
        this._box = new THREE.Box3();
        this._floorBox = new THREE.Box3();
        this._floor = null;
    }

    onStart(scene) {
        // Optimization: Cache reference to the floor object to avoid per-frame lookups.
        this._floor = scene.getObjectByName('floor');
    }

    update(deltaTime, scene) {
        // Apply gravity if the object is not on the ground.
        if (!this.isGrounded) {
            this.velocity.y += GRAVITY_CONSTANT * deltaTime;
        }

        // Apply velocity to the game object's transform.
        this.gameObject.transform.position.x += this.velocity.x * deltaTime;
        this.gameObject.transform.position.y += this.velocity.y * deltaTime;
        this.gameObject.transform.position.z += this.velocity.z * deltaTime;

        // Optimization: Lazily refresh floor reference if it was not found at start.
        if (!this._floor) {
            this._floor = scene.getObjectByName('floor');
        }

        // This is a temporary, simple collision detection that will be replaced
        // by a proper physics engine and the onCollisionEnter method.
        if (this._floor) {
            // Optimization: Use Box3.setFromObject for robust height calculation (works for both
            // primitives and glTF models) and use pre-allocated Box3 instances.
            this._floorBox.setFromObject(this._floor);
            const floorTop = this._floorBox.max.y;

            this._box.setFromObject(this.gameObject.transform);
            const objectHeight = this._box.max.y - this._box.min.y;

            if (this.gameObject.transform.position.y - objectHeight / 2 < floorTop) {
                this.gameObject.transform.position.y = floorTop + objectHeight / 2;
                this.velocity.y = 0;
                this.isGrounded = true;
            } else {
                this.isGrounded = false;
            }
        }
    }

    onCollisionEnter(other) {
        // This method will be called by the physics engine when a collision is detected.
        // For now, it serves as a placeholder for the new lifecycle method.
        console.log(`Collision detected between ${this.gameObject.name} and ${other.gameObject.name}`);
    }

    onDestroy() {
        // Perform any cleanup here, like removing event listeners.
        console.log(`Gravity component on ${this.gameObject.name} is being destroyed.`);
    }
}