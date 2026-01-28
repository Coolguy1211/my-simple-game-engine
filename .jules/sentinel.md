## 2024-05-20 - Critical RCE Vulnerability in Script Manager
**Vulnerability:** The `script-manager.js` module allowed for arbitrary code execution by creating a new Function from a `source` property in the scene's JSON configuration.
**Learning:** Loading and executing code from external, untrusted data sources is a major security risk. The `new Function()` constructor is a dangerous sink that can easily lead to RCE vulnerabilities.
**Prevention:** All game logic and behaviors should be loaded from trusted, file-based scripts. Dynamic code execution from data files should be avoided entirely.
