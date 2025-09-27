/**
 * Represents a single scene in the game.
 * It holds the THREE.Scene object, the camera, and all GameObjects within that scene.
 */
export class Scene {
    constructor(name, configPath) {
        this.name = name;
        this.configPath = configPath;

        this.threeScene = null;
        this.camera = null;
        this.gameObjects = [];
        this.isLoaded = false;
    }

    /**
     * Cleans up all resources used by the scene.
     * Calls onDestroy on all GameObjects and disposes of Three.js resources.
     */
    unload() {
        // Destroy all game objects, which will in turn call onDestroy on their components
        for (const go of this.gameObjects) {
            go.destroy();
        }

        // Additional cleanup for the THREE.Scene if necessary (e.g., textures, materials not tied to a GO)
        // This part can be expanded as the engine grows.

        this.isLoaded = false;
        console.log(`Scene "${this.name}" unloaded.`);
    }
}