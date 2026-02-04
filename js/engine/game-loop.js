import { InputManager } from './InputManager.js';
import SceneManager from './SceneManager.js';
import DebugManager from './DebugManager.js';
import TimeManager from './TimeManager.js';

/**
 * Creates the main game loop function.
 * This loop is scene-agnostic and will always operate on the currently active scene.
 * @param {THREE.WebGLRenderer} renderer - The main renderer.
 * @param {HTMLCanvasElement} canvas - The canvas element for input handling.
 * @returns {Function} The game loop function to be called by requestAnimationFrame.
 */
export function createGameLoop(renderer, canvas) {
    const inputManager = new InputManager(canvas);

    return function gameLoop(time) {
        // Update the TimeManager at the very start of the frame.
        // This will calculate deltaTime based on the current state.
        TimeManager.update(time);

        const activeScene = SceneManager.getActiveScene();
        if (!activeScene || !activeScene.isLoaded) {
            return;
        }

        // --- Handle System-Level Inputs ---
        if (inputManager.isKeyPressed('Backquote')) {
            DebugManager.toggle();
        }
        if (inputManager.isKeyPressed('KeyP')) {
            TimeManager.togglePause();
        }
        if (inputManager.isKeyPressed('KeyR')) {
            console.log("Reloading scene...");
            TimeManager.stop();
            // Asynchronously reload the current scene
            SceneManager.loadScene(activeScene.name).then(() => {
                // Re-initialize managers that depend on the scene
                const newScene = SceneManager.getActiveScene();
                if (newScene && newScene.camera) {
                    // We need to import AudioManager here to avoid circular dependency issues
                    import('./AudioManager.js').then(module => module.default.init(newScene.camera));
                }
                TimeManager.play(); // Start the new scene
            });
        }

        // --- Main Update Logic ---
        // Only run the game simulation if the state is PLAYING.
        if (TimeManager.isPlaying()) {
            const { gameObjects, threeScene } = activeScene;
            const deltaTime = TimeManager.deltaTime;

            // Update all game objects using a standard for loop for performance
            const gameObjectsCount = gameObjects.length;
            for (let i = 0; i < gameObjectsCount; i++) {
                const gameObject = gameObjects[i];
                if (!gameObject.isDestroyed) {
                    gameObject.update(deltaTime, threeScene, inputManager);
                }
            }

            // Update the debug manager to sync visualizations
            DebugManager.update();

            // Clean up destroyed objects in-place to avoid array allocation every frame
            let writePtr = 0;
            const totalCount = gameObjects.length;
            for (let readPtr = 0; readPtr < totalCount; readPtr++) {
                const go = gameObjects[readPtr];
                if (!go.isDestroyed) {
                    if (writePtr !== readPtr) {
                        gameObjects[writePtr] = go;
                    }
                    writePtr++;
                }
            }
            if (writePtr !== totalCount) {
                gameObjects.length = writePtr;
            }
        }

        // Update the input manager at the end of every frame, regardless of pause state.
        // This ensures inputs like the pause key are always responsive.
        inputManager.update();
    };
}