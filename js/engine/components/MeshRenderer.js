export class MeshRenderer {
    constructor(mesh) {
        this.mesh = mesh;
    }

    onStart() {
        // The transform of the GameObject is the mesh itself, so we replace it.
        // We also need to carry over the position, rotation, and scale from the placeholder transform.
        const placeholderTransform = this.gameObject.transform;
        this.gameObject.transform = this.mesh;
        this.gameObject.transform.name = this.gameObject.name;
        this.gameObject.transform.position.copy(placeholderTransform.position);
        this.gameObject.transform.rotation.copy(placeholderTransform.rotation);
        this.gameObject.transform.scale.copy(placeholderTransform.scale);
    }

    onDestroy() {
        // Clean up Three.js resources to prevent memory leaks
        if (this.mesh.geometry) {
            this.mesh.geometry.dispose();
        }
        if (this.mesh.material) {
            // Material can be an array
            if (Array.isArray(this.mesh.material)) {
                this.mesh.material.forEach(material => material.dispose());
            } else {
                this.mesh.material.dispose();
            }
        }
    }
}