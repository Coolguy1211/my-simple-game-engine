## 2024-01-29 - In-place Array Modification vs. `filter()` in Hot Loops

**Learning:** Using `Array.prototype.filter()` inside a performance-critical, hot loop (like a game engine's main game loop) is a significant performance anti-pattern. It allocates a new array on every single iteration, leading to constant memory churn. This puts pressure on the garbage collector, which can cause unpredictable stalls or "jank," degrading the user experience.

**Action:** For array cleanup operations in any hot loop, I will always prefer an in-place removal algorithm (e.g., using a two-pointer approach to shift and truncate the array). This avoids per-frame memory allocations entirely, resulting in a more stable and performant application.
