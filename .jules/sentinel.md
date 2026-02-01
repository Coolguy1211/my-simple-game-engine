## 2024-05-23 - Remote Code Execution via Inline Scripts
**Vulnerability:** The engine used `new Function()` to execute arbitrary JavaScript code provided in the `source` property of scene JSON files.
**Learning:** Data-driven designs can inadvertently introduce RCE if they allow executable code in configuration files.
**Prevention:** Strictly use file-based scripts and validate their identifiers against a safe whitelist (regex) to prevent path traversal.

## 2024-05-23 - CSP and ES Module Shims
**Vulnerability:** Lack of Content Security Policy (CSP) allowed arbitrary script execution and data exfiltration.
**Learning:** Adding a CSP to a project using `es-module-shims` requires allowing `blob:` and `'unsafe-inline'` (for the shim's polyfill logic and importmaps) to maintain functionality.
**Prevention:** Carefully tune CSP directives to balance security and the technical requirements of core libraries like Three.js and ES module polyfills.
