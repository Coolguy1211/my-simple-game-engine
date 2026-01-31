# Bolt's Journal - Performance Learnings

## 2025-05-15 - In-place Array Compaction in Game Loops
**Learning:** Using `Array.prototype.filter()` every frame to remove destroyed objects is a performance anti-pattern in JavaScript game engines. It creates a new array every frame (60+ times per second), leading to excessive memory allocation and triggering frequent garbage collection pauses.
**Action:** Use an in-place write-pointer algorithm during the object update loop to compact the array. This is O(n), avoids allocations, and allows combining update and cleanup phases.

## 2025-05-15 - Uncaught Exceptions in requestAnimationFrame
**Learning:** Uncaught exceptions in scripts called within a `requestAnimationFrame` loop can halt the entire rendering process without necessarily logging a standard console error that Playwright's `console` listener catches.
**Action:** When verifying 3D applications, always use Playwright's `pageerror` event listener to capture uncaught exceptions that might be causing silent rendering failures.
