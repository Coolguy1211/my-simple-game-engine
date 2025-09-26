# My Simple Game Engine

This is a simple data-driven game engine that uses `three.js` to render a 3D scene. The engine is designed to be easily extensible and is configured using a `game.json` file.

## How to Run

1.  You need a local web server to run this project due to browser security restrictions on loading files directly from the filesystem. A simple way to do this is to use Python's built-in HTTP server.
    *   If you have Python 3, run `python -m http.server` in the root directory of the project.
    *   If you have Python 2, run `python -m SimpleHTTPServer` in the root directory of the project.
2.  Open your web browser and navigate to `http://localhost:8000`.

## `game.json` Documentation

The `game.json` file defines the scene and the objects within it.

### Scene Configuration

The `scene` object has the following properties:

*   `background`: The background color of the scene, specified as a hexadecimal string (e.g., `"0xaaaaaa"`).

### Object Configuration

The `objects` array contains a list of game objects. Each object has the following properties:

*   `name`: A unique name for the object.
*   `type`: The type of the object. Currently, only `"Mesh"` is supported.
*   `geometry`: An object that defines the geometry of the mesh.
    *   `type`: The type of geometry (e.g., `"BoxGeometry"`). This should correspond to a `three.js` geometry class.
    *   `width`, `height`, `depth`: The dimensions of the geometry.
*   `material`: An object that defines the material of the mesh.
    *   `type`: The type of material (e.g., `"MeshPhongMaterial"`). This should correspond to a `three.js` material class.
    *   `color`: The color of the material, specified as a hexadecimal string.
*   `position`: An object with `x`, `y`, and `z` properties that define the initial position of the object.
*   `scripts`: An array of scripts to be attached to the object.

### Scripts

Scripts add behavior to game objects.

*   **`gravity`**: Applies a constant downward force to the object.
    *   `type`: `"gravity"`
*   **`horizontalMovement`**: Moves the object back and forth along the x-axis.
    *   `type`: `"horizontalMovement"`
    *   `speed`: (Optional) The speed of the movement. Defaults to `1`.
    *   `range`: (Optional) The range of the movement. Defaults to `1`.
*   **`keyboardInput`**: Moves the object based on keyboard input (arrow keys).
    *   `type`: `"keyboardInput"`
    *   `speed`: (Optional) The speed of the movement. Defaults to `2`.