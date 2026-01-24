## 2024-05-20 - Initial setup

**Learning:** Set up Bolt's journal for critical learnings.
**Action:** Add entries for codebase-specific performance patterns or anti-patterns discovered during optimization work.

## 2024-05-20 - In-place array modification over `filter()` in game loops

**Learning:** Using `Array.prototype.filter()` within a high-frequency loop (like the main game loop) to remove items is a performance anti-pattern. It allocates a new array every frame, leading to unnecessary memory churn and triggering the garbage collector, which can cause frame-rate stutters.
**Action:** For performance-critical code that filters arrays, always prefer in-place removal algorithms, such as iterating backwards with a `for` loop and using `splice()`, to avoid memory allocation.
