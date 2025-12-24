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

            // ⚡ Bolt: In-place removal of destroyed objects
            // The previous implementation used Array.prototype.filter(), which created a new
            // array on every frame. This is a performance anti-pattern as it leads to
            // unnecessary memory allocation and garbage collection pressure.
            //
            // By iterating backwards and using splice(), we can remove items from the
            // array in-place, which is significantly more performant. A reverse loop is
            // crucial to avoid index shifting issues that would occur with a forward loop
            // when an item is removed.
            //
            // Expected Impact: Reduced memory churn and fewer GC pauses, leading to a
            // smoother frame rate, especially in scenes with many short-lived objects.
            for (let i = activeScene.gameObjects.length - 1; i >= 0; i--) {
                if (activeScene.gameObjects[i].isDestroyed) {
                    activeScene.gameObjects.splice(i, 1);
                }
            }
        }

        // Update the input manager at the end of every frame, regardless of pause state.
        // This ensures inputs like the pause key are always responsive.
        inputManager.update();
    };
}