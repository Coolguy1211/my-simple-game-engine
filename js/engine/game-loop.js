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

            // Update all game objects using a standard for loop for better performance.
            const gameObjectsCount = gameObjects.length;
            for (let i = 0; i < gameObjectsCount; i++) {
                const gameObject = gameObjects[i];
                if (!gameObject.isDestroyed) {
                    gameObject.update(deltaTime, threeScene, inputManager);
                }
            }

            // Clean up destroyed objects using an in-place write-pointer algorithm
            // to avoid the performance overhead of .filter() and array reallocation every frame.
            let writeIdx = 0;
            for (let readIdx = 0; readIdx < gameObjects.length; readIdx++) {
                const gameObject = gameObjects[readIdx];
                if (!gameObject.isDestroyed) {
                    gameObjects[writeIdx] = gameObject;
                    writeIdx++;
                }
            }
            gameObjects.length = writeIdx;

            // Update the debug manager after cleanup to ensure visualizations are synced
            // with the final set of active game objects for this frame.
            DebugManager.update();
        }

        // Update the input manager at the end of every frame, regardless of pause state.
        // This ensures inputs like the pause key are always responsive.
        inputManager.update();
    };
}