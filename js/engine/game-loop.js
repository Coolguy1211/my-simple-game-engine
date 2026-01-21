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

            // Update all game objects
            for (const gameObject of gameObjects) {
                if (!gameObject.isDestroyed) {
                    gameObject.update(deltaTime, threeScene, inputManager);
                }
            }

            // Update the debug manager to sync visualizations
            DebugManager.update();

            // Clean up destroyed objects.
            // This uses a more efficient in-place removal algorithm to avoid creating a new array every frame.
            //
            // Why this is faster:
            // 1. No Allocation: It doesn't allocate a new array, which prevents the garbage collector
            //    from having to clean up the old one later. This reduces GC pauses and stutters.
            // 2. Single Pass: It iterates through the list once, moving elements instead of creating a new list.
            //
            // How it works:
            // - It maintains a "write" index (`j`) for the next position to fill with a non-destroyed object.
            // - It iterates with a "read" index (`i`). If `gameObjects[i]` is NOT destroyed, it's moved to `gameObjects[j]`.
            // - `j` is only incremented when a "good" object is found.
            // - After the loop, the array is truncated to the new size `j`.
            let j = 0;
            for (let i = 0; i < activeScene.gameObjects.length; i++) {
                const go = activeScene.gameObjects[i];
                if (!go.isDestroyed) {
                    activeScene.gameObjects[j] = go;
                    j++;
                }
            }
            activeScene.gameObjects.length = j;
        }

        // Update the input manager at the end of every frame, regardless of pause state.
        // This ensures inputs like the pause key are always responsive.
        inputManager.update();
    };
}