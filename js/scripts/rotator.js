export default class Rotator {
    constructor() {
        // No initial properties needed
    }

    onStart() {
        console.log('Rotator script started!');
    }

    update(deltaTime) {
        // Simple rotation around the Y-axis
        this.gameObject.transform.rotation.y += deltaTime;
    }

    onDestroy() {
        // No cleanup needed for this script
    }
}
