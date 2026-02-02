## 2026-02-02 - [RCE via Inline Scripts]
**Vulnerability:** Remote Code Execution (RCE) via the `source` property in scene JSON files. The engine used `new Function()` to execute arbitrary JavaScript strings provided in the configuration.
**Learning:** Data-driven architectures that allow executable code within data files (like JSON) create significant security risks. Even with warnings, the presence of such a feature is a major vulnerability.
**Prevention:** Strictly separate data from code. Load scripts only from trusted, local files and use a whitelist or strict validation (e.g., regex) for dynamic identifiers to prevent path traversal.
