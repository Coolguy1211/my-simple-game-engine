import * as THREE from 'three';

async function main() {
    // Set up the renderer
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    // Set up the camera
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 15;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    // Set up the scene
    const scene = new THREE.Scene();

    // Add a light to the scene
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    // Load the game configuration from game.json
    const response = await fetch('game.json');
    const gameConfig = await response.json();

    // Set the background color
    scene.background = new THREE.Color(parseInt(gameConfig.scene.background));

    // Create game objects from the configuration
    const gameObjects = gameConfig.objects.map(objConfig => {
        // Create geometry
        const geometry = new THREE[objConfig.geometry.type](
            objConfig.geometry.width,
            objConfig.geometry.height,
            objConfig.geometry.depth
        );
        // Create material
        const material = new THREE[objConfig.material.type]({
            color: parseInt(objConfig.material.color)
        });
        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = objConfig.name;
        mesh.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);

        // Attach scripts and user data
        if (objConfig.scripts) {
            mesh.userData.scripts = objConfig.scripts;
            mesh.userData.velocity = new THREE.Vector3(0, 0, 0);
            mesh.userData.initialPosition = mesh.position.clone();
        }

        scene.add(mesh);
        return mesh;
    });

    // Function to resize the renderer to the display size
    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    let lastTime = 0;
    const floor = scene.getObjectByName('floor');

    // Keyboard state
    const keyboardState = {};
    window.addEventListener('keydown', (e) => {
        keyboardState[e.code] = true;
    });
    window.addEventListener('keyup', (e) => {
        keyboardState[e.code] = false;
    });

    // The main render loop
    function render(time) {
        time *= 0.001;  // convert time to seconds
        const deltaTime = time - lastTime;
        lastTime = time;

        // Resize the renderer if necessary
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // Update game objects
        gameObjects.forEach((obj) => {
            if (obj.userData.scripts) {
                const floorY = floor.position.y + floor.geometry.parameters.height / 2;

                // Process scripts
                obj.userData.scripts.forEach(script => {
                    if (script.type === 'gravity') {
                        const gravity = -3.8;
                        obj.userData.velocity.y += gravity * deltaTime;
                    }
                    if (script.type === 'horizontalMovement') {
                        const speed = script.speed || 1;
                        const range = script.range || 1;
                        obj.position.x = obj.userData.initialPosition.x + Math.sin(time * speed * 100) * range;
                    }
                    if (script.type === 'keyboardInput') {
                        const speed = script.speed || 2;
                        if (keyboardState['ArrowUp']) {
                            obj.userData.velocity.z = -speed;
                        } else if (keyboardState['ArrowDown']) {
                            obj.userData.velocity.z = speed;
                        } else {
                            obj.userData.velocity.z = 0;
                        }

                        if (keyboardState['ArrowLeft']) {
                            obj.userData.velocity.x = -speed;
                        } else if (keyboardState['ArrowRight']) {
                            obj.userData.velocity.x = speed;
                        } else {
                            obj.userData.velocity.x = 0;
                        }
                    }
                });

                // Apply velocity
                obj.position.x += obj.userData.velocity.x * deltaTime;
                obj.position.y += obj.userData.velocity.y * deltaTime;
                obj.position.z += obj.userData.velocity.z * deltaTime;

                // Collision with floor
                const cubeHeight = obj.geometry.parameters.height;
                if (obj.position.y - cubeHeight / 2 < floorY) {
                    obj.position.y = floorY + cubeHeight / 2;
                    obj.userData.velocity.y = 0;
                }
            }
        });

        // Render the scene
        renderer.render(scene, camera);

        // Request the next frame
        requestAnimationFrame(render);
    }

    // Start the render loop
    requestAnimationFrame(render);
}

main();