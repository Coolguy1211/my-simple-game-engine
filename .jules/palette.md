## 2025-05-14 - Loading State Concurrency
**Learning:** When implementing loading flags and overlays with a `try...finally` pattern, the concurrency guard (checking if already loading) must reside outside the `try` block. If placed inside, the `finally` block will execute on an early return, prematurely resetting the flag and hiding the UI for the original operation still in progress.
**Action:** Always structure async lifecycle methods with the guard first, then the `try...finally` block starting only once the operation is guaranteed to proceed.

## 2025-05-14 - 3D Canvas Accessibility
**Learning:** Three.js canvas elements are invisible to screen readers by default. Providing `role="img"` and a descriptive `aria-label` makes the 3D scene identifiable. Adding `tabindex="0"` and custom `:focus-visible` styles ensures that the interactive viewport is keyboard-accessible and has clear visual feedback when focused.
**Action:** Include a standard accessibility set (role, aria-label, tabindex, focus styles) for all 3D canvas entry points.
