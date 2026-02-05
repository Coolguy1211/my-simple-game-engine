## 2025-05-14 - Fix Remote Code Execution and Path Traversal in script loading
**Vulnerability:** The engine supported executing arbitrary JavaScript from a `source` property in scene JSON files via `new Function()`. Additionally, script `type` parameters were not validated, allowing potential path traversal during dynamic imports.
**Learning:** Data-driven designs often introduce RCE risks when allowing "inline" code for convenience. Even with warnings, the presence of such features is a major security flaw.
**Prevention:** Strictly enforce that all executable code must come from local, validated source files. Use regex validation for any user-provided strings used in dynamic `import()` calls.
