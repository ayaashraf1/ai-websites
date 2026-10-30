---
name: react-component-generator
description: "Use when the user asks to create, generate, or scaffold a new React component from a component name and a list of props. Generates a typed TypeScript function component with CSS Modules styling plus a matching Vitest + React Testing Library unit test file. Trigger phrases include 'create a React component', 'generate a component', 'scaffold a component', 'new component with props', and 'component with unit tests'."
argument-hint: "<ComponentName> prop:type prop?:type ..."
---

# React Component Generator

Generate a new React component and its unit test from a component name and a
prop list, following the project's existing conventions.

## When to Use

- The user asks for a new React component by name, with or without props.
- The user asks to scaffold a component *with tests*.
- The user wants a component skeleton that matches existing project patterns.

Do **not** use this skill to modify an existing component, to refactor, or to
write tests for code that already exists.

## Inputs

Collect these before generating. Ask only for what is missing or ambiguous.

| Input | Required | Default |
|---|---|---|
| Component name | Yes | — |
| Props (name, type, required/optional) | No | No props |
| Target directory | No | `src/components` |

**Component name** must be `PascalCase`. If the user supplies another case
(`user-card`, `userCard`), convert it to `UserCard` and state the conversion.

**Props** may arrive as prose ("a title string and an optional count number")
or shorthand (`title:string count?:number`). Normalize both into a list of
`{ name, type, required }`. Mark a prop optional when the user says
"optional", uses `?`, or gives a default value.

## Conventions

Generated code targets this stack:

- **TypeScript** function components (`.tsx`), typed with an exported
  `Props` interface. No `React.FC`.
- **CSS Modules** (`<ComponentName>.module.css`), imported as `styles`.
- **Vitest + React Testing Library** for unit tests
  (`<ComponentName>.test.tsx`).

Before writing files, inspect the target project and **prefer its existing
conventions over these defaults** when they conflict:

- Check `package.json` for `vitest` vs `jest`, and for the React version.
- Check neighbouring components for file naming, default vs named exports,
  and styling approach (CSS Modules, Tailwind, styled-components).
- Check `tsconfig.json` for path aliases to use in imports.

State explicitly in your response when you deviate from the defaults above
because the project uses something different.

## Procedure

1. **Resolve inputs.** Determine the component name, prop list, and target
   directory. Convert the name to `PascalCase`.

2. **Inspect the project.** Confirm the test runner, styling approach, and
   export style, as described in [Conventions](#conventions). If the project
   has no React setup at all, say so and ask whether to proceed with the
   defaults.

3. **Check for collisions.** If `<ComponentName>.tsx` already exists in the
   target directory, stop and ask the user whether to overwrite, choose a
   different name, or pick a different directory. Never silently overwrite.

4. **Generate the component** from
   [Component.tsx.template](./templates/Component.tsx.template):
   - Replace `__COMPONENT_NAME__` with the component name.
   - Build the `Props` interface from the prop list. Mark optional props with
     `?`. Omit the interface and the props parameter entirely when there are
     no props.
   - Render required string/number props as text and leave a clear slot for
     the rest. Do not invent behavior the user did not ask for.
   - Always spread or accept an optional `className` so callers can style the
     root element.

5. **Generate the stylesheet** from
   [Component.module.css.template](./templates/Component.module.css.template).
   Keep it minimal — a single root class named after the component in
   camelCase. Skip this file if the project does not use CSS Modules.

6. **Generate the unit test** from
   [Component.test.tsx.template](./templates/Component.test.tsx.template).
   Follow [testing patterns](./references/testing-patterns.md) for what to
   cover. At minimum the test file must:
   - Render the component with valid required props.
   - Assert on user-visible output for each required prop.
   - Cover optional-prop present/absent behavior.
   - Cover any callback prop via `userEvent` and a `vi.fn()` spy.

7. **Validate.** Run the project's typecheck and the new test file, for
   example:

   ```bash
   npx tsc --noEmit
   npx vitest run src/components/<ComponentName>/<ComponentName>.test.tsx
   ```

   Fix any failures before reporting completion. If the commands are not
   available in the project, say so explicitly rather than claiming the code
   was verified.

8. **Report.** List the created files and summarize the props and the test
   cases covered.

## Output Layout

Default to a folder per component:

```text
src/components/<ComponentName>/
├── <ComponentName>.tsx
├── <ComponentName>.module.css
└── <ComponentName>.test.tsx
```

If the project instead keeps flat files in `src/components/`, match that
layout rather than introducing folders.

## Completion Checklist

Before reporting completion, verify that:

- The component name is `PascalCase` and the file names match it.
- Every prop the user listed appears in the `Props` interface with the
  correct type and optionality.
- No prop is declared but unused, and no undeclared prop is referenced.
- The test file imports the component by its real path and export style.
- Each required prop and each callback prop has at least one assertion.
- Typecheck and the new tests pass, or any skipped check is stated clearly.
