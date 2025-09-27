Modular 3D Game Engine

A modular, data-driven 3D game engine built with Three.js.
It enables creating and managing scenes, objects, and behaviors using a flexible component-based architecture and JSON configuration files.

✨ Features
Scene Configuration

Define your game world using a game.json file.

Supports cameras, lights, glTF models, materials, textures, and skyboxes.

Modular Engine

GameObject / Component System with lifecycle hooks:

onStart → initialization

update → per-frame logic

onDestroy → cleanup

Components are reusable, flexible, and data-driven.

Scene Management

SceneManager allows loading and switching between multiple JSON-defined scenes.

scene-loader builds environments from configuration objects.

Core Managers

InputManager → keyboard and mouse input.

AudioManager → positional audio loading & playback.

TimeManager → play, pause, stop simulation states.

DebugManager → toggleable debug visuals like bounding boxes.

EventBus → decoupled global event communication.

Data-Driven Loading

JSON-defined assets for cameras, lights, objects, and environments.

No hardcoded elements—scenes are entirely configurable.

Skybox Support

Immersive 3D backgrounds for realistic environments.

🚀 Development Roadmap
✅ Phase 1 – Foundational Architecture (Completed)

Established the component-based system.

Implemented scene management and data-driven loading.

Added core managers for input, audio, time, debug, and events.

Enabled skybox support for richer worlds.

🔜 Phase 2 – Next Steps

Physics engine integration.

Networking & multiplayer support.

Advanced rendering (shadows, PBR materials).

Plugin ecosystem for extending engine functionality.

📂 Example Scene Configuration
The engine will automatically load and execute the script. The filename (without the `.js` extension) is used as the `type`. Any additional properties in the script configuration will be passed to the `init` and `update` functions as the `params` object.
