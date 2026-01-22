export default class {
    onStart() {
        console.log('External rotator script started!');
    }

    update(dt) {
        this.gameObject.transform.rotation.y += dt;
    }
}
