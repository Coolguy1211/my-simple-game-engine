## 2024-07-16 - RCE via Inline Scripts (`new Function()`)

**Vulnerability:** The `script-manager.js` file used `new Function()` to execute JavaScript code directly from a `source` property in scene JSON files. This created a critical Remote Code Execution (RCE) vulnerability, allowing an attacker who could control a scene file to run arbitrary code in the context of the application.

**Learning:** The root cause was a design decision that prioritized flexibility (allowing dynamic, inline scripts) over security. The feature was even documented with a warning, indicating the risk was known but accepted. This highlights a common anti-pattern: implementing inherently insecure features with the expectation that users will "use them carefully."

**Prevention:** Never execute code from untrusted or mutable data sources. All executable logic should come from vetted, static application code. When a feature is identified as inherently insecure (like this one), the most effective mitigation is not to sanitize it, but to remove it entirely. Future development should prohibit patterns like `eval()`, `new Function()`, or interpreting strings as code.
