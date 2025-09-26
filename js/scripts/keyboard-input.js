export default {
    update: (obj, deltaTime, keyboardState, scene, params) => {
        const speed = params.speed || 2;
        if (obj.userData.velocity) {
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
    }
};