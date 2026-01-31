import * as THREE from 'three';

const GRAVITY_CONSTANT = -9.8;

export default class Gravity {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        // Optimization: Cache Box3 and Vector3 to avoid per-frame allocations
        this._box = new THREE.Box3();
        this._size = new THREE.Vector3();
    }

    onStart(scene) {
        // Optimization: Cache reference to the floor object
        this.floor = scene.getObjectByName('floor');
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


        // This is a temporary, simple collision detection that will be replaced
        // by a proper physics engine and the onCollisionEnter method.
        if (!this.floor) {
            this.floor = scene.getObjectByName('floor');
        }

        if (this.floor) {
            // Robustly calculate height using bounding boxes, which works for both
            // primitive geometries and glTF models.
            this._box.setFromObject(this.floor);
            this._box.getSize(this._size);
            const floorHeight = this._size.y;
            const floorY = this.floor.position.y + floorHeight / 2;

            this._box.setFromObject(this.gameObject.transform);
            this._box.getSize(this._size);
            const objectHeight = this._size.y;

            if (this.gameObject.transform.position.y - objectHeight / 2 < floorY) {
                this.gameObject.transform.position.y = floorY + objectHeight / 2;
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