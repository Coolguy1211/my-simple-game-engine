import * as THREE from 'three';

const GRAVITY_CONSTANT = -9.8;

export default class Gravity {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        this.floor = null;
        this._box = new THREE.Box3();
        this._floorBox = new THREE.Box3();
    }

    onStart(scene) {
        // Cache the floor object to avoid per-frame scene traversal.
        this.floor = scene.getObjectByName('floor');
    }

    update(deltaTime, scene) {
        // Lazily refresh floor reference if it was lost or not found on start.
        if (!this.floor) {
            this.floor = scene.getObjectByName('floor');
        }

        // Apply gravity if the object is not on the ground.
        if (!this.isGrounded) {
            this.velocity.y += GRAVITY_CONSTANT * deltaTime;
        }

        // Apply velocity to the game object's transform.
        this.gameObject.transform.position.x += this.velocity.x * deltaTime;
        this.gameObject.transform.position.y += this.velocity.y * deltaTime;
        this.gameObject.transform.position.z += this.velocity.z * deltaTime;


        // This is a temporary, simple collision detection.
        // Optimized to use pre-allocated Box3s and avoid scene traversal.
        if (this.floor) {
            this._box.setFromObject(this.gameObject.transform);
            this._floorBox.setFromObject(this.floor);

            const floorY = this._floorBox.max.y;
            const objectMinY = this._box.min.y;

            if (objectMinY < floorY) {
                this.gameObject.transform.position.y += (floorY - objectMinY);
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