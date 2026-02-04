## 2025-05-15 - Removed RCE and Path Traversal in Script Loading
**Vulnerability:** The engine supported inline JavaScript execution via a `source` property in scene JSON files using `new Function()`. Additionally, dynamic script loading via `import()` was vulnerable to path traversal because the `type` parameter was not validated.
**Learning:** Allowing code execution from data files is extremely dangerous, especially if those files can be provided by users or third parties. Even with "trusted" data, it's a major security gap.
**Prevention:** Always use file-based logic for executable code and strictly validate any parameters used to construct file paths for dynamic imports. Use regex to restrict allowed characters in filenames.
