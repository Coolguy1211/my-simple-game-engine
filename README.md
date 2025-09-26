# Modular 3D Game Engine

This project is a modular 3D game engine built with three.js. It allows for creating and managing game scenes, objects, and behaviors through a flexible, data-driven architecture.

## Features

- **Scene Configuration**: Define your game world using a simple `game.json` file, specifying objects, materials, and their properties.
- **Modular Engine**: The engine is broken down into logical modules for scene loading, script management, and the game loop, making it easy to extend and maintain.
- **Custom Scripts**: Attach custom behaviors to any game object, including the camera, by creating simple JavaScript modules.
- **Flexible Camera**: Configure the camera in `game.json` and attach scripts to it for dynamic behaviors like following a target.

## Getting Started

To run the project, simply open the `index.html` file in a web browser.

## How to Use

### Scene Configuration

The `game.json` file is the heart of your game. Here's a breakdown of its structure:

- **`scene`**: Defines global scene properties, such as the background color.
- **`camera`**: Configures the main camera, including its type, field of view (FOV), and position. You can also attach scripts to the camera.
- **`objects`**: An array of game objects, each with its own geometry, material, position, and scripts.

### Creating Custom Scripts

To create a custom behavior, add a new JavaScript file to the `js/scripts/` directory. Each script must export a default object containing `init` and/or `update` methods:

- **`init(object, scene, params)`**: Called once when the script is first loaded. Use it for one-time setup.
- **`update(object, deltaTime, keyboardState, scene, params)`**: Called on every frame. Use it for continuous behaviors.

To attach a script to an object, add it to the `scripts` array in `game.json`:

```json
"scripts": [
  {
    "type": "your-script-name",
    "some_param": "some_value"
  }
]
```

The engine will automatically load and execute the script. The filename (without the `.js` extension) is used as the `type`. Any additional properties in the script configuration will be passed to the `init` and `update` functions as the `params` object.