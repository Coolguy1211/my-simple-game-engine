## 2024-07-24 - Efficient In-Place Array Modification

**Learning:** Using `Array.prototype.filter()` to remove items from an array inside a performance-critical loop (like the main game loop) is a memory-inefficient pattern. It creates a new array on every iteration, leading to unnecessary memory allocation and increasing the workload for the garbage collector, which can cause frame stutters.

**Action:** In hot paths, prefer in-place modification. The optimal pattern is to use a reverse `for` loop with `Array.prototype.splice()` to remove items without creating a new array. This minimizes garbage collection pressure.