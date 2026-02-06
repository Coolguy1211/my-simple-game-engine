import * as THREE from 'three';

const GRAVITY_CONSTANT = -9.8;

export default class Gravity {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        this._floor = null;
        // Pre-allocate Box3 for initial height calculation.
        this._box = new THREE.Box3();
        this._floorY = null;
        this._pivotOffset = null;
    }

    onStart(scene) {
        // Cache the floor object reference to avoid per-frame getObjectByName calls.
        this._floor = scene.getObjectByName('floor');
        if (this._floor) {
            this._box.setFromObject(this._floor);
            this._floorY = this._box.max.y;
        }
    }

    update(deltaTime, scene) {
        // Apply gravity if the object is not on the ground.
        if (!this.isGrounded) {
            this.velocity.y += GRAVITY_CONSTANT * deltaTime;
        }

        // Use addScaledVector for a more efficient position update.
        this.gameObject.transform.position.addScaledVector(this.velocity, deltaTime);

        // Lazily refresh floor reference if it's missing.
        if (!this._floor) {
            this._floor = scene.getObjectByName('floor');
            if (this._floor) {
                this._box.setFromObject(this._floor);
                this._floorY = this._box.max.y;
            }
        }

        if (this._floorY !== null) {
            // Robust height/pivot calculation that works with glTF models.
            // We compute the pivot offset once to avoid expensive setFromObject() calls every frame.
            if (this._pivotOffset === null) {
                this._box.setFromObject(this.gameObject.transform);
                // The distance from the pivot (position.y) to the bottom of the bounding box (min.y).
                this._pivotOffset = this.gameObject.transform.position.y - this._box.min.y;
            }

            const objectMinY = this.gameObject.transform.position.y - this._pivotOffset;

            if (objectMinY < this._floorY) {
                this.gameObject.transform.position.y = this._floorY + this._pivotOffset;
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