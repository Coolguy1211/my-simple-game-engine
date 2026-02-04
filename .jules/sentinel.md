## 2025-05-15 - RCE via Inline Scripts in JSON

**Vulnerability:** Remote Code Execution (RCE) via `new Function()` in `js/engine/script-manager.js`. The engine allowed defining entire JavaScript classes within scene JSON files using a `source` property, which was then executed using `new Function()`.

**Learning:** This pattern is highly dangerous for data-driven applications that load configuration from potentially untrusted or external sources. Even with a warning in the code, the presence of such a mechanism is a major security risk. Additionally, dynamic `import()` calls without input validation can lead to path traversal vulnerabilities.

**Prevention:** Eliminate the use of `new Function()` or `eval()` for executing code from data files. Instead, enforce a strict mapping of allowed script types to external files and validate the type names using a safe regex (e.g., `/^[a-zA-Z0-9_-]+$/`). Use a strict Content Security Policy (CSP) to prevent unauthorized script execution and resource loading.
