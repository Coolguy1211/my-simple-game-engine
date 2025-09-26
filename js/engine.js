import * as THREE from 'three';

async function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 15;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;

    const scene = new THREE.Scene();

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const response = await fetch('game.json');
    const gameConfig = await response.json();

    scene.background = new THREE.Color(parseInt(gameConfig.scene.background));

    const gameObjects = gameConfig.objects.map(objConfig => {
        const geometry = new THREE[objConfig.geometry.type](
            objConfig.geometry.width,
            objConfig.geometry.height,
            objConfig.geometry.depth
        );
        const material = new THREE[objConfig.material.type]({
            color: parseInt(objConfig.material.color)
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = objConfig.name;
        mesh.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);

        if (objConfig.scripts) {
            mesh.userData.scripts = objConfig.scripts;
            mesh.userData.velocity = new THREE.Vector3(0, 0, 0);
            mesh.userData.initialPosition = mesh.position.clone();
        }

        scene.add(mesh);
        return mesh;
    });

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

    function render(time) {
        time *= 0.001;  // convert time to seconds
        const deltaTime = time - lastTime;
        lastTime = time;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        gameObjects.forEach((obj) => {
            if (obj.userData.scripts) {
                const floorY = floor.position.y + floor.geometry.parameters.height / 2;

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
                });

                obj.position.y += obj.userData.velocity.y * deltaTime;

                // Collision with floor
                const cubeHeight = obj.geometry.parameters.height;
                if (obj.position.y - cubeHeight / 2 < floorY) {
                    obj.position.y = floorY + cubeHeight / 2;
                    obj.userData.velocity.y = 0;
                }
            }
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();