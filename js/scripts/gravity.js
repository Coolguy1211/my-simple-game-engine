import * as THREE from 'three';

const GRAVITY_CONSTANT = -9.8;

export default class Gravity {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;

        // Cached values for performance
        this.floorY = null;
        this.objectHalfHeight = 0;
    }

    onStart(scene) {
        // Cache geometry and position data on start to avoid expensive lookups
        // and calculations in the update loop, which is a major performance win.
        const floor = scene.getObjectByName('floor');
        if (floor) {
            const floorBox = new THREE.Box3().setFromObject(floor);
            this.floorY = floorBox.max.y;
        }

        // Use a bounding box to robustly get the player's height,
        // as glTF models may not have a direct geometry property.
        const objectBox = new THREE.Box3().setFromObject(this.gameObject.transform);
        const objectSize = new THREE.Vector3();
        objectBox.getSize(objectSize);
        this.objectHalfHeight = objectSize.y / 2;
    }

    update(deltaTime) {
        // Apply gravity if the object is not on the ground.
        if (!this.isGrounded) {
            this.velocity.y += GRAVITY_CONSTANT * deltaTime;
        }

        // Apply velocity to the game object's transform.
        // Perf: Use addScaledVector for a single, efficient operation.
        this.gameObject.transform.position.addScaledVector(this.velocity, deltaTime);

        // Perform collision detection using cached values for maximum performance.
        if (this.floorY !== null) {
            if (this.gameObject.transform.position.y - this.objectHalfHeight < this.floorY) {
                this.gameObject.transform.position.y = this.floorY + this.objectHalfHeight;
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