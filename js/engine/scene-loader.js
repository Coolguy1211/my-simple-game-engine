import * as THREE from 'three';
import { loadScripts } from './script-manager.js';

export async function loadScene() {
    const response = await fetch('/game.json');
    const gameConfig = await response.json();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(parseInt(gameConfig.scene.background));

    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const cameraConfig = gameConfig.camera;
    const camera = new THREE[cameraConfig.type](
        cameraConfig.fov,
        window.innerWidth / window.innerHeight,
        cameraConfig.near,
        cameraConfig.far
    );
    camera.position.set(cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z);

    if (cameraConfig.scripts) {
        camera.userData.scripts = await loadScripts(cameraConfig.scripts);
    }

    scene.add(camera);

    const gameObjects = await Promise.all(gameConfig.objects.map(async objConfig => {
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
            mesh.userData.scripts = await loadScripts(objConfig.scripts);
            mesh.userData.velocity = new THREE.Vector3(0, 0, 0);
            mesh.userData.initialPosition = mesh.position.clone();
        }

        scene.add(mesh);
        return mesh;
    }));

    return { scene, camera, gameObjects };
}