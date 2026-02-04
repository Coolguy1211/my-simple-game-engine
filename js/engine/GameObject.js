import * as THREE from 'three';

export class GameObject {
    constructor(name = 'GameObject') {
        this.name = name;
        this.components = [];
        this.transform = new THREE.Object3D();
        this.transform.name = name;
        this.isDestroyed = false;
    }

    addComponent(component) {
        this.components.push(component);
        component.gameObject = this;
    }

    getComponent(ComponentClass) {
        return this.components.find(c => c instanceof ComponentClass);
    }

    onStart(scene) {
        const components = this.components;
        const len = components.length;
        for (let i = 0; i < len; i++) {
            const component = components[i];
            if (component.onStart) {
                component.onStart(scene);
            }
        }
    }

    update(deltaTime, scene, inputManager) {
        const components = this.components;
        const len = components.length;
        for (let i = 0; i < len; i++) {
            const component = components[i];
            if (component.update) {
                component.update(deltaTime, scene, inputManager);
            }
        }
    }

    onCollisionEnter(other) {
        // To be called by the physics engine when a collision occurs.
        const components = this.components;
        const len = components.length;
        for (let i = 0; i < len; i++) {
            const component = components[i];
            if (component.onCollisionEnter) {
                component.onCollisionEnter(other);
            }
        }
    }

    destroy() {
        if (this.isDestroyed) return;

        // Call onDestroy on all components
        const components = this.components;
        const len = components.length;
        for (let i = 0; i < len; i++) {
            const component = components[i];
            if (component.onDestroy) {
                component.onDestroy();
            }
        }

        // Remove the object from the scene
        if (this.transform.parent) {
            this.transform.parent.remove(this.transform);
        }

        this.isDestroyed = true;
    }
}