import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GameObject } from './GameObject.js';
import { MeshRenderer } from './components/MeshRenderer.js';
import { loadScripts } from './script-manager.js';

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

function loadLights(scene, lightsConfig) {
    if (!lightsConfig) return;
    lightsConfig.forEach(config => {
        const LightClass = THREE[config.type];
        if (!LightClass) {
            console.warn(`Invalid light type: ${config.type}`);
            return;
        }
        const color = config.color ? parseInt(config.color) : 0xFFFFFF;
        const intensity = config.intensity !== undefined ? config.intensity : 1;
        const light = new LightClass(color, intensity);
        if (config.position) {
            light.position.set(config.position.x, config.position.y, config.position.z);
        }
        scene.add(light);
    });
}

async function createMaterial(config) {
    if (!config) return new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const MaterialClass = THREE[config.type] || THREE.MeshStandardMaterial;
    const materialParams = {};
    for (const key in config) {
        if (typeof config[key] === 'string' && key.endsWith('Map')) continue;
        if (key === 'color') materialParams.color = parseInt(config[key]);
        else if (key !== 'type' && key !== 'repeat') materialParams[key] = config[key];
    }
    const texturePromises = Object.keys(config)
        .filter(key => typeof config[key] === 'string' && key.endsWith('Map'))
        .map(key => textureLoader.loadAsync(config[key]).then(texture => {
            if (config.repeat) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(config.repeat.x || 1, config.repeat.y || 1);
            }
            materialParams[key] = texture;
        }));
    await Promise.all(texturePromises);
    return new MaterialClass(materialParams);
}

async function loadCamera(scene, cameraConfig) {
    const cameraGO = new GameObject('MainCamera');
    let camera;
    const aspect = window.innerWidth / window.innerHeight;
    switch (cameraConfig.type) {
        case 'PerspectiveCamera':
            camera = new THREE.PerspectiveCamera(cameraConfig.fov || 75, aspect, cameraConfig.near || 0.1, cameraConfig.far || 1000);
            break;
        case 'OrthographicCamera':
            const size = cameraConfig.size || 10;
            camera = new THREE.OrthographicCamera(size * aspect / -2, size * aspect / 2, size / 2, size / -2, cameraConfig.near || 0.1, cameraConfig.far || 1000);
            camera.zoom = cameraConfig.zoom || 1;
            break;
        default:
            camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    }
    camera.position.set(cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z);
    camera.updateProjectionMatrix();
    cameraGO.transform = camera;
    if (cameraConfig.scripts) {
        const components = await loadScripts(cameraConfig.scripts);
        for (const component of components) cameraGO.addComponent(component);
    }
    scene.add(cameraGO.transform);
    return cameraGO;
}

async function loadGameObject(scene, objConfig) {
    const gameObject = new GameObject(objConfig.name);
    if (objConfig.position) gameObject.transform.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);
    if (objConfig.model) {
        const gltf = await gltfLoader.loadAsync(objConfig.model);
        gameObject.transform = gltf.scene;
        gameObject.transform.name = gameObject.name;
        if (objConfig.position) gameObject.transform.position.set(objConfig.position.x, objConfig.position.y, objConfig.position.z);
    } else if (objConfig.geometry) {
        const geometry = new THREE[objConfig.geometry.type](objConfig.geometry.width || 1, objConfig.geometry.height || 1, objConfig.geometry.depth || 1);
        const material = await createMaterial(objConfig.material);
        gameObject.addComponent(new MeshRenderer(new THREE.Mesh(geometry, material)));
    }
    if (objConfig.scripts) {
        const components = await loadScripts(objConfig.scripts);
        for (const component of components) gameObject.addComponent(component);
    }
    scene.add(gameObject.transform);
    return gameObject;
}

async function loadGameObjects(scene, objectsConfig) {
    return Promise.all(objectsConfig.map(objConfig => loadGameObject(scene, objConfig)));
}

export async function loadSceneFromConfig(gameConfig) {
    const scene = new THREE.Scene();

    // Load skybox or set background color
    if (gameConfig.scene.skybox) {
        try {
            const texture = await cubeTextureLoader.loadAsync(gameConfig.scene.skybox);
            scene.background = texture;
        } catch (error) {
            console.error("Failed to load skybox, falling back to color.", error);
            scene.background = new THREE.Color(parseInt(gameConfig.scene.background || "0x101010"));
        }
    } else {
        scene.background = new THREE.Color(parseInt(gameConfig.scene.background || "0x101010"));
    }

    loadLights(scene, gameConfig.lights);
    const cameraGO = await loadCamera(scene, gameConfig.camera);
    const gameObjects = await loadGameObjects(scene, gameConfig.objects || []);
    const allGameObjects = [cameraGO, ...gameObjects];
    for (const go of allGameObjects) {
        go.onStart(scene);
    }
    return { scene, camera: cameraGO.transform, gameObjects: allGameObjects };
}