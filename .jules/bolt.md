## 2025-05-14 - [In-place array cleanup]
**Learning:** Using `Array.prototype.filter()` in a high-frequency game loop (every frame) is a performance anti-pattern. It creates a new array and causes frequent Garbage Collection (GC) spikes, especially as the number of GameObjects grows.
**Action:** Replace `filter()` with an in-place write-pointer algorithm to reuse the existing array and avoid memory allocations.

## 2025-05-14 - [Robust and Efficient Geometry Access]
**Learning:** Accessing `geometry.parameters` on arbitrary Three.js objects (especially glTF models) is unsafe and can lead to runtime crashes. Using `Box3.setFromObject()` is more robust but can be expensive if new objects are created every frame.
**Action:** Use cached `Box3` and `Vector3` instances to calculate object bounds efficiently.
