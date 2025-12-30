export default class {
  onStart() {
    console.log('Rotator script started!');
  }

  update(dt) {
    this.gameObject.transform.rotation.y += dt;
  }
}
