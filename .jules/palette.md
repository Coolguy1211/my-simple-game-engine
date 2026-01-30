## 2026-01-30 - Loading Feedback and A11y
**Learning:** In 3D engines, the initial load time can be significant due to assets like glTF models. A blank screen during this period feels like a crash or a hang. Providing immediate visual feedback with a loading screen improves perceived performance. Additionally, canvas elements are often opaque to screen readers; adding ARIA roles and labels is crucial for basic accessibility.
**Action:** Always implement a minimal loading state for async asset loading and ensure the primary canvas has descriptive ARIA attributes.
