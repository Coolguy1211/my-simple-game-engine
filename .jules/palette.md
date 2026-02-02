# Palette's Journal

## 2025-05-15 - [Loading Screen Pattern]
**Learning:** Providing immediate visual feedback during async operations (like scene loading) is critical in 3D applications to prevent users from perceiving the app as crashed, especially when asset loading can be slow or encounter errors. For status updates, `role="status"` and `aria-live="polite"` ensure screen readers announce the state change correctly.
**Action:** Always use a `try...finally` pattern in the manager responsible for async operations to ensure loading states are cleared even if an error occurs.
