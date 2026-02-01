## 2024-05-22 - [Critical RCE via Inline Scripts]
**Vulnerability:** Remote Code Execution (RCE) via `new Function()` executing arbitrary strings from JSON scene files.
**Learning:** Allowing code to be defined as strings in data files (like JSON) creates a massive security hole. Even with warnings, the functionality is inherently unsafe.
**Prevention:** Strictly enforce file-based script loading using ES modules (`import()`), which limits execution to files already present on the server.
