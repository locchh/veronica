---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.py"
---

# No Symptom Fixes

Before changing code to fix a bug, you must:

1. Be able to **reproduce** the bug locally with a concrete command or test.
2. Explain in one sentence **why** the original code was wrong.
3. Confirm the fix addresses the cause, not just the visible symptom.

Forbidden patterns:

- Wrapping a broken expression in `try/catch` without understanding why it throws.
- Adding a `null`/`undefined` guard for a value that should never be null.
- Changing `===` to `==` (or vice versa) to make a test pass.
- Disabling a failing test to "fix" it.
