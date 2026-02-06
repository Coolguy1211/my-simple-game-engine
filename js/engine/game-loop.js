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

            // Use a standard for loop to avoid iterator overhead.
            // We capture the length here to avoid processing objects added during this frame's update.
            const initialLength = gameObjects.length;
            for (let i = 0; i < initialLength; i++) {
                const gameObject = gameObjects[i];
                if (!gameObject.isDestroyed) {
                    gameObject.update(deltaTime, threeScene, inputManager);
                }
            }

            // Clean up destroyed objects in-place to avoid per-frame array allocations (filter).
            // We use a write pointer to shift active objects to the front of the array.
            let writeIndex = 0;
            for (let i = 0; i < gameObjects.length; i++) {
                if (!gameObjects[i].isDestroyed) {
                    gameObjects[writeIndex++] = gameObjects[i];
                }
            }
            // Shrink the array to the new size if objects were removed.
            if (writeIndex < gameObjects.length) {
                gameObjects.length = writeIndex;
            }

            // Update the debug manager after cleanup to ensure visualizations sync with the final object list.
            DebugManager.update();
        }

        // Update the input manager at the end of every frame, regardless of pause state.
        // This ensures inputs like the pause key are always responsive.
        inputManager.update();
    };
}