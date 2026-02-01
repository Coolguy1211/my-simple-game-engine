## 2025-05-14 - Optimize Game Loop for Reduced GC Pressure
**Learning:** Using `Array.prototype.filter()` every frame in the main game loop causes unnecessary memory allocation and garbage collection pressure, especially as the number of GameObjects grows. A standard `for` loop combined with an in-place write-pointer algorithm is much more efficient. Additionally, reordering the `DebugManager.update()` call to occur *after* the cleanup ensures that debug visualizations are perfectly synced with the active object state for that frame.
**Action:** Always prefer in-place array manipulation and standard `for` loops in hot paths like the main game loop.

## 2025-05-14 - Optimize Component Scripts and Fix glTF Crash
**Learning:** Performing frequent scene lookups (e.g., `scene.getObjectByName`) and instantiating new objects (e.g., `new THREE.Box3()`) inside an `update()` method that runs every frame is a significant performance bottleneck. Furthermore, relying on `geometry.parameters` for object dimensions fails for complex models like glTFs.
**Action:** Cache object references in `onStart()` or lazily in `update()`. Pre-allocate math objects (Vectors, Boxes, etc.) as private properties during initialization. Use `Box3.setFromObject()` for robust and efficient spatial calculations.
