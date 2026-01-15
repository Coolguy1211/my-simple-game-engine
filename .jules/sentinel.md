## 2024-07-29 - RCE Vulnerability in Scene Loading

**Vulnerability:** A critical Remote Code Execution (RCE) vulnerability existed in `js/engine/script-manager.js`. The `loadScripts` function used `new Function()` to execute JavaScript code directly from a `source` property in scene JSON files.

**Learning:** This vulnerability existed because the application's design allowed for "inline scripts" to be defined directly in the scene configuration files. While this was intended for convenience, it created a massive security risk, as any user who could control the contents of a scene file could execute arbitrary code.

**Prevention:** To prevent this type of vulnerability in the future, we should avoid executing code from data sources. All scripts should be loaded from trusted, file-based sources. The inline script feature was removed entirely to eliminate this risk.
