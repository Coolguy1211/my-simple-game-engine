let lastTime = 0;
const keyboardState = {};

window.addEventListener('keydown', (e) => {
    keyboardState[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keyboardState[e.code] = false;
});

export function createGameLoop(renderer, scene, camera, gameObjects) {
    // Initialize scripts for game objects
    gameObjects.forEach(obj => {
        if (obj.userData.scripts) {
            obj.userData.scripts.forEach(script => {
                if (script.init) {
                    script.init(obj, scene, script.params);
                }
            });
        }
    });

    // Initialize scripts for the camera
    if (camera.userData.scripts) {
        camera.userData.scripts.forEach(script => {
            if (script.init) {
                script.init(camera, scene, script.params);
            }
        });
    }

    return function gameLoop(time) {
        const deltaTime = (time - (lastTime || time)) * 0.001;
        lastTime = time;

        // Update game objects
        gameObjects.forEach(obj => {
            if (obj.userData.scripts) {
                obj.userData.scripts.forEach(script => {
                    if (script.update) {
                        script.update(obj, deltaTime, keyboardState, scene, script.params);
                    }
                });

                if (obj.userData.velocity) {
                    obj.position.x += obj.userData.velocity.x * deltaTime;
                    obj.position.y += obj.userData.velocity.y * deltaTime;
                    obj.position.z += obj.userData.velocity.z * deltaTime;
                }
            }
        });

        // Update camera
        if (camera.userData.scripts) {
            camera.userData.scripts.forEach(script => {
                if (script.update) {
                    script.update(camera, deltaTime, keyboardState, scene, script.params);
                }
            });
        }
    };
}