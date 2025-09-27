import * as THREE from 'three';
import SceneManager from './SceneManager.js';

class DebugManager {
    constructor() {
        if (DebugManager.instance) {
            return DebugManager.instance;
        }
        this.isEnabled = false;
        this.debugHelpers = new THREE.Group();
        this.boundingBoxes = new Map(); // Map from GameObject transform to its BoxHelper
        DebugManager.instance = this;
    }

    /**
     * Toggles the debug mode on or off.
     */
    toggle() {
        this.isEnabled = !this.isEnabled;
        console.log(`Debug mode ${this.isEnabled ? 'enabled' : 'disabled'}.`);

        const scene = SceneManager.getActiveScene()?.threeScene;
        if (!scene) return;

        if (this.isEnabled) {
            scene.add(this.debugHelpers);
            this.createAllBoundingBoxes();
        } else {
            scene.remove(this.debugHelpers);
            this.clearAllBoundingBoxes();
        }
    }

    /**
     * Updates all active debug visualizations. Should be called every frame.
     */
    update() {
        if (!this.isEnabled) return;

        // Update bounding boxes to match their targets
        for (const [transform, helper] of this.boundingBoxes.entries()) {
            helper.update();
        }

        // Add/remove helpers for new/destroyed objects
        this.syncBoundingBoxes();
    }

    createBoundingBox(gameObject) {
        if (!gameObject.transform || this.boundingBoxes.has(gameObject.transform)) return;

        const boxHelper = new THREE.BoxHelper(gameObject.transform, 0xffff00); // Yellow
        this.boundingBoxes.set(gameObject.transform, boxHelper);
        this.debugHelpers.add(boxHelper);
    }

    removeBoundingBox(gameObject) {
        const helper = this.boundingBoxes.get(gameObject.transform);
        if (helper) {
            this.debugHelpers.remove(helper);
            helper.dispose();
            this.boundingBoxes.delete(gameObject.transform);
        }
    }

    createAllBoundingBoxes() {
        this.clearAllBoundingBoxes();
        const gameObjects = SceneManager.getActiveScene()?.gameObjects || [];
        for (const go of gameObjects) {
            this.createBoundingBox(go);
        }
    }

    clearAllBoundingBoxes() {
        for (const helper of this.boundingBoxes.values()) {
            this.debugHelpers.remove(helper);
            helper.dispose();
        }
        this.boundingBoxes.clear();
    }

    syncBoundingBoxes() {
        const gameObjects = SceneManager.getActiveScene()?.gameObjects || [];
        const currentTransforms = new Set(gameObjects.map(go => go.transform));

        // Remove helpers for objects that no longer exist
        for (const transform of this.boundingBoxes.keys()) {
            if (!currentTransforms.has(transform)) {
                this.removeBoundingBox({ transform });
            }
        }

        // Add helpers for new objects
        for (const go of gameObjects) {
            if (!this.boundingBoxes.has(go.transform)) {
                this.createBoundingBox(go);
            }
        }
    }
}

const debugManager = new DebugManager();
export default debugManager;