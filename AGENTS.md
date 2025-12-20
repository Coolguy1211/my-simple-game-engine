# Sentinel Agent Instructions

This document provides security-related guidelines for agents working on this codebase.

## Inline Scripts (`source` property)

**Status:** REMOVED
**Date:** 2024-05-21

The ability to execute inline scripts from scene files using the `source` property has been permanently removed.

### 🛡️ Security Vulnerability

This feature introduced a critical remote code execution (RCE) vulnerability. Loading scenes from untrusted sources could allow arbitrary JavaScript to be executed in the browser, compromising user data and system security. The `new Function()` constructor, which was used to power this feature, is equivalent to `eval()` and is unsafe to use with user-controllable input.

### 📜 Directive

**Under no circumstances should this feature be reintroduced.** All scripts must be loaded from explicitly defined files in the `js/scripts/` directory. This ensures that all executable code is part of the vetted codebase and prevents malicious actors from injecting code through scene files.

Any attempt to re-implement inline script execution will be rejected.
