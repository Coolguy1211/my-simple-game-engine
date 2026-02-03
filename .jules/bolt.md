## 2025-02-03 - [In-place array cleanup and loop optimizations]
**Learning:** Using `filter()` every frame in the core game loop causes significant memory churn and GC pressure. Replacing it with an in-place write-pointer algorithm is much more efficient. Also, modern JS engines can still benefit from standard `for` loops over `for...of` in extremely hot paths (e.g. 1000s of objects).
**Action:** Use in-place cleanup for dynamic collections in hot paths. Always capture the array length just before the cleanup phase to safely handle objects added during the update phase.

## 2025-02-03 - [Robust height calculation for glTF]
**Learning:** glTF models don't expose `geometry.parameters.height` like basic Three.js geometries. `THREE.Box3.setFromObject()` is the robust way to get dimensions, but it's expensive if done every frame.
**Action:** Pre-calculate or cache object dimensions using `Box3` in `onStart` or only when the model changes.
