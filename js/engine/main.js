import * as THREE from 'three';
import SceneManager from './SceneManager.js';
import AudioManager from './AudioManager.js';
import TimeManager from './TimeManager.js';
import { createGameLoop } from './game-loop.js';

async function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    // Register all scenes
    SceneManager.registerScene('level-1', 'scenes/level-1.json');

    // Load the initial scene
    try {
        await SceneManager.loadScene('level-1');
    } catch (error) {
        console.error("Failed to load the initial scene. The application cannot start.", error);
        return;
    }

    // Initialize core managers now that a scene is loaded
    const initialScene = SceneManager.getActiveScene();
    if (initialScene && initialScene.camera) {
        AudioManager.init(initialScene.camera);
    } else {
        console.error("Scene loaded, but no camera was found. Audio will not function correctly.");
    }

    // Start the game time
    TimeManager.play();

    // The game loop is now independent of any specific scene's data
    const gameLoop = createGameLoop(renderer, canvas);

    function resizeRendererToDisplaySize(renderer, camera) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            const aspect = canvas.clientWidth / canvas.clientHeight;
            if (camera.isPerspectiveCamera) {
                camera.aspect = aspect;
            } else if (camera.isOrthographicCamera) {
                const size = camera.top;
                camera.left = size * aspect / -2;
                camera.right = size * aspect / 2;
            }
            camera.updateProjectionMatrix();
        }
    }

    function render(time) {
        const activeScene = SceneManager.getActiveScene();
        if (!activeScene || !activeScene.isLoaded) {
            requestAnimationFrame(render);
            return;
        }

        const { threeScene, camera } = activeScene;
        resizeRendererToDisplaySize(renderer, camera);

        // The game loop now uses the TimeManager to control updates
        gameLoop(time);

        renderer.render(threeScene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();