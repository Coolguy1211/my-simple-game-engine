export default class Rotator {
    onStart() {
        console.log('Rotator script has started!');
    }
    update(dt) {
        if (this.gameObject && this.gameObject.transform) {
            this.gameObject.transform.rotation.y += dt;
        }
    }
}
