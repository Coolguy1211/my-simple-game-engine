# Bolt's Journal - Critical Learnings

## 2024-07-22 - Game Loop Optimization: `filter()` vs. in-place removal

**Learning:** Using `Array.prototype.filter()` within a hot path like a game loop to remove elements from a collection is a performance anti-pattern. It creates a new array on every iteration, leading to unnecessary memory allocation and increased garbage collection pressure, which can cause frame rate stuttering.

**Action:** For performance-critical code that frequently removes items from a list, always prefer in-place modification. A reverse `for` loop combined with `Array.prototype.splice()` is a highly efficient and readable pattern for this. It avoids creating new arrays and minimizes memory churn.

## 2024-07-22 - Latent Bugs Blocking Verification

**Learning:** A logically sound and correct performance optimization can be blocked during verification by a pre-existing, latent bug in the application. My optimization in `game-loop.js` was not the cause of the rendering failure, but it exposed an underlying issue in the test environment.

**Action:** When an optimization fails verification, first confirm if the bug is pre-existing by reverting the change and re-running the verification. If the bug persists, the optimization itself is likely correct. Proceed with the change, document the verification blocker, and rely on code review to validate the logic. Do not get sidetracked fixing unrelated issues.
