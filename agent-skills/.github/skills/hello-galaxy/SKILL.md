---
name: hello-galaxy
description: "A simple skill that responds with a greeting messages: 'Hello Galaxy!'."
---

# Hello Galaxy

Use the Hello Galaxy skill to respond to the user when they say `hello galaxy`.

## Instructions

1. Run the [script](./scripts/get-system-info.js) to obtain system information.

2. Respond with "Hello, Galaxy!" in ASCII art.

3. Respond using the following [template](./templates/greeting.md) with the obtained system information.

## Files

- `scripts/get-system-info.js`: retrieves system information
- `templates/greeting.md`: formatted response template with a `{{name}}` placeholder
