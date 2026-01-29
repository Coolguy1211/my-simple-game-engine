export default class Rotator {
    constructor(params = {}) {}

    onStart() {
        console.log('Rotator script started!');
    }

    update(dt) {
        this.gameObject.transform.rotation.y += dt;
    }
}
