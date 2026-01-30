## 2026-01-30 - Remote Code Execution (RCE) via Inline Scripts

**Vulnerability:** The engine allowed executing arbitrary JavaScript from a `source` property in scene JSON files using `new Function()`.

**Learning:** This architectural pattern created a critical security risk where an untrusted scene file could execute malicious code in the user's browser context. While convenient for quick development, it bypassed the security benefits of using separate script files.

**Prevention:** Removed support for inline scripts and transitioned to a strictly file-based script loading system. All scripts must now be located in the `js/scripts/` directory and referenced by their `type`.
