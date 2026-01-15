import * as THREE from 'three';

const GRAVITY_CONSTANT = -9.8;

export default class Gravity {
    constructor() {
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        this.objectHeight = 0;
    }

    onStart(scene) {
        // Cache the object's height for performance. Using a bounding box is safer
        // than assuming a geometry property, which may not exist on all objects.
        const boundingBox = new THREE.Box3().setFromObject(this.gameObject.transform);
        this.objectHeight = boundingBox.max.y - boundingBox.min.y;
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
        const floor = scene.getObjectByName('floor');
        if (floor) {
            const floorY = floor.position.y + floor.geometry.parameters.height / 2;

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