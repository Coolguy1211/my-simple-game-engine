# Modular 3D Game Engine

A modular, data-driven 3D game engine built with Three.js. It enables creating and managing scenes, objects, and behaviors using a flexible component-based architecture and JSON configuration files.

## 🚀 Getting Started

This project is built with standard web technologies and requires no complex installation or build process. All you need is a local web server to run it.

### Prerequisites

- A modern web browser that supports ES modules.
- A local web server.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Run a local web server:**

    If you have Python 3 installed, you can use its built-in HTTP server:
    ```bash
    python -m http.server
    ```

    Alternatively, you can use other tools like `live-server` for Node.js:
    ```bash
    npx live-server
    ```

3.  **Open your browser:**

    Navigate to `http://localhost:8000` (or the port your server is running on) to see the engine in action.

## Usage

To create a new scene, you simply need to create a new JSON file in the `scenes/` directory. The engine will automatically load the scene specified in `js/engine/main.js`. By default, this is `level-1.json`.

### Scene Configuration

Here is an example of a complete scene configuration from `scenes/level-1.json`:

```json
{
  "scene": {
    "background": "0x101010",
    "skybox": [
      "https://threejs.org/examples/textures/cube/pisa/px.png",
      "https://threejs.org/examples/textures/cube/pisa/nx.png",
      "https://threejs.org/examples/textures/cube/pisa/py.png",
      "https://threejs.org/examples/textures/cube/pisa/ny.png",
      "https://threejs.org/examples/textures/cube/pisa/pz.png",
      "https://threejs.org/examples/textures/cube/pisa/nz.png"
    ]
  },
  "camera": {
    "type": "PerspectiveCamera",
    "fov": 75,
    "near": 0.1,
    "far": 1000,
    "position": { "x": 0, "y": 5, "z": 10 },
    "scripts": [
      {
        "type": "camera-follow",
        "target": "player_character",
        "smooth_speed": 0.125
      }
    ]
  },
  "lights": [
    { "type": "AmbientLight", "color": "0x404040", "intensity": 2 },
    { "type": "DirectionalLight", "color": "0xffffff", "intensity": 1, "position": { "x": -1, "y": 2, "z": 4 } }
  ],
  "objects": [
    {
      "name": "player_character",
      "model": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
      "position": { "x": 0, "y": 2, "z": 0 },
      "scripts": [
        { "type": "gravity" },
        { "type": "keyboard-input" },
        { "type": "AudioSource", "src": "https://cdn.jsdelivr.net/gh/jules-labs/testing-files@main/quack.mp3", "volume": 0.5 }
      ]
    },
    {
      "name": "floor",
      "type": "Mesh",
      "geometry": { "type": "BoxGeometry", "width": 10, "height": 0.5, "depth": 10 },
      "material": { "type": "MeshPhongMaterial", "color": "0xffffff", "map": "https://threejs.org/examples/textures/checker.png" },
      "position": { "x": 0, "y": -2, "z": 0 }
    }
  ]
}
```

### Inline Scripts

In addition to loading scripts from external files, you can define them directly within your scene's JSON file. This is useful for small, unique behaviors that don't require a separate file.

To create an inline script, use the `source` property instead of `type`. The value of `source` should be a string containing a JavaScript class definition. This class must have `onStart`, `update`, and/or `onDestroy` methods, just like a file-based script.

Here is an example of an object with an inline script that makes it rotate:

```json
{
  "name": "rotator",
  "type": "Mesh",
  "geometry": { "type": "BoxGeometry", "width": 1, "height": 1, "depth": 1 },
  "material": { "type": "MeshPhongMaterial", "color": "0x00ff00" },
  "position": { "x": 2, "y": 0, "z": -2 },
  "scripts": [
    {
      "source": "class { onStart() { console.log('Inline script started!'); } update(dt) { this.gameObject.transform.rotation.y += dt; } }"
    }
  ]
}
```

> **Note:** Inline scripts are executed using `new Function()`, which has security implications. Only use scene files from trusted sources.

## ✨ Features

- **Scene Configuration:** Define your game world using JSON files. Supports cameras, lights, glTF models, materials, textures, and skyboxes.
- **Modular Engine:** A `GameObject` / `Component` system with lifecycle hooks (`onStart`, `update`, `onDestroy`).
- **Scene Management:** The `SceneManager` allows for loading and switching between multiple JSON-defined scenes.
- **Core Managers:** Includes managers for input, audio, time, debugging, and a global event bus.
- **Data-Driven Loading:** No hardcoded elements—scenes are entirely configurable.
- **Skybox Support:** Immersive 3D backgrounds for realistic environments.

## Roadmap

- **Phase 1 – Foundational Architecture (Completed)**
  - Established the component-based system.
  - Implemented scene management and data-driven loading.
  - Added core managers for input, audio, time, debug, and events.
  - Enabled skybox support for richer worlds.
- **Phase 2 – Next Steps**
  - Physics engine integration.
  - Networking & multiplayer support.
  - Advanced rendering (shadows, PBR materials).
  - Plugin ecosystem for extending engine functionality.

## 📜 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.