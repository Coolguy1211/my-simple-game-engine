import { Scene } from './Scene.js';
import { loadSceneFromConfig } from './scene-loader.js';

class SceneManager {
    constructor() {
        if (SceneManager.instance) {
            return SceneManager.instance;
        }
        this.scenes = new Map();
        this.activeScene = null;
        this.isLoading = false;
        SceneManager.instance = this;
    }

    /**
     * Registers a scene with the manager.
     * @param {string} name - The name of the scene.
     * @param {string} configPath - The path to the scene's JSON configuration file.
     */
    registerScene(name, configPath) {
        this.scenes.set(name, new Scene(name, configPath));
    }

    /**
     * Loads and transitions to a new scene.
     * @param {string} name - The name of the scene to load.
     * @returns {Promise<Scene>} - The newly loaded scene.
     */
    async loadScene(name) {
        if (!this.scenes.has(name)) {
            throw new Error(`SceneManager: Scene "${name}" is not registered.`);
        }
        if (this.isLoading) {
            console.warn(`SceneManager: Already loading a scene.`);
            return;
        }
        this.isLoading = true;

        console.log(`Loading scene: ${name}`);

        // Unload the current scene if there is one
        if (this.activeScene) {
            this.activeScene.unload();
        }

        const scene = this.scenes.get(name);

        try {
            // Fetch the configuration file
            const response = await fetch(scene.configPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch scene config: ${scene.configPath}`);
            }
            const config = await response.json();

            // Use the scene-loader to build the scene from the config
            const loadedData = await loadSceneFromConfig(config);

            scene.threeScene = loadedData.scene;
            scene.camera = loadedData.camera;
            scene.gameObjects = loadedData.gameObjects;
            scene.isLoaded = true;

            this.activeScene = scene;
            console.log(`Scene "${name}" loaded successfully.`);

            return scene;

        } catch (error) {
            console.error(`SceneManager: Failed to load scene "${name}".`, error);
            this.activeScene = null; // Ensure no partially loaded scene is active
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Gets the currently active scene.
     * @returns {Scene|null}
     */
    getActiveScene() {
        return this.activeScene;
    }
}

const sceneManager = new SceneManager();
export default sceneManager;