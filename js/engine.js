import * as THREE from 'three';

async function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

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
        mesh.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);
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

    function render(time) {
        time *= 0.001;  // convert time to seconds

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        gameObjects.forEach((obj, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            obj.rotation.x = rot;
            obj.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();