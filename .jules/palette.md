## 2026-02-01 - [Balancing UX and Line Count]
**Learning:** High-quality UX (like loading screens with transitions and animations) can often be implemented compactly by using modern CSS (like `inset: 0`) and inline styles with `Object.assign`. This is especially useful in micro-UX tasks with strict line count limits.
**Action:** Use CSS shorthand properties and template literals for HTML/style injection to keep UX enhancements self-contained and concise.

## 2026-02-01 - [Accessibility for Canvas]
**Learning:** Three.js canvas elements are often invisible to screen readers. Adding `role="img"` and a descriptive `aria-label` provides immediate accessibility value for 3D applications.
**Action:** Always include accessibility roles and labels for the main canvas in 3D projects.
