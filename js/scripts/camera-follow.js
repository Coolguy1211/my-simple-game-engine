import * as THREE from 'three';

let targetObject;
let offset;

export default {
    init: (camera, scene, params) => {
        targetObject = scene.getObjectByName(params.target);
        if (targetObject) {
            offset = camera.position.clone().sub(targetObject.position);
        }
    },
    update: (camera, deltaTime, _, scene, params) => {
        if (targetObject) {
            const targetPosition = targetObject.position.clone().add(offset);
            camera.position.lerp(targetPosition, params.smooth_speed);
            camera.lookAt(targetObject.position);
        }
    }
};