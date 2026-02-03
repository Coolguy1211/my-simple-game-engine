import * as THREE from 'three';

const GRAVITY_CONSTANT = -9.8;

export default class Gravity {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        this._floor = null;
        this._box = new THREE.Box3();
        this._objectSize = new THREE.Vector3();
    }

    onStart(scene) {
        // Cache reference to the floor object to avoid per-frame lookups
        this._floor = scene.getObjectByName('floor');

        // Pre-calculate object height using Box3 for robustness with glTF models
        this._box.setFromObject(this.gameObject.transform);
        this._box.getSize(this._objectSize);
        this.objectHeight = this._objectSize.y;
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

        // Simple collision detection with cached floor reference
        if (this._floor) {
            // Optimization: Assume floor height is static for this simple check
            // A more robust engine would use a real physics system
            const floorY = this._floor.position.y + (this._floor.geometry ? this._floor.geometry.parameters.height / 2 : 0);

            if (this.gameObject.transform.position.y - this.objectHeight / 2 < floorY) {
                this.gameObject.transform.position.y = floorY + this.objectHeight / 2;
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