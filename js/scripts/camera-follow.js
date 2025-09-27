import * as THREE from 'three';

export default class CameraFollow {
    constructor(params = {}) {
        // Public properties that can be configured in the editor
        this.targetName = params.target;
        this.smoothSpeed = params.smooth_speed || 0.125;

        // Private properties
        this.targetTransform = null;
        this.offset = new THREE.Vector3();
    }

    onStart(scene) {
        // Find the target object's transform in the scene.
        this.targetTransform = scene.getObjectByName(this.targetName);

        if (this.targetTransform) {
            // Calculate the initial offset from the target.
            this.offset.copy(this.gameObject.transform.position).sub(this.targetTransform.position);
        } else {
            console.warn(`CameraFollow on "${this.gameObject.name}": Target object "${this.targetName}" not found in scene.`);
        }
    }

    update(deltaTime, scene) {
        // If the target wasn't found at start, try to find it again.
        // This can be useful if the target is spawned dynamically.
        if (!this.targetTransform) {
            this.targetTransform = scene.getObjectByName(this.targetName);
            if (!this.targetTransform) {
                return; // Exit if target is still not found.
            }
            // Calculate offset once the target is found
            this.offset.copy(this.gameObject.transform.position).sub(this.targetTransform.position);
        }

        // Smoothly move the camera towards the target's position plus the offset.
        const desiredPosition = this.targetTransform.position.clone().add(this.offset);
        this.gameObject.transform.position.lerp(desiredPosition, this.smoothSpeed);

        // Always look at the target's position.
        this.gameObject.transform.lookAt(this.targetTransform.position);
    }

    onCollisionEnter(other) {
        // This component doesn't need to react to collisions.
    }

    onDestroy() {
        // No specific cleanup needed for this component.
    }
}