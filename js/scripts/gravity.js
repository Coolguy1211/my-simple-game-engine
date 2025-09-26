const gravity = -9.8;

export default {
    update: (obj, deltaTime, keyboardState, scene) => {
        if (obj.userData.velocity) {
            obj.userData.velocity.y += gravity * deltaTime;

            const floor = scene.getObjectByName('floor');
            if (floor) {
                const floorY = floor.position.y + floor.geometry.parameters.height / 2;
                const cubeHeight = obj.geometry.parameters.height;

                if (obj.position.y - cubeHeight / 2 < floorY) {
                    obj.position.y = floorY + cubeHeight / 2;
                    obj.userData.velocity.y = 0;
                }
            }
        }
    }
};