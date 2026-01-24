export default class Rotator {
    constructor(params = {}) {
        // No parameters for this script
    }

    onStart() {
        console.log('Rotator script started!');
    }

    update(deltaTime) {
        if (this.gameObject && this.gameObject.transform) {
            this.gameObject.transform.rotation.y += deltaTime;
        }
    }

    onCollisionEnter(other) {
        // No collision logic for this script
    }

    onDestroy() {
        // No cleanup logic for this script
    }
}
