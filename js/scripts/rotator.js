export default class {
    onStart() {
        console.log('Inline script started!');
    }
    update(dt) {
        this.gameObject.transform.rotation.y += dt;
    }
}
