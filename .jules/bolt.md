## 2025-05-14 - Game Loop and Component Hot Path Optimization
**Learning:** In a Three.js engine, standard `for` loops are significantly more efficient than `for...of` or `filter()` in hot paths (60 FPS) because they avoid iterator and array allocations, reducing GC pressure. Also, per-frame scene graph traversal (`getObjectByName`) is a major bottleneck that can be easily mitigated by caching references.
**Action:** Always prioritize standard `for` loops and reference caching for any logic executed within the `update` cycle.
