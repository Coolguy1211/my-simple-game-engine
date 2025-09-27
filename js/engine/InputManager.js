import * as THREE from 'three';

export class InputManager {
    constructor(canvas) {
        this.canvas = canvas;

        // Keyboard state
        this.keyState = {};
        this.prevKeyState = {};

        // Mouse state
        this.mouseState = {};
        this.prevMouseState = {};
        this.mousePosition = new THREE.Vector2();
        this.mouseDelta = new THREE.Vector2();
        this.prevMousePosition = new THREE.Vector2();

        // Bind event listeners
        window.addEventListener('keydown', (e) => this.keyState[e.code] = true);
        window.addEventListener('keyup', (e) => this.keyState[e.code] = false);

        this.canvas.addEventListener('mousedown', (e) => this.mouseState[e.button] = true);
        this.canvas.addEventListener('mouseup', (e) => this.mouseState[e.button] = false);
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });
    }

    /**
     * This must be called at the end of each frame to correctly
     * track "pressed this frame" events and calculate deltas.
     */
    update() {
        // Update mouse delta
        this.mouseDelta.copy(this.mousePosition).sub(this.prevMousePosition);
        this.prevMousePosition.copy(this.mousePosition);

        // Update previous states
        this.prevKeyState = { ...this.keyState };
        this.prevMouseState = { ...this.mouseState };
    }

    // --- Keyboard Methods ---
    isKeyDown(keyCode) {
        return this.keyState[keyCode] || false;
    }

    isKeyUp(keyCode) {
        return !this.isKeyDown(keyCode);
    }

    isKeyPressed(keyCode) {
        return this.isKeyDown(keyCode) && !this.prevKeyState[keyCode];
    }

    // --- Mouse Methods ---
    isMouseButtonDown(button) {
        return this.mouseState[button] || false;
    }

    isMouseButtonUp(button) {
        return !this.isMouseButtonDown(button);
    }

    isMouseButtonPressed(button) {
        return this.isMouseButtonDown(button) && !this.prevMouseState[button];
    }

    getMousePosition() {
        return this.mousePosition.clone();
    }

    getMouseDelta() {
        return this.mouseDelta.clone();
    }
}